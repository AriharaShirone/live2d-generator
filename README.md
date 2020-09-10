# live2d-generator

自动生成网页左下角 live2d 纸片人工具

### 使用

```html
<head>
    <!-- live2d 核心 -->
    <script src="https://cdn.jsdelivr.net/gh/fz6m/live2d-generator@1.0/dist/live2d.js"></script>
    <!-- jQuery -->
    <script src='https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js'></script>
</head>
<body>

    <!-- 在 body 的最后 -->
    <!-- live2d 节点生成器 -->
    <script src="https://cdn.jsdelivr.net/gh/fz6m/live2d-generator@1.0/dist/live2d-generate.min.js"></script>
    <!-- live2d 自定义事件 -->
    <script src="https://cdn.jsdelivr.net/gh/fz6m/live2d-generator@1.0/dist/live2d-main.min.js"></script>
</body>
```

### 自定义
live2d 事件核心 `./js/live2d-main.js` 部分函数说明：

函数名 | 说明
:-:|:-:
`start`|加载 live2d 模型材质，初始化自定义事件函数 `initLive2d` 
`initLive2d`|初始化 live2d 自定义事件主函数
`musicMediaSessionInit`|初始化右上角媒体卡片事件
`onDevtools`|监测打开控制台事件
`onCopy`|监测复制文字事件
`onReferrer`|根据来源提示，不同时间提醒，文章阅读提示
`onDrag`|监测拖动事件，使 live2d 可移动位置
`currentTip`|根据鼠标触摸和点击提示不同文字功能函数
`hitokoto`|一言功能主函数
`resetLive2d`|重置 live2d 状态，当 `#live_talk` 节点的 `value` 为 `1` 时表示说话中
`utils.debounce`|点击 live2d 发言防抖
`utils.formatVar`|对字符串模板进行替换，只支持将 `{ text: '' }` 替换进字符串中的 `{text}` 位置
`utils.throttle`|主动触发一言节流

live2d 触发事件提示文字文件： `./static/message.json` 

如果你需要自定义模型与提示文字，请根据 `./js/live2d-main.js` 做相应的路径替换。

### 示例
![](https://cdn.jsdelivr.net/gh/fz6m/Private-picgo@moe/img/20200910190542.png)


### 其他
建议搭配 [拉姆雷姆](https://github.com/fz6m/lamu-leimu-button) 回到顶部/前往底部 按钮使用（完美兼容）
