// Set variable that tracks the record button state
localStorage.setItem("recordIsClicked", "false");
// Set variable that tracks the play button state
localStorage.setItem("playIsClicked", "false");

// Function that updates the record state
function clickHandlerRecord(){ 
  timer_value = document.getElementById("timer").innerText;

  if (localStorage.getItem("recordIsClicked") == "false"){
    localStorage.setItem("recordIsClicked", "true");
  }
  
  if (timer_value != "00:00"){
    localStorage.setItem("recordIsClicked", "false");
  }
}

// Function that updates the play state
function clickHandlerPlay(){ 
  timer_value = document.getElementById("timer").innerText;

  if (localStorage.getItem("playIsClicked") == "false"){
    localStorage.setItem("playIsClicked", "true");
  }
  
  if (timer_value != "00:00"){
    localStorage.setItem("playIsClicked", "false");
  }
}

// grab a reference to record button
var recordButton = document.getElementById('record'); 
// associate the function above with the click event
recordButton.addEventListener('click', clickHandlerRecord); 

// Check space key to start recording
document.addEventListener('keyup', (e) => {
  if (e.code === "Enter"){
    clickHandlerRecord();
    if (localStorage.getItem("playIsClicked") == "false"){
      document.getElementById('speaker').click();
    }
  }
});

// grab a reference to play button
var playButton = document.getElementById('play'); 
// associate the function above with the click event
playButton.addEventListener('click', clickHandlerPlay); 

// Check play/pause key to start recording
document.addEventListener('keyup', (e) => {
  if (e.code === "Space"){
    clickHandlerPlay();
    if (localStorage.getItem("recordIsClicked") == "false"){
      document.getElementById("play-pause").click();
    } 
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === "Numpad4"){
    document.getElementById("leftArrow").classList.add("controlPlay");
    console.log("left");
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === "Numpad4"){
    document.getElementById("leftArrow").classList.remove("controlPlay");
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === "Numpad6"){
    document.getElementById("rightArrow").classList.add("controlPlay");
    console.log("right");
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === "Numpad6"){
    document.getElementById("rightArrow").classList.remove("controlPlay");
  }
});

