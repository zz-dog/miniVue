# 简单实现 vue

## 安装依赖

```
pnpm i
```

## 依赖收集，触发更新

- 依赖收集：执行 effect.run 时进行依赖收集
- 触发更新：查找缓存的响应式数据执行 effect.run 方法

## ref,react

- ref 通过 set get 属性对数据进行代理（包装属性）
- react 基于 Proxy 对数据进行代理
