// Usage: GEMINI_API_KEY=... npm run check:ai
// Lists the models your key can use and runs a tiny JSON test through the
// same fallback logic the API uses.
import "../src/config/env.js";
import { generateJson, listUsableModels } from "../src/services/gemini.service.js";

const models = await listUsableModels();
console.log("Usable models (in order):", models);

try {
  const { data, model } = await generateJson({
    prompt: 'Return {"ok": true, "greeting": "hello"}',
    schema: {
      type: "object",
      properties: { ok: { type: "boolean" }, greeting: { type: "string" } },
      required: ["ok"],
    },
  });
  console.log(`✔ ${model} answered:`, data);
} catch (error) {
  console.error("✘ Test failed:", error.status, error.message);
  process.exitCode = 1;
}
