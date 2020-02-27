
var player = document.getElementById('videoElement');
var	isPlaying = false;
// if (flvjs.isSupported()) {
// 	var flvPlayer = flvjs.createPlayer({
// 		type: 'flv',
// 		url: 'http://127.0.0.1:8848/lehuo_mui/html/live/index.flv'
// 	});
// 	flvPlayer.attachMediaElement(videoElement);
// 	flvPlayer.load(); //加载
// }

function flv_start() {
	console.log('flv_start')
	player.play();
}

function flv_pause() {
	console.log('flv_pause')
	player.pause();
}

function flv_destroy() {
	player.pause();
	player.unload();
	player.detachMediaElement();
	player.destroy();
	player = null;
}

function flv_seekto() {
	player.currentTime = parseFloat(document.getElementsByName('seekpoint')[0].value);
}

function togglePlay() {
	isPlaying ? flv_pause() : flv_pause()
}