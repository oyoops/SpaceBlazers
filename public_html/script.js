
const mySiteURL = "dame.lillard.trade";

// ----------

// Get the necessary elements from the DOM

let inResultState = false;

let faceImage = document.querySelector("#face");

let topImage = document.querySelector("#top-image");

let bottomImage = document.querySelector("#bottom-image");

let result = document.querySelector("#result");

let body = document.querySelector("body");

let tryAgain = document.querySelector("#try-again");

let instructions = document.querySelector("#instructions");

let responseText = document.querySelector("#response-text");

let shareButtons = document.querySelector("#share-twitter");

//let shareSMS = document.querySelector("#share-sms");



// Initial hacky edit

tryAgain.style.display = "none"



// Initial face position

faceImage.style.top = "50vh";

faceImage.style.left = "50vw";



// Function to make the face follow the cursor

document.addEventListener('mousemove', function(e) {

    let faceImageRect = faceImage.getBoundingClientRect();

    let x = e.clientX - faceImageRect.width / 2;

    let y = e.clientY - faceImageRect.height / 2;

    faceImage.style.top = `${y}px`;

    faceImage.style.left = `${x}px`;

});



// Hover event for the top image

topImage.addEventListener('mouseenter', function() {

    faceImage.src = "face_frown.png";

});



// Hover event for the bottom image

bottomImage.addEventListener('mouseenter', function() {

    faceImage.src = "face_smile.png";

});



// When not hovering over the images, face will be neutral

topImage.addEventListener('mouseleave', function() {

    if (!inResultState && tryAgain.style.display === "none") {

        faceImage.src = "face_neutral.png";

    }

});

bottomImage.addEventListener('mouseleave', function() {

    if (!inResultState && tryAgain.style.display === "none") {

        faceImage.src = "face_neutral.png";

    }

});



// Click event for the top image

topImage.addEventListener('click', async function() {

    // Hide the top pic

    topImage.style.display = "none";

    // [special case] swap positions of the images so AI can speak on top:

    bottomImage.src = "portland.png";

    bottomImage.style.display = "block";

        

    tryAgain.style.display = "none"; //// hacky override?

    inResultState = true;

    faceImage.src = "face_frown.png";

    body.style.backgroundColor = "grey";

    result.style.display = "block";



    // Get the audio element and play the sound

    let failureSound = document.querySelector("#failureSound");

    failureSound.play();



    // Show big result text

    setTimeout(function() {

        //result.innerHTML = "❌";

		  result.innerHTML = "";

    }, 1500); // waits for 1.5 seconds before displaying the result text

    

    // Disable further UI-changing

    topImage.style.pointerEvents = "none";

    bottomImage.style.pointerEvents = "none";

    responseText.style.pointerEvents = "none";

    

    // Hide instructions

    instructions.style.display = "none";



    // Show the undulating Big Red X

    let wrong = document.querySelector("#wrong");

    wrong.style.display = "block";

    setTimeout(function() {

        wrong.style.display = "none";

    }, 1500); // disappears after 1.5 seconds

    

    // Show placeholder for AI response

    responseText.style.display = "block";

    responseText.innerHTML = "⏳ <em>Please wait...</em>";

    setTimeout(function() {

        responseText.innerHTML = "⏳ <em>Please wait...</em><br><br><strong>Dame</strong> is typing 💬";

    }, 1500); 



    // Get AI's negative opinion

    try {
        console.log("my site = ",mySiteURL);
        const response = await fetch(`https://${mySiteURL}:5556/generate-text/wrong`)
        
            .then(response => response.text())

            .then(data => {

                // Generate unfavorable AI prompt

                //////////generateText('wrong');

                responseText.innerHTML = "<strong>Dame replied,</strong><br> \"" + data + "\"";

                

                // 

                // Extract only the text content from responseText

                var resultTextOnly = responseText.textContent;

                // Share via SMS
                //var smsLink = "sms:?body=" + encodeURIComponent(resultTextOnly);
                //document.getElementById('share-sms').href = smsLink;

                // Share on Twitter

                var twitterLink = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(resultTextOnly);

                document.getElementById('share-twitter').href = twitterLink;

                //



                // Now is the ideal time to show the Try Again and Share buttons

                setTimeout(function() {

                    tryAgain.style.display = "block";

                    shareButtons.style.display = "block";

                }, 500);

            })

            .catch((error) => {

                console.error('Flagrant Foul:', error);

            });

    } catch (error) {

        console.error(error);

    }



    // Show 'Try Again' button after 15 seconds

    setTimeout(function() {

        tryAgain.style.display = "block";

    }, 15000);

});



// Click event for the bottom image

