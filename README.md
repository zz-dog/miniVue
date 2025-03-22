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
- 性能优化：求最长连续子序列，在子组件的插入/删除时可以减少对 dom 的操作

### 组件的渲染

- 组件由两个虚拟节点组成 h(component),component 对象中的 rander/setup 方法返回一个 h 函数
- 组件挂载时 会将 component date 方法返回的数据转化为响应式数据，并维护自己的 effect

### setup

- 允许用户使用 ref,reactive 等方法
- 可以返回一个对象响应式对象数据/()=>vnode
- ()=>vnode 优先级高于 component 中的 render 方法

### 组件的生命的周期

- 采取了发布定于模式
- 将周期函数记录在实例上
- 在组件的挂载，更新，卸载时依次执行

### 组件的 ref

- 定义一个 ref 数据
- vnode 的 props.ref 记录 ref
- 判断 vnode 是否为状态组件
- 状态式组件：将 intance.exposed/instance.proxy 传入
- 普通 vnode：将创建的真实 dom 传入

### 依赖注入 实现原理

- 建立父子实例依赖关系 children -> parent,将父实例中的 provides 存入子实例的 provides
- 调用 provide 时会拷贝当前的 provides 避免修改父实例中的 provides,并添加用户提供的 key,value
- 调用 inject 时返回当前的 provides[key]

### Teleport 组件

- 和 render 组件相似
