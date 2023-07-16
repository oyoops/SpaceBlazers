
// Preload
function preload() {
    console.log("Demanding a trade from Joe Cronin...");
	spaceImage = loadImage('imgs/background.jpg');
    spaceshipImg = loadImage('imgs/spaceship.png', img => img.resize(100, 100));
    spaceship2Img = loadImage('imgs/spaceship2.png', img => img.resize(100, 100));
    spaceship3Img = loadImage('imgs/spaceship3.png', img => img.resize(100, 100));
    asteroidImg = loadImage('imgs/asteroid.png', img => img.resize(100, 0), err => console.log('Error loading asteroid image:', err));
    asteroid2Img = loadImage('imgs/asteroid2.png', img => img.resize(100, 0), err => console.log('Error loading asteroid image:', err));
    
    console.log("Not showing up to training camp...");
	backgroundEpicSound = loadSound('sounds/soundtrack-epic.mp3');
    shootSound = loadSound('sounds/shoot.mp3');
    gameOverSound = loadSound('sounds/game-over.mp3');
    takeDamageSound = loadSound('sounds/death.mp3');
    giveDamageSound = loadSound('sounds/kill.mp3');
    backgroundSound = loadSound('sounds/soundtrack.mp3');

	// Load NBA team logos
    console.log("Subtweeting the GM...");
    for (let i = 0; i < nbaTeams.length; i++) {
		console.log(nbaTeams[i].toLowerCase().replace(/ /g, '-'));
   		teamLogos[i] = loadImage('imgs/logos/' + nbaTeams[i].toLowerCase().replace(/ /g, '-') + '.png', img => img.resize(100, 100), err => console.log('Error loading an NBA logo:', err));
	}

}