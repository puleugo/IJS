module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "plugin:@typescript-eslint/recommended"
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    // "no-console": "error", // TODO: console -> logger
    "indent": ["error", "tab", { "SwitchCase": 1, "ignoredNodes": ["PropertyDefinition"] }], // 탭으로 분리(ide에서 4로 설정할 것), 데코레이터 이후의 노드는 무시
    "semi": ["error", "always"], // 세미콜론 사용
    "array-element-newline": ["error", "never"],
    "quotes": [2, "single", { "avoidEscape": false }], // ', `만 허용
    "eqeqeq": [2, "allow-null"], // == 금지
    "padding-line-between-statements": ["error", { "blankLine": "always", "prev": "*", "next": "return" }], // return 앞에는 빈줄 강제
    "no-empty": ["error", { "allowEmptyCatch": false }], // 빈 catch 금지
    "eol-last": 2, // 파일 끝에 개행문자가 없을 경우 경고
    "camelcase": ["error", { "properties": "never" }], // 카멜케이스 강제
    "space-in-parens": [2, "never"],// 괄호`()` 안에 공백을 추가하지 않습니다.
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }], // 빈줄 최대 1개
    "space-before-blocks": [2, "always"], // 블록 앞에 공백을 강제
    "brace-style": [2, "1tbs", { "allowSingleLine": true }], // 중괄호 스타일
    "@typescript-eslint/explicit-function-return-type": 2, // 명시적 함수 반환 타입 허용
    "@typescript-eslint/explicit-module-boundary-types": 0, // 명시적 모듈 바운더리 타입 허용
    "@typescript-eslint/no-explicit-any": 0, // any 허용
    "function-paren-newline": ["error", "consistent"], // 함수의 인자가 여러줄일 경우, 첫번째 인자는 첫줄에, 나머지는 각각 한줄씩
    "object-property-newline": ["error", { "allowAllPropertiesOnSameLine": false }], // 객체의 프로퍼티가 여러줄일 경우, 첫번째 프로퍼티는 첫줄에, 나머지는 각각 한줄씩
    "function-call-argument-newline": ["error", "never"], // 함수 인자에 줖바꿈 금지
    "comma-dangle": ["error", "always"], // 마지막 콤마 강제, git diff 가독성 향상
    "max-len": [2, 200, 4, { "ignoreUrls": true }] // 한줄의 최대 길이
  }
};
