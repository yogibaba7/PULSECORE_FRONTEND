
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