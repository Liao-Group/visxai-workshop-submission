function showVideo(videoId) {
    const videos = document.querySelectorAll('video');
    const placeholder = document.getElementById('placeholder');
    const buttons = document.querySelectorAll('.styled-button');
  
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
  
    if (videoFound) {
      placeholder.style.display = 'none';
    } else {
      placeholder.style.display = 'flex';
    }
  
    buttons.forEach(button => {
      if (button.getAttribute('onclick').includes(videoId)) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }