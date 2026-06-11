import rolster from '@rolster/rollup';

export default rolster({
  requiredEsm: true,
  entryFiles: ['index'],
  packages: ['@rolster/i18n']
});
