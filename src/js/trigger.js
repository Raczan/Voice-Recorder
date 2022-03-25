var auxPlay;
var audioRecorder = {
    /** Stores the recorded audio as Blob objects of audio data as the recording continues*/
    audioBlobs: [],/*of type Blob[]*/
    /** Stores the reference of the MediaRecorder instance that handles the MediaStream when recording starts*/
    mediaRecorder: null, /*of type MediaRecorder*/
    /** Stores the reference to the stream currently capturing the audio*/
    streamBeingCaptured: null, /*of type MediaStream*/
    /** Start recording the audio 
     * @returns {Promise} - returns a promise that resolves if audio recording successfully started
     */
    start: function () {
        //Feature Detection
        if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            //Feature is not supported in browser
            //return a custom error
            return Promise.reject(new Error('mediaDevices API or getUserMedia method is not supported in this browser.'));
        }

        else {
            //Feature is supported in browser

            //create an audio stream
            return navigator.mediaDevices.getUserMedia({ audio: true }/*of type MediaStreamConstraints*/)
                //returns a promise that resolves to the audio stream
                .then(stream /*of type MediaStream*/ => {

                    //save the reference of the stream to be able to stop it when necessary
                    audioRecorder.streamBeingCaptured = stream;

                    //create a media recorder instance by passing that stream into the MediaRecorder constructor
                    audioRecorder.mediaRecorder = new MediaRecorder(stream); /*the MediaRecorder interface of the MediaStream Recording
                    API provides functionality to easily record media*/

                    //clear previously saved audio Blobs, if any
                    audioRecorder.audioBlobs = [];

                    //add a dataavailable event listener in order to store the audio data Blobs when recording
                    audioRecorder.mediaRecorder.addEventListener("dataavailable", event => {
                        //store audio Blob object
                        audioRecorder.audioBlobs.push(event.data);
                    });

                    //start the recording by calling the start method on the media recorder
                    audioRecorder.mediaRecorder.start();
                });

            /* errors are not handled in the API because if its handled and the promise is chained, the .then after the catch will be executed*/
        }
    },
    /** Stop the started audio recording
     * @returns {Promise} - returns a promise that resolves to the audio as a blob file
     */
    stop: function () {
        //return a promise that would return the blob or URL of the recording
        return new Promise(resolve => {
            //save audio type to pass to set the Blob type
            let mimeType = audioRecorder.mediaRecorder.mimeType;

            //listen to the stop event in order to create & return a single Blob object
            audioRecorder.mediaRecorder.addEventListener("stop", () => {
                //create a single blob object, as we might have gathered a few Blob objects that needs to be joined as one
                let audioBlob = new Blob(audioRecorder.audioBlobs, { type: mimeType });
                
                //resolve promise with the single audio blob representing the recorded audio
                resolve(audioBlob);
            });
            audioRecorder.cancel();
        });
    },
    /** Cancel audio recording*/
    cancel: function () {
        //stop the recording feature
        audioRecorder.mediaRecorder.stop();

        //stop all the tracks on the active stream in order to stop the stream
        audioRecorder.stopStream();

        //reset API properties for next recording
        audioRecorder.resetRecordingProperties();
    },
    /** Stop all the tracks on the active stream in order to stop the stream and remove
     * the red flashing dot showing in the tab
     */
    stopStream: function () {
        //stopping the capturing request by stopping all the tracks on the active stream
        audioRecorder.streamBeingCaptured.getTracks() //get all tracks from the stream
            .forEach(track /*of type MediaStreamTrack*/ => track.stop()); //stop each one
    },
    /** Reset all the recording properties including the media recorder and stream being captured*/
    resetRecordingProperties: function () {
        audioRecorder.mediaRecorder = null;
        audioRecorder.streamBeingCaptured = null;

        /*No need to remove event listeners attached to mediaRecorder as
        If a DOM element which is removed is reference-free (no references pointing to it), the element itself is picked
        up by the garbage collector as well as any event handlers/listeners associated with it.
        getEventListeners(audioRecorder.mediaRecorder) will return an empty array of events.*/
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function startWaveAnimation(){
    var elements_box = document.getElementsByClassName("box");
    for (let i = 0; i < elements_box.length; i++) {
      elements_box[i].classList.add("move_box");
    }
}

function pauseWaveAnimation(){
    var elements_box = document.getElementsByClassName("box");
    for (let i = 0; i < elements_box.length; i++) {
        elements_box[i].classList.remove("move_box");
    }
}

function setTimeValue(timerCounter, timerElement){
    let seconds = timerCounter;
    let min = Math.trunc(seconds/60);

    let realSeconds = ((seconds/60) % 1);
    let convertRealSeconds = (Math.trunc(realSeconds * 60));

    if (seconds < 10){
        timerElement.innerText = "0" + min + ":" + "0" + convertRealSeconds;
    }
    else{
        if (min < 10){
            timerElement.innerText = "0" + min + ":" + convertRealSeconds;
        }
        else{
            timerElement.innerText = min + ":" + convertRealSeconds;
        }
    }

    
}

function disable_click(id){
    var element = document.getElementById(id);
    element.classList.add("disable_click");
}

function enable_click(id){
    var element = document.getElementById(id);
    element.classList.remove("disable_click");
}

function soundStart(){
    var sndStart = new Audio("sounds/sound-1.wav"); // buffers automatically when created
    sndStart.play();
}

function soundEnd(){
    var sndEnd = new Audio("sounds/sound-7.wav"); // buffers automatically when created
    sndEnd.play();
}
// check if record button has been clicked every 0.5 seconds:
function isRecordClicked (){
    timer_text = document.getElementById("timer").innerText;

    if (localStorage.getItem("recordIsClicked") == "true" && timer_text == "00:00"){
        startWaveAnimation();
        disable_click("play");
        // disable_click("footer");

        const timerElement = document.getElementById("timer");
        let timerCounter = 0;

        timerCounter = timerCounter + 1;
        setTimeValue(timerCounter, timerElement);

        startAudioRecording();
  
        const interval = setInterval(() => {
            if (localStorage.getItem("recordIsClicked") == "false"){
                
                timerCounter = 0;
                timerElement.innerText = "00:00";
                enable_click("play");
                enable_click("footer")
                pauseWaveAnimation(); 
                stopAudioRecording();
                clearInterval(interval);
            }
            else{
                timerCounter = timerCounter + 1;
                setTimeValue(timerCounter, timerElement);
            }
      }, 1000);
    }
  }
  setInterval(isRecordClicked, 500);


// check if record button has been clicked every 0.5 seconds:
function isPlayClicked (){
    timer_text = document.getElementById("timer").innerText;

    if (localStorage.getItem("playIsClicked") == "true" && timer_text == "00:00"){
        startWaveAnimation();
        disable_click("record");

        const timerElement = document.getElementById("timer");
        let timerCounter = 0;

        timerCounter = timerCounter + 1;
        setTimeValue(timerCounter, timerElement);

        playAudio(auxPlay);
  
        const interval = setInterval(() => {
            isPlaying(audioElement);
            if (localStorage.getItem("playIsClicked") == "false"){
                document.getElementById("message_text").innerText = "Shadowing recorder";
                timerCounter = 0;
                timerElement.innerText = "00:00";
                enable_click("record");
                pauseWaveAnimation(); 
                clearInterval(interval);
            }
            else{
                
                timerCounter = timerCounter + 1;
                setTimeValue(timerCounter, timerElement);
            }
      }, 1000);
    }
  }
  setInterval(isPlayClicked, 500);

  function isPlaying(audioElement) { 
      if (audioElement.paused){
        localStorage.setItem("playIsClicked", "false");
      }
       
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Model 
//none

//View
var audioElement = document.getElementsByClassName("audio-element")[0];
var audioElementSource = document.getElementsByClassName("audio-element")[0]
    .getElementsByTagName("source")[0];

//Controller

/** Stores the actual start time when an audio recording begins to take place to ensure elapsed time start time is accurate*/
var audioRecordStartTime;

/** Stores the maximum recording time in hours to stop recording once maximum recording hour has been reached */
var maximumRecordingTimeInHours = 1;

/** Stores the reference of the setInterval function that controls the timer in audio recording*/
var elapsedTimeTimer;

/** Starts the audio recording*/
function startAudioRecording() {
    console.log("Recording Audio...");
    document.getElementById("message_text").innerText = "Recording Audio...";
    //start recording using the audio recording API
    audioRecorder.start()
        .then(() => { //on success

            //store the recording start time to display the elapsed time according to it
            audioRecordStartTime = new Date();
        })
        .catch(error => { //on error
            //No Browser Support Error
            if (error.message.includes("mediaDevices API or getUserMedia method is not supported in this browser.")) {
                console.log("To record audio, use browsers like Chrome and Firefox.");
            }

            //Error handling structure
            switch (error.name) {
                case 'AbortError': //error from navigator.mediaDevices.getUserMedia
                    console.log("An AbortError has occured.");
                    break;
                case 'NotAllowedError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A NotAllowedError has occured. User might have denied permission.");
                    break;
                case 'NotFoundError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A NotFoundError has occured.");
                    break;
                case 'NotReadableError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A NotReadableError has occured.");
                    break;
                case 'SecurityError': //error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
                    console.log("A SecurityError has occured.");
                    break;
                case 'TypeError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A TypeError has occured.");
                    break;
                case 'InvalidStateError': //error from the MediaRecorder.start
                    console.log("An InvalidStateError has occured.");
                    break;
                case 'UnknownError': //error from the MediaRecorder.start
                    console.log("An UnknownError has occured.");
                    break;
                default:
                    console.log("An error occured with the error name " + error.name);
            };
        });
}
/** Stop the currently started audio recording & sends it
 */
function stopAudioRecording() {

    console.log("Stopping Audio Recording...");
    document.getElementById("message_text").innerText = "Shadowing recorder";

    //stop the recording using the audio recording API
    audioRecorder.stop()
        .then(audioAsblob => {
            //Play recorder audio
            auxPlay = audioAsblob;

            //playAudio(audioAsblob);
        })
        .catch(error => {
            //Error handling structure
            switch (error.name) {
                case 'InvalidStateError': //error from the MediaRecorder.stop
                    console.log("An InvalidStateError has occured.");
                    break;
                default:
                    console.log("An error occured with the error name " + error.name);
            };
        });
}

/** Creates a source element for the the audio element in the HTML document*/
function createSourceForAudioElement() {
    let sourceElement = document.createElement("source");
    audioElement.appendChild(sourceElement);

    audioElementSource = sourceElement;
}

/** Plays recorded audio using the audio element in the HTML document
 * @param {Blob} recorderAudioAsBlob - recorded audio as a Blob Object 
*/
function playAudio(recorderAudioAsBlob) {

    
    //read content of files (Blobs) asynchronously
    let reader = new FileReader();

    //once content has been read
    reader.onload = (e) => {
        //store the base64 URL that represents the URL of the recording audio
        let base64URL = e.target.result;

        //If this is the first audio playing, create a source element
        //as pre populating the HTML with a source of empty src causes error
        if (!audioElementSource) //if its not defined create it (happens first time only)
            createSourceForAudioElement();

        //set the audio element's source using the base64 URL
        audioElementSource.src = base64URL;

        //set the type of the audio element based on the recorded audio's Blob type
        let BlobType = recorderAudioAsBlob.type.includes(";") ?
            recorderAudioAsBlob.type.substr(0, recorderAudioAsBlob.type.indexOf(';')) : recorderAudioAsBlob.type;
        audioElementSource.type = BlobType

        //call the load method as it is used to update the audio element after changing the source or other settings
        audioElement.load();

        //play the audio after successfully setting new src and type that corresponds to the recorded audio
        console.log("Playing audio...");
        document.getElementById("message_text").innerText = "Playing audio...";
        audioElement.play();
        

    };

    //read content and convert it to a URL (base64)
    reader.readAsDataURL(recorderAudioAsBlob);


}

