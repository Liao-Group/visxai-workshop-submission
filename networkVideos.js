// Network Videos Section JS
let selectedNetworkVideoId = 'networkVideo1';

function selectNetworkVideo(videoId, buttonIndex) {
  // Select only videos within the network-video-section-container
  const videos = document.querySelectorAll('.network-video-section-container video');
  videos.forEach(video => {
    video.style.display = video.id === videoId ? 'block' : 'none';
    video.id === videoId ? video.play() : video.pause();
    video.currentTime = 0;
  });

  selectedNetworkVideoId = videoId;

  // Update button styles only within the network-video-section-container
  const buttons = document.querySelectorAll('.network-video-section-container .network-styled-button');
  buttons.forEach((button, index) => {
    button.classList.toggle('selected', index === buttonIndex);
  });

  // Move the selector box
  const selector = document.querySelector('.network-video-section-container .selector');
  const buttonWidth = buttons[0].offsetWidth; // Get the width of a button
  const selectorWidth = selector.offsetWidth; // Get the width of the selector
  const containerWidth = selector.parentElement.offsetWidth; // Get the width of the container

  // Calculate the left offset to keep the selector within bounds
  const leftOffset = buttonIndex * buttonWidth + (buttonWidth - selectorWidth) / 2;

  // Ensure the selector stays within the bounds of the container
  const minLeft = 0;
  const maxLeft = containerWidth - selectorWidth;

  selector.style.left = `${Math.min(Math.max(leftOffset, minLeft), maxLeft)}px`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Default to selecting the first network video
  selectNetworkVideo('networkVideo1', 0);
});