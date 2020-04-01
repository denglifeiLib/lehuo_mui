;(function(window){
  function JumpBubble(opt){
    var _this = this,
        canvas = opt.elCanvas,
        canvasW = canvas.width,
        canvasH = canvas.height;
    if(!canvas){
      console.warn("需要参数elCanvas---canvas dom");
      return;
    }
    _this.canvasInfo = {
      canvas : canvas,
      width : canvasW,
      height : canvasH
    };
    var canvas = _this.canvasInfo.canvas;
    if(!canvas.getContext){
      console.warn("当前浏览器不支持canvas");
      return;
    }
    var config = { //配置气泡冒泡设置
      left : 0,  //距离左侧距离
      top : canvasH - 30, //距离顶部距离
      alpha : 0.9  // 透明度设置
      // width : 30 // 默认使用传入图片的实际宽高，可自定义气泡宽度，高度随宽度变化
    };
    _this.callback = opt.callback; //每添加一个气泡触发一次的回调函数
    _this.config = merge(config, opt.config); //合并配置
    _this.ctx = canvas.getContext("2d");
    _this.bubbleArr = []; //用来存储所有的气泡
  };
  
  JumpBubble.prototype.create = function(opt){
    var _this = this,
        bubbleArr = _this.bubbleArr,
        ctx = _this.ctx,
        img = opt.elImg,
        config = _this.config,
        cfgImgWidth = config.width,
        convasInfo = _this.canvasInfo,
        callback = _this.callback;
    if(!img){
      console.warn("请设置canvas绘制原图{elImg}");
      return;
    }
    var imgInfo = {
      el : img,
      width : cfgImgWidth || img.width,
      height : cfgImgWidth && img.height*(cfgImgWidth/img.width) || img.height
    };
    if(bubbleArr.length>30){
      return false;
    }
    bubbleArr.push(new drawImg(ctx, imgInfo, _this.config, convasInfo));
    //每添加一个气泡触发一次的回调函数,
    // 参数1：canvas元素；参数2：传入的图片元素；参数3：当前存在的气泡数组
    callback && callback(convasInfo.canvas,img,bubbleArr);  
    if(!_this.setInter){
      _this.setInterFn();
    }
  };

  JumpBubble.prototype.setInterFn = function(){
    var t = this,
        ctx = t.ctx,
        convasInfo = t.canvasInfo,
        canvasW = convasInfo.width,
        canvasH = convasInfo.height;
    t.setInter = setInterval(function(){
      ctx.clearRect(0,0,canvasW,canvasH);
      t.bubbleArr = t.bubbleArr.filter(function(val){
        val.addCtx();
        val.updateCtx();
        if(val.y < 10){
          return false;
        }else{
          return true;
        }
      });
      if(t.bubbleArr.length === 0){
        clearInterval(t.setInter);
        t.setInter = null;
        ctx.clearRect(0,0,canvasW,canvasH);
      }
    },50);
  };


  function drawImg(ctx,imgInfo,config ,canvasInfo){
    var p = this;
    p.ctx = ctx;
    p.imgInfo = imgInfo,
    p.img = imgInfo.el;
    p.imgWidth = imgInfo.width;
    p.imgHeight = imgInfo.height;
    p.x = config.left;
    p.y = config.top;
    p.alpha = config.alpha;
    p.canvasInfo = canvasInfo;
  }
  drawImg.prototype.addCtx = function(){
    var p = this,
        ctx = p.ctx;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.drawImage(p.img,p.x,p.y,p.imgWidth, p.imgHeight);
    ctx.restore();
  }
  drawImg.prototype.updateCtx = function(){
    var p = this,
        canvasInfo = p.canvasInfo,
        afterRoad = canvasInfo.height/4;
    if(p.y < afterRoad){
      p.y -= 2.5;
      if(p.alpha <= 0.02){
        p.alpha = 0;
      }else{
        p.alpha -= 0.1;
      }
    }else if(p.y > afterRoad && p.y < afterRoad*2){
      p.y -= 3;
      p.alpha -= 0.1;
    }else{
      p.y -= 4;
    }
  }

  
  function forEach(obj, fn) {
	  if(typeof obj === null || typeof obj === 'undefined') {
		  return;
	  }
	  if(typeof obj !== 'object') {
		  obj = [obj];
	  }
	  if(toString.call(obj) === '[object Array]') {
		  for (var i = 0; i < obj.length; i++) {
			  fn.call(null, obj[i], i, obj);
		  }
	  } else {
		  for ( var key in obj) {
			  fn.call(null, obj[key], key, obj)
		  }
	  }
  }
  
  function merge () {
	  var result = {};
	  function assginValue(val, key) {
		  if(typeof result[key] === 'object' && typeof val === 'object') {
			  result[key] = merge(result[key], val)
		  } else {
			  result[key] = val;
		  }
	  }
	  
	  for (var i = 0; i < arguments.length; i++) {
		  forEach(arguments[i], assginValue)
	  }
	  return result;
  }
  
  
  
  window.JumpBubble = JumpBubble;
})(window);

/*使用demo:
var demo = new JumpBubble({
  elCanvas : document.getElementById("canvasIdName")
});
demo.create({
  elImg : document.getElementById("imgIdName")
});*/