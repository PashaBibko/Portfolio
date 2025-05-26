"use strict";
// Returns true if user is on mobile //
function IsUserOnMobile() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
// Loads a given file as CSS //
function LoadCSS(url) {
    // Creates the link with the relavent info //
    const link = document.getElementById("CSS");
    link.href = url;
}
// Loads the correct CSS //
function LoadCorrectCSS() {
    console.log("Reloaded CSS");
    // Loads the correct CSS depending on the user's device //
    if (IsUserOnMobile()) {
        LoadCSS("./Mobile.css");
    }
    else {
        // If below a certain width, still loads mobile CSS //
        const width = window.innerWidth;
        if (width < 1500) {
            LoadCSS("./Mobile.css");
        }
        else {
            LoadCSS("./Desktop.css");
        }
    }
}
// Adds the correct CSS and adds a listener to update CSS on window size change //
window.addEventListener("resize", LoadCorrectCSS);
LoadCorrectCSS();
