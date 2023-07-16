const mySiteURL = "dame.lillard.trade";

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

tryAgain.style.display = "none"

faceImage.style.top = "50vh";
faceImage.style.left = "50vw";

document.addEventListener('mousemove', function(e) {
    let faceImageRect = faceImage.getBoundingClientRect();
    let x = e.clientX - faceImageRect.width / 2;
    let y = e.clientY - faceImageRect.height / 2;
    faceImage.style.top = `${y}px`;
    faceImage.style.left = `${x}px`;
});

topImage.addEventListener('mouseenter', function() {
    faceImage.src = "face_frown.png";
});

bottomImage.addEventListener('mouseenter', function() {
    faceImage.src = "face_smile.png";
});

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

topImage.addEventListener('click', async function() {
    topImage.style.display = "none";
    bottomImage.src = "portland.png";
    bottomImage.style.display = "block";
    tryAgain.style.display = "none";
    inResultState = true;
    faceImage.src = "face_frown.png";
    body.style.backgroundColor = "grey";
    result.style.display = "block";

    let failureSound = document.querySelector("#failureSound");
    failureSound.play();

    setTimeout(function() {
        result.innerHTML = "";
    }, 1500);

    topImage.style.pointerEvents = "none";
    bottomImage.style.pointerEvents = "none";
    responseText.style.pointerEvents = "none";

    instructions.style.display = "none";

    let wrong = document.querySelector("#wrong");
    wrong.style.display = "block";
    setTimeout(function() {
        wrong.style.display = "none";
    }, 1500); 

    responseText.style.display = "block";
    responseText.innerHTML = "⏳ <em>Please wait...</em>";
    setTimeout(function() {
        responseText.innerHTML = "⏳ <em>Please wait...</em><br><br><strong>Dame</strong> is typing 💬";
    }, 1500); 

    try {
        const response = await fetch(`/api/generate-text/wrong`);
        const data = await response.text();
        responseText.innerHTML = "<strong>Dame replied,</strong><br> \"" + data + "\"";

        var resultTextOnly = responseText.textContent;
        var twitterLink = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(resultTextOnly);
        document.getElementById('share-twitter').href = twitterLink;

        setTimeout(function() {
            tryAgain.style.display = "block";
            shareButtons.style.display = "block";
        }, 500);
    } catch (error) {
        console.error('Flagrant Foul:', error);
    }

    setTimeout(function() {
        tryAgain.style.display = "block";
    }, 15000);
});

bottomImage.addEventListener('click', async function() {
    topImage.style.display = "none";
    tryAgain.style.display = "none";
    inResultState = true;
    faceImage.src = "face_smile.png";
    body.style.backgroundColor = "green";
    result.style.display = "block";

    let successSound = document.querySelector("#successSound");
    successSound.play();

    setTimeout(function() {
        result.innerHTML = "";
    }, 500);

    topImage.style.pointerEvents = "none";
    bottomImage.style.pointerEvents = "none";
    responseText.style.pointerEvents = "none";

    instructions.style.display = "none";

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

    responseText.style.display = "block";
    responseText.innerHTML = "⏳ <em>Please wait...</em>";
    setTimeout(function() {
        responseText.innerHTML = "⏳ <em>Please wait...</em><br><br><strong>Dame</strong> is typing 💬";
    }, 1500); 

    try {
        const response = await fetch(`/api/generate-text/correct`);
        const data = await response.text();
        responseText.innerHTML = "<strong>Dame replied,</strong><br> \"" + data + "\"";

        var resultTextOnly = responseText.textContent;
        var preFormatTweetText = encodeURIComponent(resultTextOnly);
        var postFormatTweetText = preFormatTweetText.replace("Dame replied,", "").trim() + " ... " + `https://${mySiteURL}`;                
        var twitterLink = "https://twitter.com/intent/tweet?text=" + postFormatTweetText;
        document.getElementById('share-twitter').href = twitterLink;

        setTimeout(function() {
            tryAgain.style.display = "block";
            shareButtons.style.display = "block";
        }, 500);
    } catch (error) {
        console.error('Flagrant Foul:', error);
    }

    setTimeout(function() {
        tryAgain.style.display = "block";
        shareButtons.style.display = "block";
    }, 15000);
});

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
