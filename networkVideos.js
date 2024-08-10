let selectedNetworkVideoId = {
  'network-section-1': 'networkVideo1',
  'network-section-2': 'newNetworkVideo1'
};

const networkDescriptions = {
  'networkVideo1': 'The network uses two inputs for each exon - the 70-nucleotide sequence and a predicted secondary structure.',
  'networkVideo2': 'The network learned a set of features related to exon inclusion and skipping, reflecting both exon sequence and structure. The contribution of each feature is reported as strength arbitrary units, which can vary based upon position along the exon.',
  'networkVideo3': 'The network next calculates the sum of inclusion strengths and the sum of skipping strengths.',
  'networkVideo4': 'The network calculates the difference between inclusion class strength and skipping class strength.',
  'networkVideo5': 'The difference between inclusion and exclusion strengths is then converted into an output prediction using a learned non-linear function.',
  'newNetworkVideo1': "The network considers the input exon's sequence and structure.",
  'newNetworkVideo2': "The contribution strength of each activated inclusion or skipping feature is plotted along the length of the exon.                                                                                           ",
  'newNetworkVideo3': 'The network next calculates the sum of inclusion and skipping strengths.',
  'newNetworkVideo4': 'The network calculates the difference between inclusion class strength and skipping class strength. In this exon, the inclusion strength is greater than skipping strength, leading to a positive Δ strength.',
  'newNetworkVideo5': 'The Δ strength is converted into an output prediction using a learned non-linear function.'
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

  // Update the description text
  const descriptionElementId = `network-description-${sectionId === 'network-section-1' ? '1' : '2'}`;
  const descriptionElement = section.querySelector(`#${descriptionElementId}`);
  descriptionElement.textContent = networkDescriptions[videoId];
}

document.addEventListener('DOMContentLoaded', () => {
  selectNetworkVideo('network-section-1', 'networkVideo1', 0);
  selectNetworkVideo('network-section-2', 'newNetworkVideo1', 0);
});