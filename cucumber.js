const config = {
    parallel: 2,
    paths: ['src/features/**/*.feature'],
    require: [
      'src/tests/**/*.ts',
      'src/specs/**/*.ts',
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
