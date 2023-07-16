// Helper functions
function drawLabel() {
    fill(255);
    noStroke();
    textSize(32);
    textAlign(CENTER, CENTER);
    text(`Cronins: ${score}`, width / 2, 32);
    text(`Team: ${nbaTeams[level]}`, width / 2, 64);
    text(`Grind: ${lives}`, width / 2, 96);
}

function drawGameOver() {
    textSize(64);
    text('You ran from the grind and got', width / 2, height / 2);
    textSize(32);
    text(`traded to the ${nbaTeams[level]}!`, width / 2, height / 2 + 30);
    button.show();
    tweetButton.show();
}

function resetGame() {
    score = 0;
    level = 1;
    lives = 3;
    gameOver = false;
    spaceship = new Spaceship(spaceshipImg.width / 2, lives);
    asteroids = [];
    bullets = [];
    button.hide();
    tweetButton.hide();
}

// Tweet function
function tweetScore(score) {
	let levelIndex = currentLevel.levelNumber - 1;
    let team = levelIndex >= 0 && levelIndex <= nbaTeams.length ? " the " + nbaTeams[levelIndex] : " nowhere";
    let text = "I killed " + score + " Joe Cronins and traded Damian Lillard to" + team + " in #HeatSeeker: Portland Escape! 🔥 @Dame_Lillard ";
    let url = "https://dame.lillard.trade";
    let tweetUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url);
    window.open(tweetUrl, '_blank');
}
