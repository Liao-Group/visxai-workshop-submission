let selectedInfoId = 'info2';
let selectedClassName = 'two';

function selectVideo(videoId, infoId, className) {
  const videos = document.querySelectorAll('.video-section-container video');
  videos.forEach(video => {
    video.style.display = video.id === videoId ? 'block' : 'none';
    video.id === videoId ? video.play() : video.pause();
    video.currentTime = 0;
  });

  selectedInfoId = infoId;
  selectedClassName = className;
  updateInfoContainer(infoId, className);

  const buttons = document.querySelectorAll('.video-section-container .styled-button');
  buttons.forEach(button => {
    const isSelected = button.getAttribute('onclick').includes(videoId);
    button.style.backgroundColor = isSelected ? getButtonColor(button) : 'white';
    button.style.color = isSelected ? 'white' : 'black';
  });
}

function updateInfoContainer(infoId, className) {
  const infoContainer = document.querySelector('.video-section-container #info-container');
  const infoImage = document.querySelector('.video-section-container #info-image');
  const infoImages = {
    info1: 'resources/psiVideos/psi_options-01.png',
    info2: 'resources/psiVideos/psi_options-02.png',
    info3: 'resources/psiVideos/psi_options-03.png'
  };
  infoImage.src = infoImages[infoId];
  infoContainer.className = `info-container ${className}`;
}

function getButtonColor(button) {
  if (button.classList.contains('one')) return '#024d82';
  if (button.classList.contains('two')) return '#01ab8e';
  if (button.classList.contains('three')) return '#f47200';
}

document.addEventListener('DOMContentLoaded', () => {
  selectVideo('video2', 'info2', 'two');
});


// replay button logic
document.addEventListener("DOMContentLoaded", function() {
  var video = document.getElementById("myVideo");
  var replayButton = document.getElementById("replayButton");

  replayButton.addEventListener("click", function() {
      video.currentTime = 0;
      video.play();
  });
});

document.getElementById('replayButton2').addEventListener('click', function() {
  var video = document.getElementById('myVideo2');
  video.currentTime = 0;
  video.play();
});

document.addEventListener("DOMContentLoaded", function() {
  var video3 = document.getElementById("myVideo3");
  var previewImage3 = document.getElementById("previewImage3");
  var replayButton3 = document.getElementById("replayButton3");

  replayButton3.addEventListener("click", function() {
    video3.pause();
    video3.currentTime = 0;
    video3.style.display = 'none';
    previewImage3.style.display = 'block';
  });
});

function showVideo3() {
  document.getElementById('previewImage3').style.display = 'none';
  document.getElementById('myVideo3').style.display = 'block';
  document.getElementById('myVideo3').play();
}