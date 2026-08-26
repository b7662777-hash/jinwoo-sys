- **fix(ci):** route `open-sse/handlers/imageGeneration/providers/geminiWeb.ts`'s b64_json
  download-failure message through `sanitizeErrorMessage()` instead of embedding a raw
  `err.message`, clearing the `check:error-helper` base-red on `release/v3.8.50` (#9985).
