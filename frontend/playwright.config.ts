import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './e2e',
    globalSetup: './e2e/global-setup.ts',
    reporter: 'html',

    timeout: 30_000,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,

    expect: {
        timeout: 5_000,
    },

    use: {
        baseURL: 'http://localhost:3000',
        storageState: 'e2e/storageState.json',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    projects: [
        { name: 'chromium', use: { browserName: 'chromium' } },
    ],

    webServer: [
        {
            command: 'cd ../backend && npm run dev',
            port: 4000,
            reuseExistingServer: true,
        },
        {
            command: 'npm run dev',
            port: 3000,
            reuseExistingServer: true,
        }
    ],
})