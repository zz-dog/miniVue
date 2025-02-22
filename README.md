# 简单实现 vue

## 安装依赖

```
pnpm i
```

## 依赖收集，触发更新

- 依赖收集：执行 effect.run 时进行依赖收集
- 触发更新：查找缓存的响应式数据执行 effect.run 方法

## ref,reactive

- ref 通过 set get 属性对数据进行代理（包装属性）
- reactive 基于 Proxy 对数据进行代理

## toRef,toRefs

- reactive 响应式数据结构后会失去响应式
- 转为 toRefs 数据可以结构
- toRef,toRefs 基于 reactive 数据做了一层包装，所以修改 toRef,toRefs 数据时会引起 reactive 数据的更新，
- proxyRefs 可以判断是否是 ref 数据，并代理 value 数据

## computed

- 计算属性具备依赖收集的 effect，依赖的值变化后会触发 effec 的执行。
- 计算属性维护了一个 dirty 属性，默认为 true，运行一次后改为 false，effect 执行后会让 dirty 为 true，可用于缓存数据
- 执行 computed 时会对所依赖的 ref/reactive 数据创建 effect，当所依赖的数据变化时会触发 computed 的自身的依赖更新， 并重新计算
