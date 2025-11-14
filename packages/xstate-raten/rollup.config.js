import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
  return (id) => pattern.test(id);
};

const createTsPlugin = (declaration = true) =>
  typescript({
    clean: true,
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      compilerOptions: {
        declaration,
        importHelpers: false,
        declarationDir: './lib'
      }
    },
    typescript: require('typescript')
  });

const createNpmConfig = ({ input, output }) => ({
  input,
  output,
  preserveModules: true,
  external: makeExternalPredicate([
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ]),
  plugins: [createTsPlugin()]
});

export default [
  createNpmConfig({
    input: 'src/index.ts',
    output: [
      {
        dir: 'es',
        format: 'esm'
      }
    ]
  }),
  createNpmConfig({
    input: 'src/index.ts',
    output: [
      {
        dir: 'lib',
        format: 'cjs'
      }
    ]
  })
];