bottomImage.addEventListener('click', async function() {

    // Hide the top pic

    topImage.style.display = "none";

    

    tryAgain.style.display = "none"; //// hacky override?

    inResultState = true;

    faceImage.src = "face_smile.png";

    body.style.backgroundColor = "green";

    result.style.display = "block";



    // Get the audio element and play the sound

    let successSound = document.querySelector("#successSound");

    successSound.play();



    // Show big result text

    setTimeout(function() {

        //result.innerHTML = "✔️";

		  result.innerHTML = "";

    }, 500); // waits for 0.5 seconds before displaying the result text



    // Disable further UI-changing

    topImage.style.pointerEvents = "none";

    bottomImage.style.pointerEvents = "none";

    responseText.style.pointerEvents = "none";

    

    // Hide instructions

    instructions.style.display = "none";



    // Display confetti effect

    confetti({

        particleCount: 200,

        startVelocity: 40,

        spread: 360,

        origin: { y: 0.7 }

    });

    setTimeout(function() {

        confetti({

            particleCount: 200,

            startVelocity: 40,

            spread: 360,

            origin: { y: 0.5 }

        });

    }, 1000)



    // Show placeholder for AI response

    responseText.style.display = "block";

    responseText.innerHTML = "⏳ <em>Please wait...</em>";

    setTimeout(function() {

        responseText.innerHTML = "⏳ <em>Please wait...</em><br><br><strong>Dame</strong> is typing 💬";

    }, 1500); 



    // Get AI's positive opinion

    try {

        console.log("my site = ",mySiteURL);
        const response = await fetch(`https://${mySiteURL}:5556/generate-text/correct`, {
            method: "GET",
            mode: "cors", // cors mode
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" // This is a wildcard, you may want to limit this to trusted domains in production
            }
        }).then(response => {
            if (response.ok) {
                console.log(response);
                return response.json();
            } else {
                console.log(response);
                throw new Error("Network response was not ok");
            }
        }).then(response => {
            console.log(response);
        })
        .then(response => response.text())
        
            .then(response => {

                // Generate favorable AI prompt

                //////////generateText('correct');

                responseText.innerHTML = "<strong>Dame replied,</strong><br> <em>\"" + response + "</em>\"";

                

                // 

                // Extract only the text content from responseText

                var resultTextOnly = responseText.textContent;

                // Share via SMS
                //var smsLink = "sms:?body=" + encodeURIComponent(resultTextOnly);
                //document.getElementById('share-sms').href = smsLink;

                // Share on Twitter
                var preFormatTweetText = encodeURIComponent(resultTextOnly);
                var postFormatTweetText = preFormatTweetText.replace("Dame replied,", "").trim() + " ... " + `https://${mySiteURL}`;                
                
                var twitterLink = "https://twitter.com/intent/tweet?text=" + postFormatTweetText;

                document.getElementById('share-twitter').href = twitterLink;

                //

                

                // Now is the ideal time to show the Try Again and Share buttons

                setTimeout(function() {

                    tryAgain.style.display = "block";

                    shareButtons.style.display = "block";

                }, 500);

            })

            .catch((error) => {

                console.error('Flagrant Foul:', error);

            });

    } catch (error) {

        console.error(error);

    }

    // Force-display the Try Again and Share buttons after 15 seconds

    setTimeout(function() {

        tryAgain.style.display = "block";

        shareButtons.style.display = "block";

    }, 15000);

});



// Reset everything when 'Try Again' is clicked

tryAgain.addEventListener('click', function() {

    inResultState = false;

    body.style.backgroundColor = "white";

    result.style.display = "none";

    result.textContent = " ";

    tryAgain.style.display = "none";

    shareButtons.style.display = "none";

    topImage.src = "portland.png";

    bottomImage.src = "miami.png";

    topImage.style.display = "block";

    bottomImage.style.display = "block";

    topImage.style.pointerEvents = "auto";

    bottomImage.style.pointerEvents = "auto";

    instructions.style.display = "block";

    responseText.innerHTML = "<em>Hi, I\'m <strong>Dame</strong>.<br> Where do you think I should get traded?</em>"

    responseText.style.display = "none"

    faceImage.src = "face_neutral.png";

});



// -----------------



// AI response generation
function generateText(result) {
    const mySiteURL = "dame.lillard.trade";
    fetch(`https://${mySiteURL}:5556/generate-text/${result}`)
    ////fetch(`https://${mySiteURL}/generate-text/${result}`)
    .then(console.log("** my site = ", mySiteURL))
    .then(response => console.log("** data rcvd = ", response))
    .then(response => response.text())
    .then(data => {
        document.getElementById('responseText').innerText = data;
    })
    .catch(error => console.error('AI Response Generation Error :-(   -----> ', error));
}





//

//

//





function convertHTMLtoText(htmlString) {

    var temp = document.createElement("div");

    temp.innerHTML = htmlString;

    return temp.textContent || temp.innerText || "";

}