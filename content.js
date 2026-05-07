// This file runs inside YouTube webpage


// Function to wait for title
function waitForTitle(callback) {

    // Check every 500ms
    const interval = setInterval(() => {

        // Find title element
        const titleElement = document.querySelector(
            "h1.ytd-watch-metadata"
        );

        // If title found
        if(titleElement && titleElement.innerText.trim() !== "") {

            // Stop checking
            clearInterval(interval);

            // Send title back
            callback(titleElement.innerText);
        }

    }, 500);
}

// Function to get YouTube comments
function getComments() {

    // Select all comment elements
    const commentElements = document.querySelectorAll(
        "#content-text"
    );

    // Convert NodeList into array
    const comments = Array.from(commentElements)

        // Extract text from each comment
        .map(comment => comment.innerText)

        // Remove empty comments
        .filter(comment => comment.trim() !== "");

    // Return first 5 comments
    return comments.slice(0, 5);
}



// Listen for popup message
chrome.runtime.onMessage.addListener(

    (message, sender, sendResponse) => {

        // Get video title
        if(message.type === "GET_TITLE") {

            waitForTitle((title) => {

                sendResponse({
                    title: title
                });

            });

            return true;
        }


        // Get YouTube comments
        if(message.type === "GET_COMMENTS") {

            const comments = getComments();

            sendResponse({
                comments: comments
            });
        }
    }
);