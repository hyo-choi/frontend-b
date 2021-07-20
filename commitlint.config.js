module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': () => [2, 'always', 50],
    'type-case': [2, 'always', 'pascal-case'],
    'type-enum': [2, 'always', ['Chore', 'Docs', 'Feat', 'Fix', 'Refactor', 'Style', 'Test']],
    'subject-case': [0, 'always', 0],
  },
};
