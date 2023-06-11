const loadingBox = document.getElementById('loadingBox');
const loadingBar = document.getElementById('loadingBarDIV');
let disableHiding = false

function getColor(value){
    //value from 0 to 1
    let hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}

//loadingbar script
// Function to set the progress of the loading bar
function setProgress(progress) {
    console.log(progress);
    loadingBar.style.width = progress + '%';
    loadingBar.style.backgroundColor = getColor((100 - progress) / 100)
}

// Function to show the loading box
function showBox() {
    loadingBox.style.display = 'block';
    setProgress(1)
}

// Function to hide the loading box 1 second after the progress reaches 100%
function hideBox() {
    if (!disableHiding) {
        loadingBox.style.transition = 'opacity 1.5s ease-out';
        loadingBox.style.opacity = 0;
        setTimeout(() => {
            loadingBox.style.display = 'none';
            loadingBox.style.transition = ''; // Reset the transition property
            loadingBox.style.opacity = 1; // Reset the opacity property
        }, 1500);
    }
}
