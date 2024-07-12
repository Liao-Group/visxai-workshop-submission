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

  // Update button styles
  const buttons = document.querySelectorAll('.styled-button');
  buttons.forEach(button => {
    if (button.getAttribute('onclick').includes(videoId)) {
      if (button.classList.contains('one')) {
        button.style.backgroundColor = '#024d82';
      } else if (button.classList.contains('two')) {
        button.style.backgroundColor = '#01ab8e';
      } else if (button.classList.contains('three')) {
        button.style.backgroundColor = '#f47200';
      }
      button.style.color = 'white';
    } else {
      button.style.backgroundColor = 'white';
      button.style.color = 'black';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.styled-button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      showVideo(button.getAttribute('onclick').match(/'([^']+)'/)[1]);
    });
  });
});