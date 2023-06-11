function fadeColor(intensity) {
    // Calculate the faded intensity as a percentage
    const fadedIntensity = intensity + ((100 - intensity) / 2);
    
    // Calculate the R, G, and B values based on the faded intensity
    const r = Math.floor((255 * fadedIntensity) / 100);
    const g = Math.floor((120 * fadedIntensity) / 100);
    const b = Math.floor((20 * fadedIntensity) / 100);
    
    // Return the RGB color string
    return `rgb(${r}, ${g}, ${b})`;
}

//loadingbar script
const loadingBox = document.getElementById('loadingBox');
const loadingBar = document.getElementById('loadingBar');

// Function to set the progress of the loading bar
function setProgress(progress) {
    console.log(progress);
    loadingBar.value = progress;
    loadingBar.style.backgroundColor = fadeColor(progress)
}

// Function to show the loading box
function showBox() {
    loadingBox.style.display = 'block';
    setProgress(0)
}

// Function to hide the loading box 1 second after the progress reaches 100%
function hideBox() {
    setTimeout(() => {
        loadingBox.style.display = 'none';
    }, 1000);
}
