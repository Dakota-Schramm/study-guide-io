const config = {
    parallel: 2,
    paths: ['features/**/*.feature'],
    require: [
      'tests/**/*.ts',
      'specs/**/*.ts',
    ],
    requireModule: ['ts-node/register'],
    format: [
      'summary',
      'progress-bar',
      "html:cucumber-report.html"
    ],
    formatOptions: { snippetInterface: 'async-await' },
  };

module.exports = {
  default: config
}
