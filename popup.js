
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


// Store chart instance
let sentimentChart = null;

// ======================================
// EXTRACT VIDEO ID
// ======================================

function getVideoId(url) {

    // Create URL object
    const urlObj = new URL(url);

    // Return video ID
    return urlObj.searchParams.get("v");
}

// Create sentiment pie chart
function createChart(

    positive,
    neutral,
    negative

) {

    // Get canvas
    const ctx = document.getElementById(
        "sentimentChart"
    ).getContext("2d");


    // Destroy previous chart
    if(sentimentChart) {

        sentimentChart.destroy();
    }


    // Create new chart
    sentimentChart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: [

                "Positive",
                "Neutral",
                "Negative"
            ],

            datasets: [{

                data: [

                    positive,
                    neutral,
                    negative
                ],

                backgroundColor: [

                    "#4CAF50",
                    "#FF0000",
                    "#0000FF"
                ]
            }]
        },

        options: {

            responsive: true,

            plugins: {

                // Chart title
                title: {

                    display: true,

                    text: "Sentiment Distribution",

                    font: {

                        size: 18
                    }
                },

                // Legend
                legend: {

                    position: "bottom",

                    labels: {

                        font: {

                            size: 14
                        }
                    }
                }
            }
        }
    });
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
            // UPDATE KPIs
            // ==================================

            document.getElementById(
                "totalCommentsKPI"
            ).innerText = data.total_comments;


            document.getElementById(
                "avgWordsKPI"
            ).innerText =

                data.avg_words_per_comment;

            
            // ==================================
            // CREATE PIE CHART
            // ==================================

            createChart(

                data.positive_percent,

                data.neutral_percent,

                data.negative_percent

                
            );


            // ======================================
            // CREATE WORD CLOUD
            // ======================================

            function createWordCloud(wordData) {

                // Get canvas
                const canvas = document.getElementById(
                    "wordCloudCanvas"
                );


                // Clear previous cloud
                const ctx = canvas.getContext("2d");

                ctx.clearRect(

                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


                // Convert backend format
                const list = wordData.map(item => {

                    return [

                        item[0],
                        item[1]
                    ];
                });


                // Generate cloud
                WordCloud(canvas, {

                    list: list,

                    gridSize: 10,

                    weightFactor: 4,

                    fontFamily: "Arial",

                    color: "random-dark",

                    rotateRatio: 0.2,

                    backgroundColor: "#ffffff",

                    drawOutOfBound: false,

                    shrinkToFit: true
                });
            }

            createWordCloud(
                data.top_words
            );


            // Store chart instance globally
            let trendChart = null;

            // =====================================
            // CREATE SENTIMENT TREND CHART
            // =====================================
            function createTrendChart(trendData) {
                const ctx = document
                    .getElementById("trendChart")
                    .getContext("2d");

                // Destroy previous chart if it exists
                if (trendChart) {
                    trendChart.destroy();
                }

                // X-axis labels (months)
                const labels = trendData.map(
                    item => item.month
                );

                // Data arrays
                const positiveData = trendData.map(
                    item => item.positive
                );

                const neutralData = trendData.map(
                    item => item.neutral
                );

                const negativeData = trendData.map(
                    item => item.negative
                );

                // Create chart
                trendChart = new Chart(ctx, {
                    type: "line",

                    data: {
                        labels: labels,

                        datasets: [
                            {
                                label: "Positive",
                                data: positiveData,
                                borderColor: "#4CAF50",
                                backgroundColor: "#4CAF50",
                                tension: 0.3
                            },
                            {
                                label: "Neutral",
                                data: neutralData,
                                borderColor: "#9E9E9E",
                                backgroundColor: "#9E9E9E",
                                tension: 0.3
                            },
                            {
                                label: "Negative",
                                data: negativeData,
                                borderColor: "#F44336",
                                backgroundColor: "#F44336",
                                tension: 0.3
                            }
                        ]
                    },

                    options: {
                        responsive: true,

                        plugins: {
                            title: {
                                display: true,
                                text: "Sentiment Trend Over Time",
                                font: {
                                    size: 18
                                }
                            },

                            legend: {
                                position: "bottom"
                            }
                        },

                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                                title: {
                                    display: true,
                                    text: "Percentage (%)"
                                }
                            },

                            x: {
                                title: {
                                    display: true,
                                    text: "Month"
                                }
                            }
                        }
                    }
                });
            }

            createTrendChart(
                data.trend_data
            );
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