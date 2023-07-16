// Preload

function preload() {
    // Load images and sounds

    spaceshipImg = loadImage('imgs/spaceship.png');
    bulletImg = loadImage('imgs/bullet.png');
    asteroidImg = loadImage('imgs/asteroid.png');

    backgroundEpicSound = loadSound('sounds/soundtrack-epic.mp3');
    shootSound = loadSound('sounds/shoot.mp3');
    gameOverSound = loadSound('sounds/game-over.mp3');
    takeDamageSound = loadSound('sounds/death.mp3');
    giveDamageSound = loadSound('sounds/kill.mp3');
    backgroundSound = loadSound('sounds/soundtrack.mp3');
}
