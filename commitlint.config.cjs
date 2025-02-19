module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always", // 2表示错误，always表示必须
      [
        "feat", // 新功能（feature）
        "fix", // 修补bug
        "build", // 构建工具的变动
        "docs", // 文档（documentation）
        "style", // 格式（不影响代码运行的变动）
        "refactor", // 重构（即不是新增功能，也不是修改bug的代码变动）
        "perf", // 性能优化
        "test", // 增加测试
        "ci", // CI配置
        "chore", // 构建过程或辅助工具的变动
        "revert", // 回滚
        "release", // 发布
      ],
    ],
    "subject-case": [0, "never"], // 0表示关闭，never表示不限制大小写
    "subject-empty": [2, "never"], // 2表示错误，never表示不允许为空
  },
};
