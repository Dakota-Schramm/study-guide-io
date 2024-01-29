const config = {
    parallel: 2,
    paths: ['src/features/**/*.feature'],
    require: ['src/tests/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'summary',
      'progress-bar',
      "html:cucumber-report.html"
    ],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true,
  };

module.exports = {
  default: config
}
