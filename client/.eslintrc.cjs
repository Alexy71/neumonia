module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/jsx-key': 2,
    'react/no-array-index-key': 0,
    'no-console': 1,
    'indent': ['error', 2],
    "react/prop-types": "off",
    'react/jsx-max-props-per-line': [
      'error',
      {
        maximum: 1, // Número máximo de props por línea (en este caso, se establece en 1 para forzar un solo prop por línea)
        when: 'always', // Aplicar la regla siempre, independientemente de la longitud de la línea
        
      },
    ],

  },
}
