function showVideo(videoId) {
  const videos = document.querySelectorAll('video');
  const placeholder = document.getElementById('placeholder');

  let videoFound = false;

  videos.forEach(video => {
    if (video.id === videoId) {
      video.style.display = 'block';
      video.play();
      video.playbackRate = 1.5;
      videoFound = true;
    } else {
      video.style.display = 'none';
      video.pause();
      video.currentTime = 0;
    }
  });

  placeholder.style.display = videoFound ? 'none' : 'flex';
}