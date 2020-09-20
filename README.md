# live2d-generator

自动生成网页左下角 live2d 纸片人的工具

### 使用

```html
<head>
    <!-- live2d 核心 -->
    <script src="https://cdn.jsdelivr.net/gh/fz6m/live2d-generator@1.2/dist/live2d.js"></script>
    <!-- jQuery -->
    <script src='https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js'></script>
</head>
<body>

    <!-- 在 body 的最后 -->
    <!-- live2d 生成器 -->
    <script src="https://cdn.jsdelivr.net/gh/fz6m/live2d-generator@1.2/dist/live2d-generator.js"></script>
</body>
```

### 开发

##### 安装依赖

```bash
    yarn
```

##### 构建

```bash
    yarn build
```

打包后的文件会生成到 `./dist/live2d-generator.js`

### 自定义

##### 事件

live2d 事件核心 `./src/main/index.js` 部分函数说明：

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
`utils.debounce`|点击 live2d 模型发言防抖
`utils.formatVar`|对字符串模板进行替换，只支持将 `{ text: '' }` 替换进字符串中的 `{text}` 位置
`utils.throttle`|主动触发一言的节流


##### 静态资源

在 `./src/main/index.js` 中：

行号|说明
:-:|:-:
14 | 静态文件基础根路径，一般情况下配置 cdn 或站点存放 live2d 资源的基础路径
16 | 可从 live2d 动画按键来触发的特殊动画的类名，一般不需要改动
18 | 可从 live2d 音乐按键触发的音乐列表
24 | 指针 hover 文章标题时，标题部分的文字颜色，一般不需要改动
26 | 从 live2d 音乐按键来播放媒体时，支持 `navigator.mediaSession` 的浏览器右上角媒体卡片显示的信息
55 | 主进程 `start()` 函数内配置了 live2d 模型相关的文件子路径
320 | 鼠标事件提示文字文件的路径，可参见 `./src/static/message.json`



### 示例
![](https://cdn.jsdelivr.net/gh/fz6m/Private-picgo@moe/img/20200910190542.png)


### 其他
建议搭配 [拉姆雷姆](https://github.com/fz6m/lamu-leimu-button) 回到顶部/前往底部 按钮使用（完美兼容）
