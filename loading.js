// Preload Images
let spaceship;
let spaceshipImg;
let spaceshipImg2;
let spaceshipImg3;
let asteroids = [];
let asteroidImg;
let asteroidImg2;
let bullets = [];
let gameState = "start";
let gameOver = false;
let invincible = false;
let invincibleTimer = 0;
let button;
let tweetButton;
let asteroidGenerationTime = 300; // 5 seconds
let timeElapsed = 0;
let score = 0;
let gameStarted = false;
let asteroidCounter = 0;
let asteroidGenerationRate = 60; // Generate an asteroid every 60 frames (approximately 1 second)
let levelTransition = false;
let levelTransitionTimer = 0;
let spaceImage;
//let dingSound;
let logo;
let teamLogos = [];
// List of NBA teams
let nbaTeams = [
    "Portland Trail Blazers", // Blazers must be first
    "Washington Wizards",
    "Houston Rockets",
    "Charlotte Hornets",
    "Boston Celtics",
    "Detroit Pistons",
    "Utah Jazz",
    "Orlando Magic",
    "Indiana Pacers",
    "San Antonio Spurs",
    "Oklahoma City Thunder",
    "Toronto Raptors",
    "Atlanta Hawks",
    "Chicago Bulls",
    "Brooklyn Nets",
    "New Orleans Pelicans",
    "Minnesota Timberwolves",
    "Memphis Grizzlies",
    "Dallas Mavericks",
    "Cleveland Cavaliers",
    "New York Knicks",
    "Sacramento Kings",
    "LA Clippers",
    "Golden State Warriors",
    "Los Angeles Lakers",
    "Philadelphia 76ers",
    "Phoenix Suns",
    "Milwaukee Bucks",
    "Denver Nuggets",
    "Miami HEAT" // Heat must be last
];

// Define the levels' logic set
/*
.---------------.
|    LEVELS:    |  ---->  NONE OF THESE ARE ACCURATE  <----
'---------------'
Level 1 -  Asteroids move in a straight line to the spaceship's initial position.
Level 2 -  Asteroids follow the spaceship's position but move slowly.
Level 3 -  Asteroids follow the spaceship's position and move faster.
Level 4 -  Asteroids initially move in a straight line, then start following the spaceship after 3 seconds.
Level 5 -  Asteroids initially move in a straight line, then start following the spaceship faster after 3 seconds.
Level 6 -  Asteroids move in a zigzag pattern.
Level 7 -  Asteroids follow the spaceship and move in a zigzag pattern.
Level 8 -  Asteroids initially move in a straight line, then start following the spaceship in a zigzag pattern after 3 seconds.
Level 9 -  Asteroids follow the spaceship's position and move faster in a zigzag pattern.
Level 10 - Asteroids move randomly (this is unpredictable and will be the hardest level).
*/
let levels = [
    new Level(1, function(asteroid) {
        // Level 1 logic
    }, 5),
    new Level(2, function(asteroid) {
        // Level 2 logic
    }, 10),
    new Level(3, function(asteroid) {
        // Level 3 logic
    }, 15),
    new Level(4, function(asteroid) {
        // Level 4 logic
    }, 20),
    new Level(5, function(asteroid) {
        // Level 5 logic
    }, 25),
    new Level(6, function(asteroid) {
        // Level 6 logic
    }, 30),
    new Level(7, function(asteroid) {
        // Level 7 logic
    }, 35),
    new Level(8, function(asteroid) {
        // Level 8 logic
    }, 40),
    new Level(9, function(asteroid) {
        // Level 9 logic
    }, 45),
    new Level(10, function(asteroid) {
        // Level 10 logic
    }, 50),
    new Level(11, function(asteroid) {
        // Level 11 logic
    }, 55),
    new Level(12, function(asteroid) {
        // Level 12 logic
    }, 60),
    new Level(13, function(asteroid) {
        // Level 13 logic
    }, 65),
    new Level(14, function(asteroid) {
        // Level 14 logic
    }, 70),
    new Level(15, function(asteroid) {
        // Level 15 logic
    }, 75),
    new Level(16, function(asteroid) {
        // Level 16 logic
    }, 80),
    new Level(17, function(asteroid) {
        // Level 17 logic
    }, 85),
    new Level(18, function(asteroid) {
        // Level 18 logic
    }, 90),
    new Level(19, function(asteroid) {
        // Level 19 logic
    }, 95),
    new Level(20, function(asteroid) {
        // Level 20 logic
    }, 100),
    new Level(21, function(asteroid) {
        // Level 21 logic
    }, 105),
    new Level(22, function(asteroid) {
        // Level 22 logic
    }, 110),
    new Level(23, function(asteroid) {
        // Level 23 logic
    }, 115),
    new Level(24, function(asteroid) {
        // Level 24 logic
    }, 120),
    new Level(25, function(asteroid) {
        // Level 25 logic
    }, 125),
    new Level(26, function(asteroid) {
        // Level 26 logic
    }, 130),
    new Level(27, function(asteroid) {
        // Level 27 logic
    }, 135),
    new Level(28, function(asteroid) {
        // Level 28 logic
    }, 140),
    new Level(29, function(asteroid) {
        // Level 29 logic
    }, 145),
    new Level(30, function(asteroid) {
        // Level 30 logic
    }, 150),
    // Add more levels as needed...
];
let currentLevel = levels[0]; // Start at level 1

// Preload
function preload() {
    console.log("Demanding a trade from Joe Cronin...");
	spaceImage = loadImage('imgs/background.jpg');
    spaceshipImg = loadImage('imgs/spaceship.png', img => img.resize(100, 100));
    spaceship2Img = loadImage('imgs/spaceship2.png', img => img.resize(100, 100));
    spaceship3Img = loadImage('imgs/spaceship3.png', img => img.resize(100, 100));
    asteroidImg = loadImage('imgs/asteroid.png', img => img.resize(100, 0), err => console.log('Error loading asteroid image:', err));
    asteroid2Img = loadImage('imgs/asteroid2.png', img => img.resize(100, 0), err => console.log('Error loading asteroid image:', err));
    //dingSound = loadSound('sounds/ding.mp3');

	// Load NBA team logos
	for (let i = 0; i < nbaTeams.length; i++) {
		console.log(nbaTeams[i].toLowerCase().replace(/ /g, '-'));
   		teamLogos[i] = loadImage('imgs/logos/' + nbaTeams[i].toLowerCase().replace(/ /g, '-') + '.png', img => img.resize(100, 100), err => console.log('Error loading an NBA logo:', err));
	}

}


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
