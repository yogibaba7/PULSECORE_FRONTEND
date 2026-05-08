
// ======================================
// GET HTML ELEMENTS
// ======================================

// Video title
const titleElement =
    document.getElementById("videoTitle");


// Analyze button
const predictBtn =
    document.getElementById("predictBtn");


// Analysis container
const analysisContainer =
    document.getElementById("analysisContainer");


// Top comments container
const topCommentsContainer =
    document.getElementById(
        "topCommentsContainer"
    );




// ======================================
// EXTRACT VIDEO ID
// ======================================

function getVideoId(url) {

    // Create URL object
    const urlObj = new URL(url);

    // Return video ID
    return urlObj.searchParams.get("v");
}




// ======================================
// FETCH VIDEO TITLE
// ======================================

chrome.tabs.query(

    {
        active: true,
        currentWindow: true
    },

    (tabs) => {

        // Current URL
        const currentUrl = tabs[0].url;

        // Video ID
        const videoId =
            getVideoId(currentUrl);


        // Show video ID temporarily
        titleElement.innerText =
            `Video ID: ${videoId}`;
    }
);




// ======================================
// ANALYZE COMMENTS
// ======================================

predictBtn.addEventListener(

    "click",

    async () => {

        try {

            // Loading state
            analysisContainer.innerHTML =

                "<p>Analyzing comments...</p>";


            topCommentsContainer.innerHTML =

                "<h3>Top Comments</h3>";


            // Get active tab
            const tabs =
                await chrome.tabs.query({

                    active: true,

                    currentWindow: true
                });


            // Current URL
            const currentUrl =
                tabs[0].url;


            // Extract video ID
            const videoId =
                getVideoId(currentUrl);


            // Send video ID to FastAPI
            const response = await fetch(

                "http://127.0.0.1:8000/analyze-video",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        VedioId: videoId
                    })
                }
            );


            // Convert response to JSON
            const data =
                await response.json();




            // ==================================
            // SHOW ANALYTICS
            // ==================================

            analysisContainer.innerHTML = `

                <h3>Analysis</h3>

                <p>
                    <strong>
                        Total Comments:
                    </strong>

                    ${data.total_comments}
                </p>

                <p>
                    <strong>
                        Analyzed Comments:
                    </strong>

                    ${data.analyzed_comments}
                </p>

                <p>
                    😊 Positive:
                    ${data.positive_percent}%
                </p>

                <p>
                    😐 Neutral:
                    ${data.neutral_percent}%
                </p>

                <p>
                    😡 Negative:
                    ${data.negative_percent}%
                </p>
            `;




            // ==================================
            // SHOW TOP 5 COMMENTS
            // ==================================

            data.results.forEach(item => {

                // Create card
                const card =
                    document.createElement("div");


                // Add class
                card.className =
                    "commentCard";


                // Add HTML
                card.innerHTML = `

                    <p>
                        ${item.comment}
                    </p>

                    <p class="sentiment">

                        Sentiment:
                        ${item.sentiment}

                    </p>
                `;


                // Add into container
                topCommentsContainer
                    .appendChild(card);
            });

        }


        // ==================================
        // ERROR HANDLING
        // ==================================

        catch(error) {

            console.log(error);

            analysisContainer.innerHTML =

                "<p>Error analyzing comments.</p>";
        }
    }
);