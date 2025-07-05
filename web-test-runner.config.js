export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  testFramework: {
    config: {
      timeout: 3000
    }
  },
  browsers: [
    {
      name: 'chromium',
      launchOptions: {
        args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
      }
    }
  ],
  testRunnerHtml: testFramework => `
    <html>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `
};