
// ===================================
// THIS FILE RUNS INSIDE YOUTUBE PAGE
// ===================================


// Wait for title
function waitForTitle(callback) {

    const interval = setInterval(() => {

        const titleElement = document.querySelector(
            "h1.ytd-watch-metadata"
        );

        if(titleElement &&
           titleElement.innerText.trim() !== "") {

            clearInterval(interval);

            callback(titleElement.innerText);
        }

    }, 500);
}



// Listen for popup messages
chrome.runtime.onMessage.addListener(

    (message, sender, sendResponse) => {

        // Get title
        if(message.type === "GET_TITLE") {

            waitForTitle((title) => {

                sendResponse({
                    title: title
                });

            });

            return true;
        }
    }
);