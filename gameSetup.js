// Setup
function setup() {
    createCanvas(windowWidth, windowHeight);
    spaceship = new Spaceship(spaceshipImg.width / 2, 3);
    
	// Try again button (Hidden until game over))
	button = createButton('Try again');
    button.position(width / 2 - button.width / 2, height / 2 - button.height / 2 + 40); // Place above the Tweet button
    button.hide();
    button.mousePressed(resetGame);

    // Tweet button (Hidden until game over)
    tweetButton = createButton('Tweet my score');
    tweetButton.position(width / 2 - tweetButton.width / 2, height / 2 - tweetButton.height / 2 + 70);
    tweetButton.mousePressed(() => tweetScore(score));
    tweetButton.hide();

	// Hide cursor
    noCursor();
}
