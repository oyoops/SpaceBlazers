
// Mouse Pressed Function
function mousePressed() {
    if (gameState === "start") {
      gameState = "play";
    } else if (gameState === "play" && !gameOver) {
      let bullet = new Bullet(spaceship.pos, createVector(mouseX, mouseY));
      bullets.push(bullet);
    }
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

function windowResized() {
      resizeCanvas(windowWidth, windowHeight);
}
