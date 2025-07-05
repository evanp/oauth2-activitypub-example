import { chromeLauncher } from '@web/test-runner-chrome';

export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  testFramework: {
    config: {
      timeout: 3000
    }
  },
  browsers: [
    chromeLauncher({ launchOptions: { headless: false } })
  ],
  testRunnerHtml: testFramework => `
    <html>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `
};