import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  webServer: {
    command:
      "corepack pnpm exec vite --config vite.config.ts --host 0.0.0.0 --port 4173",
    env: {
      PORT: "4173",
      BASE_PATH: "/",
      NODE_ENV: "test",
    },
    url: "http://127.0.0.1:4173/quiz",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
