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
  const buttonLeft = buttons[buttonIndex].offsetLeft; // Get the left offset of the button

  // Calculate the left offset to center the selector around the button text
  const leftOffset = buttonLeft + (buttonWidth / 2) - (selector.offsetWidth / 2);

  selector.style.left = `${leftOffset}px`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Default to selecting the first network video
  selectNetworkVideo('networkVideo1', 0);
});