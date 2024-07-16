let selectedInfoId = 'info2';
let selectedClassName = 'two';

function selectVideo(videoId, infoId, className) {
  // Select only videos within the video-section-container
  const videos = document.querySelectorAll('.video-section-container video');
  videos.forEach(video => {
    video.style.display = video.id === videoId ? 'block' : 'none';
    video.id === videoId ? video.play() : video.pause();
    video.currentTime = 0;
  });

  selectedInfoId = infoId;
  selectedClassName = className;
  updateInfoContainer(infoId, className);

  // Update button styles only within the video-section-container
  const buttons = document.querySelectorAll('.video-section-container .styled-button');
  buttons.forEach(button => {
    const isSelected = button.getAttribute('onclick').includes(videoId);
    button.style.backgroundColor = isSelected ? getButtonColor(button) : 'white';
    button.style.color = isSelected ? 'white' : 'black';
  });
}

function showInfo(infoId, className) {
  updateInfoContainer(infoId, className);
}

function resetInfo() {
  updateInfoContainer(selectedInfoId, selectedClassName);
}

function updateInfoContainer(infoId, className) {
  // Select only the info container within the video-section-container
  const infoContainer = document.querySelector('.video-section-container #info-container');
  const infoText = {
    info1: "CGCCGUAUUACCUGCCCUCAAUCAUUAACGCUCUGGUCCGCAUUACAUGACUAUUAUUACCAAGCGCAAA<br>....(((((..........)))))...((((((.....((((.((((.....................))))))))......))).))).",
    info2: "CCCAGAAAAAUUCCUAACUGCAGAAACCUGACAAAAGCCAAAUCUUGAGGCAAAAACAACUCAAAUAUCG<br>....(((((((.(((............)))..).))))))......((......(((((..........))))).....)).........",
    info3: "CCACCCAGUCCACCCUCUGCAAUAUUUAGUCGUAUUCCAUGACACAAGUAAUCGAUUCACAUACGCACAA<br>......(((...)))(((.((......(((.......(((((.(((.(.((...)).).)))))))).......))).....)).))).."
  };
  infoContainer.innerHTML = infoText[infoId];
  infoContainer.className = `info-container ${className}`;
}

function getButtonColor(button) {
  if (button.classList.contains('one')) return '#024d82';
  if (button.classList.contains('two')) return '#01ab8e';
  if (button.classList.contains('three')) return '#f47200';
}

document.addEventListener('DOMContentLoaded', () => {
  // Default to selecting the second option
  selectVideo('video2', 'info2', 'two');
});