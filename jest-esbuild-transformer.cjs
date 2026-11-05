const { transformSync } = require('esbuild');

module.exports = {
  process(sourceText, sourcePath) {
    const result = transformSync(sourceText, {
      loader: sourcePath.endsWith('.tsx') ? 'tsx' : 'ts',
      format: 'cjs',
      target: 'es2022',
      sourcemap: 'inline',
    });
    return {
      code: result.code,
    };
  },
};
