
// This file runs inside YouTube webpage


// Function to get YouTube video title
function getVideoTitle() {

    // Find title element from YouTube page
    const titleElement = document.querySelector(
        "h1.ytd-watch-metadata"
    );

    // If title exists
    if(titleElement) {

        // Return title text
        return titleElement.innerText;
    }

    // If title not found
    return "Title not found";
}



// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(

    (message, sender, sendResponse) => {

        // If popup asks for title
        if(message.type === "GET_TITLE") {

            // Get title
            const title = getVideoTitle();

            // Send title back
            sendResponse({
                title: title
            });
        }
    }
);