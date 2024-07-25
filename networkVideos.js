let selectedNetworkVideoId = {
  'network-section-1': 'networkVideo1',
  'network-section-2': 'newNetworkVideo1'
};

function selectNetworkVideo(sectionId, videoId, buttonIndex) {
  const section = document.querySelector(`#${sectionId}`);
  const videos = section.querySelectorAll('video');
  videos.forEach(video => {
    video.style.display = video.id === videoId ? 'block' : 'none';
    if (video.id === videoId) {
      video.play();
    } else {
      video.pause();
      video.currentTime = 0;
    }
  });

  selectedNetworkVideoId[sectionId] = videoId;

  const buttons = section.querySelectorAll('.network-styled-button');
  buttons.forEach((button, index) => {
    button.classList.toggle('selected', index === buttonIndex);
  });

  const selector = section.querySelector('.selector');
  const buttonWidth = buttons[0].offsetWidth;
  const buttonLeft = buttons[buttonIndex].offsetLeft;
  const leftOffset = buttonLeft + (buttonWidth / 2) - (selector.offsetWidth / 2);
  selector.style.left = `${leftOffset}px`;
}

document.addEventListener('DOMContentLoaded', () => {
  selectNetworkVideo('network-section-1', 'networkVideo1', 0);
  selectNetworkVideo('network-section-2', 'newNetworkVideo1', 0);
});