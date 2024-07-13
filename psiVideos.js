let selectedInfoId = null;
let selectedClassName = null;

function selectVideo(videoId, infoId, className) {
  showVideo(videoId);
  selectedInfoId = infoId;
  selectedClassName = className;
  updateInfoContainer(infoId, className);
}

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

function showInfo(infoId, className) {
  updateInfoContainer(infoId, className);
}

function resetInfo() {
  if (selectedInfoId) {
    updateInfoContainer(selectedInfoId, selectedClassName);
  } else {
    const infoContainer = document.getElementById('info-container');
    infoContainer.innerText = "Hover over an exon to see its information";
    infoContainer.className = 'info-container';
  }
}

function updateInfoContainer(infoId, className) {
  const infoContainer = document.getElementById('info-container');
  const infoText = {
    info1: "CGCCGUAUUACCUGCCCUCAAUCAUUAACGCUCUGGUCCGCAUUACAUGACUAUUAUUACCAAGCGCAAA<br>....(((((..........)))))...((((((.....((((.((((.....................))))))))......))).))).",
    info2: "CCCAGAAAAAUUCCUAACUGCAGAAACCUGACAAAAGCCAAAUCUUGAGGCAAAAACAACUCAAAUAUCG<br>....(((((((.(((............)))..).))))))......((......(((((..........))))).....)).........",
    info3: "CCACCCAGUCCACCCUCUGCAAUAUUUAGUCGUAUUCCAUGACACAAGUAAUCGAUUCACAUACGCACAA<br>......(((...)))(((.((......(((.......(((((.(((.(.((...)).).)))))))).......))).....)).))).."
  };
  infoContainer.innerHTML = infoText[infoId];
  infoContainer.className = `info-container ${className}`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Default to selecting the second option
  selectVideo('video2', 'info2', 'two');
});