import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Configuration
 * LEARNING: This file configures Playwright test execution, browsers, and reporting
 * SUGGESTION: Use this configuration to understand test setup, parallel execution, and CI/CD integration
 * SUGGESTION: Modify settings based on your project requirements and testing strategy
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* LEARNING: Directory where test files are located */
  fullyParallel: true,
  /* LEARNING: Run tests in parallel for faster execution */
  forbidOnly: !!process.env.CI,
  /* LEARNING: Prevent test.only in CI environments to ensure all tests run */
  retries: process.env.CI ? 2 : 0,
  /* LEARNING: Retry failed tests twice in CI for flaky test handling */
  workers: process.env.CI ? 1 : undefined,
  /* LEARNING: Use single worker in CI to avoid resource conflicts */
  reporter: 'html',
  /* LEARNING: Generate HTML test reports for easy visualization */
  
  /* Shared settings for all projects */
  use: {
    baseURL: 'http://localhost:5173',
    /* LEARNING: Base URL for all navigation actions */
    
    trace: 'on-first-retry',
    /* LEARNING: Collect trace data on first retry for debugging */
    
    screenshot: 'only-on-failure',
    /* LEARNING: Capture screenshots automatically on test failures */
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      /* LEARNING: Test against Chrome browser (Chromium) */
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      /* LEARNING: Test against Firefox browser */
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      /* LEARNING: Test against Safari browser (WebKit) */
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      /* LEARNING: Test against mobile Chrome on Pixel 5 device */
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      /* LEARNING: Test against mobile Safari on iPhone 12 device */
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   /* LEARNING: Optional: Test against Microsoft Edge browser */
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   /* LEARNING: Optional: Test against Google Chrome browser */
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    /* LEARNING: Command to start the development server */
    url: 'http://localhost:5173',
    /* LEARNING: URL to check if server is ready */
    reuseExistingServer: !process.env.CI,
    /* LEARNING: Reuse existing server in local development */
    timeout: 120 * 1000,
    /* LEARNING: Timeout for server startup (120 seconds) */
  },
});
