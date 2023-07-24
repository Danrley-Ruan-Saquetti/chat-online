module.exports = {
    "env": {
        "node": true,
        "es2021": true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        "ecmaVersion": "latest",
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin',
        "@typescript-eslint"
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    root: true,
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        "indent": [
            "off",
            "tabs",
            4
        ],
        "linebreak-style": [
            "off",
            "windows"
        ],
        "quotes": [
            "warn",
            "single"
        ],
        "semi": [
            "warn",
            "never"
        ],
        "curly": [
            "warn",
            "multi-line"
        ],
        "eqeqeq": "off",
        "no-trailing-spaces": "warn",
        "@typescript-eslint/no-var-requires": "off",
        "no-multiple-empty-lines": "off",
        "no-inline-comments": "off",
        "no-explicit-any": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "import/prefer-default-export": "off",
        "@typescript-eslint/no-empty-function": "off",
        "prefer-const": "off",
        "no-empty-pattern": "off",
        "@typescript-eslint/no-empty-interface": "warn",
        "no-empty": "warn",
        "camelcase": "warn",
        "no-unused-expressions": [
            "warn",
            {
                "allowTaggedTemplates": true
            }
        ]
    }
};