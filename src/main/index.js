export default () => {

  // 判断手机端
  if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
    return
  }

  // 判断引擎
  if (!window.WebGLRenderingContext) {
    return
  }

  // 文件静态资源路径
  var resourcePath = 'https://cdn.jsdelivr.net/gh/fz6m/Private-web@50.2/static/'
  // rainbow 动画列表
  var rainbowAnimation = ['l2d-rainbow', 'l2d-jitter']
  // 音乐列表
  var musicUrls = [
    'http://music.163.com/song/media/outer/url?id=461301621.mp3',
    'http://music.163.com/song/media/outer/url?id=460528.mp3',
    'http://music.163.com/song/media/outer/url?id=34609107.mp3'
  ]
  // 链接颜色
  var color = '#FFF0F5'
  // 音乐 mediaSession 媒体元信息
  var mediaInfo = {
    title: '桃饱之声',
    artist: 'fz6m',
    album: 'Peach-Max',
    artwork: resourcePath + 'music/img/artwork.png', // 专辑封面
    artworkTpye: 'image/png' // 封面图片类型 image/jpeg or image/png
  }
  // 音乐是否初始化
  var musicInited = false
  // 正在播放的音乐
  var audio = null
  // 一言计时器
  var hitokotoTimer = null
  // 监测闲置的 timer
  var sleepyTimer = null
  // 隐藏消息的 timer
  var hideTimer = null

  // live2d 可移动变量
  var live2d = $('#landlord')
  var dragging = false
  var iX, iY, bottom

  // localStorage key
  var localKey = {
    hidden: 'live2d-hidden'
  }

  // home
  const home = 'fz6m.com'

  // 主进程
  function start() {
    $(document).ready(function () {
      var materialList = [
        resourcePath + 'model/histoire/histoire.1024/texture_00.png',
        resourcePath + 'model/histoire/histoire.1024/texture_01.png',
        resourcePath + 'model/histoire/histoire.1024/texture_02.png',
        resourcePath + 'model/histoire/histoire.1024/texture_03.png'
      ]
      var images = []
      var loaded = 0
      var loadingDelay = 1300
      var loadBuffer = 200
      for (var i = 0; i < materialList.length; i++) {
        images[i] = new Image()
        images[i].src = materialList[i]
        images[i].onload = function () {
          loaded++
          if (loaded === materialList.length) {
            if (localStorage.getItem(localKey.hidden) == 'true') {
              setTimeout(function () {
                $('#open-live2d').fadeIn(loadBuffer)
              }, loadingDelay)
            } else {
              setTimeout(function () {
                $('#landlord').fadeIn(loadBuffer)
              }, loadingDelay)
            }
            setTimeout(function () {
              loadlive2d('live2d', resourcePath + 'model/histoire/model.json')
            }, 1000)
            // 初始化 live2d
            initLive2d()
            images = null
          }
        }
      }
    })
  }

  // 工具函数
  var utils = {
    random: function (array) {
      return array[Math.floor(Math.random() * array.length)]
    },
    // 一言节流
    throttle: function (func, wait = 2000) {
      var timeout;
      return function () {
        var context = this;
        var args = arguments;
        if (!timeout) {
          func.apply(context, args)
          timeout = setTimeout(function () {
            clearTimeout(timeout)
            timeout = null
          }, wait)
        }
      }
    },
    /**
     * @description: 替换文本中的变量
     * @param {string} text 原模板字符串 
     * @param {object} context 要替换的消息来源对象
     * @return {string} 
     */
    formatVar: function (text, context) {
      var reg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g // abc {text} def  ->  abc title def
      return text.replace(reg, function (word, slash1, token, slash2) {
        if (slash1 || slash2) {
          word = word.replace(slash1, '').replace(slash2, '')
        }
        var variables = token.replace(/\s/g, '').split('.')
        var currentObject = context
        for (var i = 0; i < variables.length; ++i) {
          currentObject = currentObject[variables[i]]
          if (!currentObject) return word
        }
        return word.replace(token, currentObject).replace('{', '').replace('}', '')
      })
    },
    // 清理常时一言计时器
    hitokotoClear: function () {
      clearInterval(hitokotoTimer)
      hitokotoTimer = null
    },
    // 一言常时启动器
    hitokotoStart: function () {
      if (hitokotoTimer) return
      hitokotoTimer = setInterval(function () {
        hitokoto()
      }, 15000)
    },
    // 点击防抖
    debounce: function (func, tip, wait = 2000) {
      var timeout;
      return function () {
        var context = this;

        if (timeout) clearTimeout(timeout);

        var callNow = !timeout;
        timeout = setTimeout(() => {
          timeout = null;
        }, wait)

        if (callNow) func.call(context, tip)
      }
    },
    // 取消选中
    unSelection: function () {
      window.getSelection && window.getSelection().removeAllRanges()
      document.selection && document.selection.empty()
    }
  }

  // 初始化 utils.formatVar
  function formatInit() {
    String.prototype.formatVar = function (context) {
      return utils.formatVar(this, context)
    }
  }

  // 展示消息
  function showMessage(text, timeout = 5000) {
    if (Array.isArray(text)) {
      text = utils.random(text)
    }
    $('.message').html(text)
    $('.message').fadeTo(200, 1)
    resetLive2d()
    hideMessage()
  }

  // 隐藏消息
  function hideMessage(timeout = 5000) {
    if(hideTimer) return
    hideTimer = true
    setTimeout(function () {
      $('.message').fadeTo(200, 0)
      hideTimer = false
    }, timeout)
  }

  // 监测控制台
  function onDevtools() {
    var element = new Image();
    Object.defineProperty(element, "id", {
      get: function () {
        showMessage('哈哈，你打开了控制台，是想要看看我的秘密吗？')
      },
    });
    console.log(element);
  }

  // 监测 copy
  function onCopy() {
    $(document).on('copy', function () {
      showMessage('你都复制了些什么呀，转载要记得加上出处哦~~')
    })
  }

  // 监测来源 and 首页时间提醒 and 文章页提示
  function onReferrer() {

    // 站点主页，需要斜杠结尾
    var homePath = document.location.protocol + '//' + window.document.location.hostname + '/'
    // 提示文字
    var text = null

    if (document.referrer && !~document.referrer.hostname.indexOf(home)) {
      var referrer = document.createElement('a')
      referrer.href = document.referrer
      var domain = referrer.hostname.split('.')[1]
      switch (domain) {
      case 'baidu':
        text = '嗨！ 来自 百度搜索 的朋友！<br>欢迎访问<span style="color:' + color + ';">「 ' + document.title.split(' - ')[0] + ' 」</span>'
        break
      case 'so':
        text = '嗨！ 来自 360搜索 的朋友！<br>欢迎访问<span style="color:' + color + ';">「 ' + document.title.split(' - ')[0] + ' 」</span>'
        break
      case 'google':
        text = '嗨！ 来自 谷歌搜索 的朋友！<br>欢迎访问<span style="color:' + color + ';">「 ' + document.title.split(' - ')[0] + ' 」</span>'
        break
      default:
        text = '嗨！来自 <span style="color:' + color + ';">' + referrer.hostname + '</span> 的朋友！'
      }
    } else {
      // 判断是否站点首页
      if (window.location.href == homePath) {
        var now = (new Date()).getHours()
        switch (now) {
        case now > 23 || now <= 5:
          text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？'
          break
        case now > 5 && now <= 7:
          text = '早上好！一日之计在于晨，美好的一天就要开始了！'
          break
        case now > 7 && now <= 11:
          text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！'
          break
        case now > 11 && now <= 14:
          text = '中午了，工作了一个上午，现在是午餐时间！'
          break
        case now > 14 && now <= 17:
          text = '午后很容易犯困呢，今天的目标完成了吗？'
          break
        case now > 17 && now <= 19:
          text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~~'
          break
        case now > 19 && now <= 21:
          text = '晚上好，今天过得怎么样？'
          break
        case now > 21 && now <= 23:
          text = '已经这么晚了呀，早点休息吧，晚安~~'
          break
        default:
          text = '嗨~ 快来逗我玩吧！'
        }
      } else {
        text = '欢迎阅读<span style="color:' + color + ';">「 ' + document.title.split(' - ')[0] + ' 」</span>'
      }
    }

    showMessage(text, 10000)
  }

  // 一言
  function hitokoto() {

    var hitokotoPath = 'https://v1.hitokoto.cn/'

    // 闲置后监测是否上线
    function checkSleep() {
      if (sessionStorage.getItem('Sleepy') !== '1') {
        showMessage('你回来啦~')
        clearInterval(sleepyTimer)
        sleepyTimer = null
      }
    }

    // 监测是否闲置
    if (sessionStorage.getItem('Sleepy') !== '1') {
      $.getJSON(hitokotoPath, function (res) {
        res && showMessage(res.hitokoto)
      })
    } else {
      if (sleepyTimer) return
      sleepyTimer = setInterval(function () {
        checkSleep()
      }, 200)
    }

  }

  // 一言按钮
  function hitokotoButton() {
    utils.hitokotoClear()
    hitokoto()
    setTimeout(utils.hitokotoStart, 5000)
  }

  // 鼠标当前对象提示语
  function currentTip() {
    $.ajax({
      cache: true,
      url: resourcePath + 'message.json',
      dataType: 'json',
      success: function (result) {
        // 鼠标事件
        $.each(result.mouseover, function (index, tips) {
          // 鼠标触摸焦点
          $(tips.selector).mouseover(function () {
            utils.hitokotoClear()
            var text = tips.text
            if (Array.isArray(text)) text = utils.random(text)
            text = text.formatVar({ text: $(this).text() })
            showMessage(text)
          })
          // 鼠标移开
          $(tips.selector).mouseout(function () {
            utils.hitokotoStart()
          })
        })

        // 点击事件
        function clickEvent(tips) {
          utils.hitokotoClear()
          var text = tips.text
          if (Array.isArray(text)) text = utils.random(text)
          text = text.formatVar({ text: $(this).text() })
          showMessage(text)
          // 重置一言
          setTimeout(utils.hitokotoStart(), 10000)
        }
        $.each(result.click, function (index, tips) {
          $(tips.selector).click(
            utils.debounce(clickEvent, tips, 2000)
          )
        })
      }
    })
  }

  // 重置 live2d 状态（说话）
  function resetLive2d() {
    $('#live_talk').val('1')
  }

  // live2d 可拖动
  function onDrag() {
    live2d.mousedown(function (e) {
      utils.unSelection();
      dragging = true;
      iX = e.clientX - this.offsetLeft;
      iY = e.clientY;
      bottom = +live2d.css('bottom').replace('px', '')
      return false;
    });

    document.onmousemove = function (e) {
      if (dragging) {
        var e = e || window.event;
        live2d.css({
          "left": e.clientX - iX + "px",
          "bottom": bottom + iY - e.clientY + "px"
        });
        return false;
      }
    };

    $(document).mouseup(function (e) {
      dragging = false;
      e.cancelBubble = true;
    })
  }

  // 初始化 live2d
  function initLive2d() {

    // 隐藏按钮
    $('#hide-button').on('click', function () {
      if (localStorage.getItem(localKey.hidden) == 'true') {
        return false
      }
      localStorage.setItem(localKey.hidden, true)
      $('#landlord').fadeOut(200)
      $('#open-live2d').delay(200).fadeIn(200)
    })

    // 显示按钮
    $('#open-live2d').on('click', function () {
      if (localStorage.getItem(localKey.hidden) != 'true') {
        return false
      }
      localStorage.setItem(localKey.hidden, false)
      $('#open-live2d').fadeOut(200)
      $('#landlord').delay(200).fadeIn(200)
    })

    // rainbow 按钮
    $('#rainbow-button').on('click', function () {
      if ($('#rainbow-button').hasClass('jitter')) {
        $('#rainbow-button').removeClass('jitter')
        $('html').removeClass($('#rainbow-button').data('animation'))
      } else {
        var animation = utils.random(rainbowAnimation)
        $('#rainbow-button').addClass('jitter')
        $('html').addClass(animation)
        $('#rainbow-button').data('animation', animation)
      }
    })

    // 初始化媒体元信息
    function musicMediaSessionInit() {
      if ('mediaSession' in navigator) {
        // 下一首
        navigator.mediaSession.setActionHandler('nexttrack', function () {
          musicPlay();
        });
        // 上一首
        navigator.mediaSession.setActionHandler('previoustrack', function () {
          musicPlay();
        });
        // 暂停
        navigator.mediaSession.setActionHandler('pause', function () {
          audio.pause()
          navigator.mediaSession.playbackState = 'paused';
        });
        // 播放
        navigator.mediaSession.setActionHandler('play', function () {
          audio.play()
          $('#music-button').addClass('play')
        })
      }
    }

    // 播放音乐
    function musicPlay() {
      if(audio) {
        audio.pause()
        audio = null
      }
      audio = new Audio(utils.random(musicUrls));
      audio.load(); // This could fix iOS playing bug
      // 添加媒体元信息
      if ('mediaSession' in navigator) {
        const metadata = {
          title: mediaInfo.title,
          artist: mediaInfo.artist,
          album: mediaInfo.album + '(^・ω・^§)',
          artwork: [{ src: mediaInfo.artwork, sizes: '128x128', type: mediaInfo.artworkTpye }]
        };
        navigator.mediaSession.metadata = new window.MediaMetadata(metadata);
        navigator.mediaSession.playbackState = 'playing';
      }
      // 缓冲
      audio.addEventListener('canplay', function () {
        audio.volume = 1;
        audio.play();
        $('#music-button').addClass('play')
      });
      // 播放完毕
      audio.addEventListener('ended', function () {
        musicPlay()
      });
      // 播放暂停
      audio.addEventListener('pause', function () {
        $('#music-button').removeClass('play')
        navigator.mediaSession.playbackState = 'paused';
      });
      // 加载错误
      audio.addEventListener('error', function () {
        audio.pause()
        $('#music-button').removeClass('play')
        showMessage('音乐似乎加载不出来了呢！')
      })
    }

    // 音乐按钮
    if (!musicUrls.length) {
      $('#music-button').hide()
    } else {
      $('#music-button').on('click', function () {
        if (!musicInited) {
          musicMediaSessionInit()
          musicInited = true
        }
        if ($('#music-button').hasClass('play')) {
          audio.pause()
        } else {
          if (audio) {
            audio.play()
            $('#music-button').addClass('play')
          } else {
            musicPlay()
          }
        }
      })
    }

    // 一言按钮
    $('#talk-button').on('click', utils.throttle(hitokotoButton))

    // 监测控制台
    onDevtools()

    // 监测 copy
    onCopy()

    // 监测来源 and 首页时间提醒 and 文章页提示
    onReferrer()

    // 启动常时一言
    utils.hitokotoStart()

    // 初始化字符串模板替换功能
    formatInit()

    // 点击和触摸提示
    currentTip()

    // 监测拖动
    onDrag()

  }

  start()


}