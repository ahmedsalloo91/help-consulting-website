import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser", fullyParallel: false,
  use: { baseURL: "http://localhost:3100", screenshot: "only-on-failure" },
  webServer: { command: "npm run start -- --port 3100", url: "http://localhost:3100/helpcast", reuseExistingServer: false },
  outputDir: "outputs/helpcast-tests"
});
