// Reset the game
function resetGame() {
	spaceship = new Spaceship(spaceshipImg.width / 2, 3);
	spaceship.pos = createVector(width / 2, height / 2);
	asteroids = [];
	for (let i = 0; i < 5; i++) {
		asteroids.push(new Asteroid(asteroidImg.width / 2));
	}
	bullets = [];
	gameState = "play";
	gameOver = false;
    score = 0; // Reset the score
	button.hide(); // Hide the reset button when game resets
	tweetButton.hide();  // Hide the tweet button when game resets
    noCursor(); // Hide the cursor again when game resets
    currentLevel = levels[0]; // Reset the level
    asteroidCounter = 0; // Reset the asteroid counter
    levelTransition = false; // Cancel any level transition
    levelTransitionTimer = 0; // Reset level transition timer
	loop();
}