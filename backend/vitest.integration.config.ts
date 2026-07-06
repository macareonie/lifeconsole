import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/integration/setup.integration.ts"],
    include: ["tests/integration/**/*.test.ts"],
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
