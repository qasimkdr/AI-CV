import { GoogleGenAI } from "@google/genai";

import { env } from "../config/env.js";

/*
 * Gemini access tuned for the FREE tier:
 *  1. Ask the API which models this key can use (cached for 6h).
 *  2. Try them in preference order — newest Flash first (best writing),
 *     then Flash-Lite (much larger free daily quota).
 *  3. On 429 (quota) / 404 (retired model) / 5xx (overloaded) fall through to
 *     the next model and remember a cooldown, so later requests skip models
 *     that are out of quota instead of wasting time on them.
 * Override the order with GEMINI_MODELS="model-a,model-b".
 */

// Used when model listing fails, and as the preferred ordering otherwise.
const DEFAULT_PREFERENCE = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-flash-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
];

const MODEL_CACHE_MS = 6 * 60 * 60 * 1000;
const EXCLUDE = /(image|tts|audio|live|embed|vision|thinking-exp|robotics|computer-use|veo|imagen|lyria|aqa|learnlm|gemma|nano)/i;

const ai = env.geminiApiKey
  ? new GoogleGenAI({ apiKey: env.geminiApiKey, httpOptions: { timeout: 60000 } })
  : null;

let cachedModels = null;
let cachedAt = 0;
const cooldowns = new Map(); // model -> timestamp until which we skip it

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const versionOf = (name) => {
  const m = name.match(/gemini-(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : 0;
};

/** Score models we discovered but don't know by name: newer > older, flash > lite > pro. */
const rank = (name) => {
  const tier = /flash-lite/.test(name) ? 1 : /flash/.test(name) ? 2 : /pro/.test(name) ? 0 : -1;
  const preview = /preview|exp/.test(name) ? -0.5 : 0;
  return versionOf(name) * 10 + tier + preview;
};

async function listUsableModels() {
  if (cachedModels && Date.now() - cachedAt < MODEL_CACHE_MS) return cachedModels;

  const available = new Set();
  try {
    const pager = await ai.models.list({ config: { pageSize: 100 } });
    for await (const model of pager) {
      const name = (model.name || "").replace(/^models\//, "");
      const actions = model.supportedActions || [];
      if (!name.startsWith("gemini") || EXCLUDE.test(name)) continue;
      if (actions.length && !actions.includes("generateContent")) continue;
      available.add(name);
    }
  } catch (error) {
    console.warn(`[gemini] Could not list models (${error.status || ""} ${error.message}). Using defaults.`);
  }

  const preference = env.geminiModels.length ? env.geminiModels : DEFAULT_PREFERENCE;

  let ordered;
  if (available.size) {
    const preferred = preference.filter((m) => available.has(m));
    const extra = [...available]
      .filter((m) => !preferred.includes(m) && rank(m) > 0)
      .sort((a, b) => rank(b) - rank(a));
    // Explicit GEMINI_MODELS always come first, even if not listed (aliases).
    ordered = [...new Set([...(env.geminiModels.length ? env.geminiModels : []), ...preferred, ...extra])];
  } else {
    ordered = preference;
  }

  cachedModels = ordered.slice(0, 8);
  cachedAt = Date.now();
  console.log(`[gemini] Model order: ${cachedModels.join(" → ")}`);
  return cachedModels;
}

/** How long to skip a model after an error. */
function cooldownFor(error) {
  const text = `${error.message || ""}`;
  if (error.status === 404 || /not found|not supported|deprecated|no longer available/i.test(text)) {
    return 24 * 60 * 60 * 1000;
  }
  if (error.status === 429) {
    if (/PerDay|per day|daily/i.test(text)) return 60 * 60 * 1000;
    const retry = text.match(/retry(?:Delay)?"?\s*[:=]?\s*"?(\d+(?:\.\d+)?)s/i);
    return retry ? Math.ceil(Number(retry[1]) * 1000) + 1000 : 60 * 1000;
  }
  return 0;
}

const isTransient = (status) => [500, 502, 503, 504].includes(status);

/**
 * Generates JSON from Gemini with automatic model fallback.
 * Returns { data, model }.
 */
export async function generateJson({ prompt, schema, temperature = 0.6 }) {
  if (!ai) {
    const error = new Error("AI is not configured on the server (missing GEMINI_API_KEY).");
    error.status = 503;
    throw error;
  }

  const models = await listUsableModels();
  const now = Date.now();
  let candidates = models.filter((m) => (cooldowns.get(m) || 0) <= now);
  // If everything is cooling down, try the one that frees up soonest.
  if (!candidates.length) {
    candidates = [...models].sort((a, b) => (cooldowns.get(a) || 0) - (cooldowns.get(b) || 0)).slice(0, 1);
  }

  let lastError;
  for (const model of candidates) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature,
            responseMimeType: "application/json",
            responseJsonSchema: schema,
          },
        });

        const text = (response.text || "").replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
        const data = JSON.parse(text);
        cooldowns.delete(model);
        return { data, model };
      } catch (error) {
        lastError = error;
        const status = error.status;

        if (status === 401 || status === 403 || /API key/i.test(error.message || "")) {
          console.error(`[gemini] Auth error on ${model}: ${error.message}`);
          const e = new Error("AI service rejected the API key. Check GEMINI_API_KEY on the server.");
          e.status = 503;
          throw e;
        }

        if (error instanceof SyntaxError) {
          console.warn(`[gemini] ${model} returned invalid JSON, trying next model.`);
          break;
        }

        if (isTransient(status) && attempt === 0) {
          await wait(1200);
          continue;
        }

        const cool = cooldownFor(error);
        if (cool) cooldowns.set(model, Date.now() + cool);
        console.warn(`[gemini] ${model} failed (${status || "?"}): ${(error.message || "").slice(0, 160)}`);
        break;
      }
    }
  }

  const e = new Error(
    lastError?.status === 429
      ? "Free AI quota reached for now. Please try again in a few minutes."
      : "AI service is busy. Please try again in a minute."
  );
  e.status = lastError?.status === 429 ? 429 : 503;
  throw e;
}

export const geminiStatus = () => ({
  configured: Boolean(ai),
  models: cachedModels,
  coolingDown: [...cooldowns.entries()]
    .filter(([, until]) => until > Date.now())
    .map(([model, until]) => ({ model, secondsLeft: Math.round((until - Date.now()) / 1000) })),
});

export { listUsableModels };
