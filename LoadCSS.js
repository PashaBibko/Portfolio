"use strict";
// Returns true if user is on mobile //
function IsUserOnMobile() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
// Loads a given file as CSS //
function LoadCSS(url) {
    // Creates the link with the relavent info //
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    // Adds the CSS link to the top of the DOM //
    document.head.appendChild(link);
}
// Loads the correct CSS depending on the user's device //
if (IsUserOnMobile() === false) {
    LoadCSS("./Mobile.css");
}
else {
    LoadCSS("./Desktop.css");
}
