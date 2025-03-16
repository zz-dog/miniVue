# 简单实现 vue

## 安装依赖

```
pnpm i
```

## reactivity vue 响应数据核心

### 依赖收集，触发更新

- 依赖收集：执行 effect.run 时进行依赖收集
- 触发更新：查找缓存的响应式数据执行 effect.run 方法

### ref,reactive

- ref 通过 set get 属性对数据进行代理（包装属性）
- reactive 基于 Proxy 对数据进行代理

### toRef,toRefs

- reactive 响应式数据结构后会失去响应式
- 转为 toRefs 数据可以结构
- toRef,toRefs 基于 reactive 数据做了一层包装，所以修改 toRef,toRefs 数据时会引起 reactive 数据的更新，
- proxyRefs 可以判断是否是 ref 数据，并代理 value 数据

### computed

- 计算属性具备依赖收集的 effect，依赖的值变化后会触发 effect 的执行。
- 计算属性维护了一个 dirty 属性，默认为 true，运行一次后改为 false，effect 执行后会让 dirty 为 true，可用于缓存数据
- 执行 computed 时会对所依赖的 ref/reactive 数据创建 effect，当所依赖的数据变化时会触发 computed 的自身的依赖更新， 并重新计算

### watch

- 侦听函数维护了自身的 effect 所依赖的 ref/reactive 数据更新时就会触发 fn 的执行
- 执行 fn 时侦听器会访问响应数据的属性，使得响应式数据的属性会进行依赖收集
- watch 可返回 unwatch 方法，用于停止监听 ，执行后会清除依赖并使 effect 失活,

## vue 渲染核心

### runtime-dom

- render ceateRender 内置默认的渲染器:基于 DOM 进行渲染
- 对 dom 操作的核心，事件绑定，class 处理，style 修改，创建 dom ,插入 dom ...

### runtime-core

- ceateRender 允许用户自定义染器：可用于跨平台渲染
- patch api 会根据虚拟 DOM 创建真实 DOM 并挂载到目标元素上
- 真实节点创建后，虚拟会记录其节点 el 属性
- render 时 patch 函数会对比上次渲染的 vnode 进行更新节点

### h

- h 可以创建一个虚拟 dom
- vnode 维护一个 shapeFlag 属性通过位运算来判断 children

### diff 算法

- 两组 vnode 进行比较时先从开头进行比较，再从尾部进行比较如果是同一个 vnode 则走递归渲染更新
  最后处理插入/删除的 vnode
- 可根据 vnode 的 el 属性判断是否是创建的新节点

### 组件的渲染

- 组件由两个虚拟节点组成 h(component),component 对象中的 rander 方法返回一个 h 函数
- 组件挂载时 会将 component date 方法返回的数据转化为响应式数据，并维护自己的 effect
