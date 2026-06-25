import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const DEFAULT_MODEL =
  process.env.GEMINI_MODEL ||
  "gemini-2.5-flash";

const FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL ||
  "gemini-2.5-flash-lite";

const wait = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export const enhanceResume = async (
  resumeData
) => {
  console.log(
    "===== RESUME SENT TO AI ====="
  );

  console.log(
    JSON.stringify(
      resumeData,
      null,
      2
    )
  );

  const prompt = `
You are an expert ATS resume writer.

Rewrite the resume professionally.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do NOT use markdown.
3. Do NOT wrap JSON inside \`\`\`.
4. Do NOT add explanations.
5. Preserve ALL user information.
6. Never replace existing information with placeholders.
7. Never write:
   - [University Name]
   - [Company Name]
   - [Your Name]
   - [Phone]
   - [Email]
8. Improve experience descriptions.
9. Improve project descriptions.
10. Improve skills wording.
11. Keep education, certifications, dates and personal information exactly as provided.
12. Preserve the exact JSON structure.

Resume JSON:

${JSON.stringify(
  resumeData,
  null,
  2
)}

Return ONLY valid JSON.
`;

  let result;

  const modelNames = [
    DEFAULT_MODEL,
    FALLBACK_MODEL,
  ].filter(
    (modelName, index, all) =>
      modelName &&
      all.indexOf(modelName) ===
        index
  );

  for (const modelName of modelNames) {
    const model =
      genAI.getGenerativeModel({
        model: modelName,
      });

    for (let i = 0; i < 3; i++) {
      try {
        result =
          await model.generateContent(
            prompt
          );

        break;
      } catch (error) {
        const shouldRetry =
          [429, 500, 503].includes(
            error.status
          ) && i < 2;

        if (shouldRetry) {
          await wait(
            1500 * (i + 1)
          );

          continue;
        }

        if (
          [429, 500, 503].includes(
            error.status
          )
        ) {
          break;
        }

        throw error;
      }
    }

    if (result) {
      break;
    }
  }

  if (!result) {
    const error = new Error(
      "AI service is busy. Please try again in a minute."
    );
    error.status = 503;
    throw error;
  }

  const text =
    result.response.text();

  console.log(
    "===== AI RESPONSE ====="
  );

  console.log(text);

  return text;
};
