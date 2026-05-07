
// Get title element
const titleElement = document.getElementById("videoTitle");

// Get comments container
const commentsContainer = document.getElementById(
    "commentsContainer"
);


// Ask content.js for comments
chrome.tabs.query(

    {
        active: true,
        currentWindow: true
    },

    (tabs) => {

        chrome.tabs.sendMessage(

            tabs[0].id,

            {
                type: "GET_COMMENTS"
            },

            (response) => {

                // If comments exist
                if(response && response.comments) {

                    // Loop through comments
                    response.comments.forEach(comment => {

                        // Create div
                        const div = document.createElement("div");

                        // Add class
                        div.className = "comment";

                        // Add comment text
                        div.innerText = comment;

                        // Add into container
                        commentsContainer.appendChild(div);
                    });
                }
            }
        );
    }
);

// Ask current tab for YouTube title
chrome.tabs.query(

    {
        active: true,
        currentWindow: true
    },

    (tabs) => {

        // Send message to content.js
        chrome.tabs.sendMessage(

            tabs[0].id,

            {
                type: "GET_TITLE"
            },

            (response) => {

                // Show title in extension
                if(response && response.title) {

                    titleElement.innerText = response.title;
                }
            }
        );
    }
);


// Get button from HTML
const predictBtn = document.getElementById("predictBtn");

// Get textarea
const userText = document.getElementById("userText");

// Get result div
const resultDiv = document.getElementById("result");


// Add click event on button
predictBtn.addEventListener("click", async () => {

    // Get text written by user
    const text = userText.value;

    // If text is empty
    if(text.trim() === "") {

        resultDiv.innerText = "Please write something.";

        return;
    }

    // Show loading message
    resultDiv.innerText = "Predicting...";


    try {

        // Send request to your API
        const response = await fetch("http://127.0.0.1:8000/predict", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            // Send text to API
            body: JSON.stringify({
                comment: text
            })
        });


        // Convert response into JSON
        const data = await response.json();


        // Show prediction result
        resultDiv.innerText = `Sentiment: ${data.Prediction}`;

    }

    // If error occurs
    catch(error) {

        console.log(error);

        resultDiv.innerText = "Error calling API";
    }

});