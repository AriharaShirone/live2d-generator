export default () => {

  /**
    <div>
        <div id="landlord">
        <div class="message"></div>
        <canvas id="live2d" width="500" height="560" class="live2d"></canvas>

        <input id="live_talk" name="live_talk" value="1" type="hidden" />

        <div class="live-ico-box">

            <div id="talk-button" class="live-ico-item type-talk"></div>
            <div id="music-button" class="live-ico-item type-music"></div>
            <div id="rainbow-button" class="live-ico-item type-rainbow"></div>
            <div id="hide-button" class="live-ico-item type-quit"></div>

        </div>
        </div>
        <div id="open-live2d">召唤小天使</div>
    </div>
   */
    
  const html = '<div><div id=landlord><div class=message></div><canvas class=live2d height=560 id=live2d width=500></canvas><input id=live_talk name=live_talk type=hidden value=1><div class=live-ico-box><div class="live-ico-item type-talk"id=talk-button></div><div class="live-ico-item type-music"id=music-button></div><div class="live-ico-item type-rainbow"id=rainbow-button></div><div class="live-ico-item type-quit"id=hide-button></div></div></div><div id=open-live2d>召唤小天使</div></div>'

  $('body').append(
    html
  );

}
