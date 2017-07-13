# 一起来造个轮子

## Keynote

[查看Keynote](./keynote)

## demo

需要安装[Athena](https://github.com/o2team/athena)

进入 **demo** 目录执行 `ath s` 即可看到

```
$ ath s
```

jsx语法替换配置在每一个模块的 `module-conf.js` 里的 `support`

例如 `lesson-2` 模块

```javascript
support: {
  useBabel: {
    enable: true,
    jsxPragma: 'createElement'
    // jsxPragma: 'React.createElement'
  }
}
```

若需要查看React例子则 `jsxPragma` 配置为 `React.createElement`，并且重新执行 `ath s`

demo代码例子则为 `createElement`

## Content

### Virtual Dom

#### 缘起

#### 虚拟dom探究

何为虚拟dom

dom 结构 -> dom树

dom树 -> json

virtual dom具体实现

#### jsx

#### dom diff

**目标：实现一个基本可用的virtual dom**

### 基于Virtual Dom的组件框架（一）

#### 组件框架设计

#### 生命周期回顾

#### 组件执行流程图说明

#### 特殊属性特殊处理

**目标：实现一个能一次性挂载渲染的组件框架**

### 基于Virtual Dom的组件框架（二）

#### 组件如何更新，加入组件更新功能后的组件渲染流程图说明

#### 事件处理，合成事件层

#### 性能注意点，组件更新触发，MutationObserver/Promise/setTimeout

#### SVG支持

**目标：实现具有完整功能的组件框架**
