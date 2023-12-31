let spaceship;
let spaceshipImg;
let spaceshipImg2;
let spaceshipImg3;
let asteroids = [];
let asteroidImg;
let asteroid2Img;
let customBlazersAsteroids = [];
let bullets = [];
let gameState = "animation";
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
let muteButton;
let dameDollaButton;
let soundIsOn = true;
let dameSoundIsOn = false;
let dameOpinion = '';
let textModifier = '';

let logo;
let teamLogos = [];
// List of NBA teams:
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
let team = nbaTeams[0]; // Dame starts on the Blazers

let dingSound;
let soundtrack;
let killSound;
let gameOverSound;
let levelUpSound;
//let nextLevelSound;
let dameDollaSound;

// animation assets
let croninImg;
let lillardImg;
let animationTime = 0;
let dialogue1 = "";
let dialogue2 = "";
let dialogue3 = "";


// getDameOpinion function must be first at the top of the file
let getDameOpinion = (team, score, textModifier) => {
    return axios.get('/api/lillard-opinion', { params: { team, score, textModifier } })
        .then(response => response.data)
        .catch(error => console.error(error));
}
// getDameTweet function must be second at the top of the file
let getDameTweet = (team, thoughts) => {
    return axios.get('/api/lillard-tweet', { params: { team, thoughts } })
        .then(response => response.data)
        .catch(error => console.error(error));
}

// Preload
function preload() {
    console.log("Demanding a trade from Joe Cronin...");
	
    // Load maib game assets
    spaceImage = loadImage('imgs/background.jpg');
    spaceshipImg = loadImage('imgs/spaceship.png', img => img.resize(100, 100));
    spaceship2Img = loadImage('imgs/spaceship2.png', img => img.resize(100, 100));
    spaceship3Img = loadImage('imgs/spaceship3.png', img => img.resize(100, 100));
    asteroidImg = loadImage('imgs/asteroid.png', img => img.resize(100, 0), err => console.log('Error loading asteroid image:', err));
    asteroid2Img = loadImage('imgs/asteroid2.png', img => img.resize(100, 0), err => console.log('Error loading asteroid image:', err));
    asteroid_altImg = loadImage('imgs/celtics_fan.png', img => img.resize(100, 0), err => console.log('Error loading alternative asteroid image:', err));
    trash1 = loadImage('imgs/trash1.png', img => img.resize(100, 0), err => console.log('Error loading alternative asteroid image Blazer-Trashbag-1:', err));
    trash2 = loadImage('imgs/trash2.png', img => img.resize(100, 0), err => console.log('Error loading alternative asteroid image Blazer-Trashbag-2:', err));
    trash3 = loadImage('imgs/trash3.png', img => img.resize(100, 0), err => console.log('Error loading alternative asteroid image Blazer-Trashbag-3:', err));
    trash4 = loadImage('imgs/trash4.png', img => img.resize(100, 0), err => console.log('Error loading alternative asteroid image Blazer-Trashbag-4:', err));

    // Load assets for opening animation
    croninImg = loadImage("imgs/cronin.png", img => img.resize(110, 110), err => console.log('Error loading Cronin in animation:', err));
    lillardImg = loadImage("imgs/lillard.png", img => img.resize(110, 110), err => console.log('Error loading Lillard in animation:', err));

    // Load custom Blazers asteroid images
    customBlazersAsteroids = [
        trash1,
        trash2,
        trash3,
        trash4
    ];

	// Load NBA team logos
	for (let i = 0; i < nbaTeams.length; i++) {
		console.log(nbaTeams[i].toLowerCase().replace(/ /g, '-'));
   		teamLogos[i] = loadImage('imgs/logos/' + nbaTeams[i].toLowerCase().replace(/ /g, '-') + '.png', img => img.resize(100, 100), err => console.log('Error loading an NBA logo:', err));
	}

	// Load sounds
    killSound = loadSound('/sounds/kill.mp3');
	bruhSound = loadSound('/sounds/bruh.mp3');
    gameOverSound = loadSound('/sounds/game-over.mp3');
    levelUpSound = loadSound('/sounds/next-level.mp3');
	dingSound = loadSound('/sounds/ding.mp3');
    // soundtrack selections
    ////soundtrack = loadSound('/sounds/soundtrack.mp3');
	////dameDollaSound = loadSound('/sounds/Hulu.mp3');
    soundtrack = loadSound('/sounds/Hulu.mp3');
	dameDollaSound = loadSound('/sounds/soundtrack.mp3');
}

// Leveling
class Level {
    constructor(levelNumber, asteroidLogic, asteroidCount) {
        this.levelNumber = levelNumber;
        this.asteroidLogic = asteroidLogic;
        this.asteroidCount = asteroidCount;
        this.hitImg = asteroidImg;
    }

    applyAsteroidLogic(asteroid) {
        switch (this.levelNumber) {
            case 1:
                // Special Blazers logic
                ////asteroid.hitImg = customBlazersAsteroids[Math.floor(Math.random() * customBlazersAsteroids.length)];
                break;
            case 2:
                asteroid.hitImg = asteroidImg;
                asteroid.follow(spaceship.pos, 1);
                break;
            case 3:
                asteroid.hitImg = asteroidImg;
				asteroid.follow(spaceship.pos, 2);
                break;
            case 4:
                asteroid.hitImg = asteroidImg;
                if (frameCount > 180) { // 3 seconds
                    asteroid.hitImg = asteroidImg;
                    asteroid.follow(spaceship.pos, 2);
                }
                break;
            case 5:
                if (frameCount > 180) { // 3 seconds
                    asteroid.follow(spaceship.pos, 1,5);
                }
                // Assign alternative image to half of the asteroids
                if (Math.random() < 0.5) {
                    asteroid.hitImg = asteroid_altImg;
                }
                break;
            case 6:
                //asteroid.zigzag(10, 0.1);
                asteroid.hitImg = asteroidImg;
                asteroid.follow(spaceship.pos, 3);
				break;
            case 7:
                asteroid.hitImg = asteroidImg;
                asteroid.follow(spaceship.pos, 3.5);
                break;
            case 8:
                asteroid.hitImg = asteroidImg;
                if (frameCount > 180) { // 3 seconds
                    asteroid.follow(spaceship.pos, 4);
                    //asteroid.zigzag(10, 0.1);
                }
                break;
            case 9:
                asteroid.hitImg = asteroidImg;
                asteroid.follow(spaceship.pos, 4);
                //asteroid.zigzag(10, 0.1);
                break;
            case 10:
                asteroid.hitImg = asteroidImg;
                asteroid.follow(spaceship.pos, 4);
                //asteroid.vel = createVector(random(0, 1), random(0, 1));
                //asteroid.vel.setMag(random(1, 2));
                break;
			case 11:
                asteroid.hitImg = asteroidImg;
				asteroid.follow(spaceship.pos, 4);
				//asteroid.vel = createVector(random(0, 1), random(0, 1));
				//asteroid.vel.setMag(random(3, 4));
				break;
            default:
                asteroid.hitImg = asteroidImg;
				asteroid.follow(spaceship.pos, 4);
				//asteroid.vel = createVector(random(0, 1), random(0, 1));
				//asteroid.vel.setMag(random(3, 4));
                console.error('ERROR: Non-contact injury during practice; undergoing further evaluation ... team fears torn ACL.', this.levelNumber);
        }
    }
}


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
        //
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

// Setup
function setup() {
    createCanvas(windowWidth, windowHeight);

    // Load the spaceship
    spaceship = new Spaceship(spaceshipImg.width / 2, 3);
    
	// Mute button
	textSize(40);
	muteButton = createButton('🔇');
	textSize(20);
	muteButton.position(width - muteButton.width - 10, height - muteButton.height - 10);
    muteButton.mousePressed(toggleSound);

	// Dame Dolla button
	textSize(40);
	dameDollaButton = createButton('🔊');
	textSize(20);
	dameDollaButton.position(10, height - dameDollaButton.height - 10);
    dameDollaButton.mousePressed(toggleDameSound);
    
	// Try again button (Hidden until game over))
	button = createButton('Try again...');
    ////button.width = 300;
    button.position(width / 2 - button.width / 2, height / 2 - button.height / 2 - 80); // Place above the Tweet button
    button.hide();
    button.mousePressed(resetGame);

    // Tweet button (Hidden until game over)
    tweetButton = createButton('Tweet my score');
    ////tweetButton.width = 300;
    tweetButton.position(width / 2 - tweetButton.width / 2, height / 2 - tweetButton.height / 2 - 50);
    tweetButton.mousePressed(() => tweetScore(score));
    tweetButton.hide();

	// Hide cursor
    noCursor();

	// Start the soundtrack
	soundtrack.loop();
}


// Draw function
function draw() {
	
    // Draw background
	image(spaceImage, 0, 0, width, height);

	// Draw the game
    // Check the game state
    if (gameState === "animation") {
        /* Start game with the animation sequence */
        /* 7 seconds total */
        
        // Display the animation
        fill(0);
        textSize(22);
        textStyle(ITALIC);
        textAlign(LEFT);
        text(dialogue1, width / 4, height / 2 + 100);
        text(dialogue2, width / 2 + 60, height / 2 + 125);
        text(dialogue3, width / 4, height / 2 + 150);
        // Update dialogue based on animation time
        animationTime++;
        if (animationTime < 90) {
            image(lillardImg, width / 2 + 60 - lillardImg.width/2, height / 4 - 40, 150, 150);
            image(croninImg, width / 4 - croninImg.width/2, height / 4 - 40, 150, 150);
        } else if (animationTime < 180) {
            textStyle(BOLD);
            textSize(32);
            text("CRONIN:", width / 4, height / 2 + 50);
            text("DAME:", width / 2 + 30, height / 2 + 50);
            textSize(22);
            textStyle(NORMAL);
            image(lillardImg, width / 2 + 60 - lillardImg.width/2, height / 4 - 40, 150, 150);
            image(croninImg, width / 4 - croninImg.width/2, height / 4 - 40, 150, 150);
        } else if (animationTime < 270) {
            textStyle(BOLD);
            textSize(32);
            text("CRONIN:", width / 4, height / 2 + 50);
            text("DAME:", width / 2 + 30, height / 2 + 50);
            textSize(22);
            textStyle(NORMAL);
            image(lillardImg, width / 2 + 60 - lillardImg.width/2, height / 4 - 40, 150, 150);
            image(croninImg, width / 4 - croninImg.width/2, height / 4 - 40, 150, 150);
            dialogue1 = "I promise to bring star players...";
        } else if (animationTime < 360) {
            textStyle(BOLD);
            textSize(32);
            text("CRONIN:", width / 4, height / 2 + 50);
            text("DAME:", width / 2 + 30, height / 2 + 50);
            textSize(22);
            textStyle(NORMAL);
            image(lillardImg, width / 2 + 60 - lillardImg.width/2, height / 4 - 40, 150, 150);
            image(croninImg, width / 4 - croninImg.width/2, height / 4 - 40, 150, 150);
            dialogue2 = "Really? Wow, that will be so great!";
        } else if (animationTime < 450) {
            textStyle(BOLD);
            textSize(32);
            text("CRONIN:", width / 4, height / 2 + 50);
            text("DAME:", width / 2 + 30, height / 2 + 50);
            textSize(22);
            textStyle(NORMAL);
            image(lillardImg, width / 2 + 60 - lillardImg.width/2, height / 4 - 40, 150, 150);
            image(croninImg, width / 4 - croninImg.width/2, height / 4 - 40, 150, 150);
            dialogue3 = "Yeah, you won't believe who I bring in!";
        } else if (animationTime < 540) {
            textStyle(BOLD);
            textSize(32);
            text("CRONIN:", width / 4, height / 2 + 50);
            text("DAME:", width / 2 + 30, height / 2 + 50);
            textSize(22);
            textStyle(NORMAL);
            image(lillardImg, width / 2 + 60 - lillardImg.width/2, height / 4 - 40, 150, 150);
            image(croninImg, width / 4 - croninImg.width/2, height / 4 - 40, 150, 150);
            textStyle(ITALIC);
            text("OK great. NBA Finals, here we come!", width / 2 + 45, height / 2 + 175);
        } else if (animationTime < 700) {
            textStyle(BOLD);
            textSize(32);
            text("CRONIN:", width / 4, height / 2 + 50);
            text("DAME:", width / 2 + 30, height / 2 + 50);
            textSize(22);
            textStyle(NORMAL);
            image(lillardImg, width / 2 + 60 - lillardImg.width/2, height / 4 - 40, 150, 150);
            image(croninImg, width / 4 - croninImg.width/2, height / 4 - 40, 150, 150);
            textStyle(ITALIC);
            text("OK great. NBA Finals, here we come!", width / 2 + 45, height / 2 + 175);
            text("Portland, this one's for you!", width / 2 + 45, height / 2 + 200);
            textStyle(NORMAL);
        } else {
            textSize(22);
            textStyle(NORMAL)
            // Clear the dialogue
            dialogue1 = "";
            dialogue2 = "";
            dialogue3 = "";
        
            // Start the game when the user clicks
            /*
            if (mouseIsPressed) {
                gameState = "start";
            }
            */
            // OVERRIDE:
            gameState = "start";
        }
        
    } else if (gameState === "start") {
        cursor();
		
		// Show the title
		textSize(44);
		textAlign(CENTER, CENTER);
		textStyle(BOLD);
		drawLabel("🔥HEATSEEKER🔥", width / 2, height / 2 - 240, textSize(), "center");
		textSize(30);
		textStyle(NORMAL);
		drawLabel("Portland Escape!", width / 2, height / 2 - 210, textSize(), "center");

		// Show the "click to start" message
		textSize(72);
		textAlign(CENTER, CENTER);
		fill(255);
		text("🏀", width / 2, height / 2 - 105);
		textSize(28);
		textStyle(BOLD);
		drawLabel("CLICK TO DEMAND TRADE", width / 2, height / 2 - 105, textSize(), "center");
		textStyle(NORMAL);

		// Show the game's instructions
		
        /*
        textSize(22);
		textStyle(BOLD);
		drawLabel("You are Damian Lillard,", width / 2, height / 2 - 95, textSize(), "center");
		textStyle(NORMAL);
		drawLabel("11x NBA All-Star 🏆", width / 2, height / 2 - 75, textSize(), "center");
		drawLabel("and best player in", width / 2, height / 2 - 55, textSize(), "center");
		drawLabel("franchise history! 💯", width / 2, height / 2 - 35, textSize(), "center");
		*/

        textSize(18);
		drawLabel("Damian Lillard made a very polite request", width / 2, height / 2 + 30, textSize(), "center");
		drawLabel("to go pursue his dream for a championship 🙏", width / 2, height / 2 + 50, textSize(), "center");
		drawLabel("But Crooked Joe Cronin has other plans... 🐍", width / 2, height / 2 + 70, textSize(), "center");
		textSize(18);
		drawLabel("Kill Crooked Cronins by shooting", width / 2 - 0, height / 2 + 100, textSize(), "center");
		drawLabel("basketballs at them 🏀💀", width / 2 - 0, height / 2 + 120, textSize(), "center");
		drawLabel("But if you make contact with a Crooked Cronin,", width / 2 + 0, height / 2 + 170, textSize(), "center");
		drawLabel("you\'ll lose some of your GRIND! 😤", width / 2 + 0, height / 2 + 190, textSize(), "center");
		textSize(18);
		drawLabel("Kill 150 Crooked Cronins before he takes", width / 2, height / 2 + 230, textSize(), "center"); 
		drawLabel("all your GRIND to get traded to Miami! 🌊🌴", width / 2, height / 2 + 250, textSize(), "center");
	
	} else if (gameState === "play") {
        noCursor();
        if(!gameStarted) {
            setTimeout(function() {
                gameStarted = true;
            }, 1000);
        }
		if (invincible) {
			invincibleTimer--;
			if (invincibleTimer <= 0) {
				invincible = false;
			}

		}
		// Draw the team logo in the center of the canvas
		if (typeof myObject !== 'undefined' && myObject !== null) {
			logo = teamLogos[myObject.levelNumber - 1];
		} else {
			logo = teamLogos[currentLevel.levelNumber - 1];
		}
		
		image(logo, width / 2 - 150/ 2, height / 2 - 150 / 2, 150, 150);

		// Display and move the spaceship
		spaceship.show();
		spaceship.move();

		// Generate asteroids
		asteroidCounter++;
        if (asteroidCounter >= asteroidGenerationRate && !levelTransition) {
            let newAsteroid;
            if (currentLevel.levelNumber ===  1) {
                console.log("*LEVEL " + currentLevel.levelNumber + "...");
                newAsteroid = new Asteroid(asteroidImg.width / 2, customBlazersAsteroids[Math.floor(Math.random() * customBlazersAsteroids.length)]);
                //newAsteroid = new Asteroid(asteroidImg.width / 2, asteroidImg);
            } else if (currentLevel.levelNumber === 5) {
                console.log("*LEVEL " + currentLevel.levelNumber + "...");
                newAsteroid = new Asteroid(asteroid_altImg.width / 2, asteroid_altImg);
            } else {
                console.log("LEVEL " + currentLevel.levelNumber + "...");
                newAsteroid = new Asteroid(asteroidImg.width / 2, asteroidImg);
                //newAsteroid = new Asteroid(asteroidImg.width / 2, customBlazersAsteroids[Math.floor(Math.random() * customBlazersAsteroids.length)]);
            }
            asteroids.push(newAsteroid);
            asteroidCounter = 0;
        }

        // Handle level transition
        if (levelTransition) {
            levelTransitionTimer--;
            // Freeze asteroids and start fade-out effect
            if (levelTransitionTimer === 30) {
                for (let asteroid of asteroids) {
                    asteroid.isMoving = false;
                    asteroid.hit = true; // This will start the fade-out effect
                }
            }
            // Resume asteroid movement and generation after transition
            else if (levelTransitionTimer <= 0) {
                levelTransition = false;
                for (let asteroid of asteroids) {
                    asteroid.isMoving = true;
                    asteroid.hit = false; // This will stop the fade-out effect
                }
            }
        }

        /* BULLET related stuff: */

		// Bullet and asteroid interaction
		for (let i = bullets.length - 1; i >= 0; i--) {
			bullets[i].show();
			bullets[i].move();

			// Bullet goes offscreen
			if (bullets[i].offscreen()) {
				bullets.splice(i, 1);
				continue; // Skip to next iteration as current bullet is removed
			}

			// Bullet hits asteroid
			for (let j = asteroids.length - 1; j >= 0; j--) {
				if (bullets[i] !== undefined && asteroids[j] !== undefined && bullets[i].hits(asteroids[j])) {
					asteroids[j].hit = true;
					bullets.splice(i, 1);
					score++;
					spaceship.img = spaceship2Img;
					spaceship.timer = 90; // 1.5 seconds recovery timer
					killSound.play();
					break;
				}
			}
		}

        /* ASTEROID related stuff: */
        
		for (let i = asteroids.length - 1; i >= 0; i--) {
			// Apply asteroid logic
			currentLevel.applyAsteroidLogic(asteroids[i]);

			// Display and move each asteroid
			asteroids[i].show();
			asteroids[i].move();

			// Asteroid goes offscreen
			if (asteroids[i].offscreen()) {
				asteroids.splice(i, 1);
				continue; // Skip to next iteration as current asteroid is removed
			}
			// Asteroid hits spaceship
			if (asteroids[i] !== undefined && asteroids[i].hits(spaceship) && !invincible) {
				bruhSound.play();
				spaceship.lives--;
				asteroids[i].hit = true;
				// If spaceship has no more lives, game over
				if (spaceship.lives <= 0) {
                    // Get the team Dame got traded to
                    let team = score <= 30 ? nbaTeams[currentLevel.levelNumber - 1] : nbaTeams[nbaTeams.length - 1];
                    // Log Google Analytics game_over event
                    gtag('event', 'game_over', {
                        'event_category': 'game',
                        'event_label': 'Game Over',
                        'value': team
                    });
                    // Game reset logic
                    gameOver = true;
					cursor(); // Show the cursor again
					button.show(); // Show Try again button
					tweetButton.show();  // Show Tweet button
					noLoop(); // Stop draw loop
					soundtrack.stop(); // Stop the soundtracks
					dameDollaSound.stop();
					gameOverSound.play(); // Play the game over sound
                    
                    // Call the AI 'Ask Dame' function and handle the promise it returns
                    console.log('Asking Dame for his thoughts... ');
                    /* getDameOpinion(team, score, textModifier).then(dameOpinion => {                    
                        // Display Damian's opinion
                        if (typeof dameOpinion === 'string' || dameOpinion instanceof String) {
                            console.log('dameOpinion is a string:', dameOpinion);
                            const displayText = dameOpinion;
                            textSize(14);
                            textFont('Verdana');
                            text(displayText, 100, height / 4 - 50); // x, y are the coordinates where you want to display the text
                            textFont('Arial')
                            textSize(20);
                        } else {
                            console.error('UH-OH! Damian Lillard gave a bad response ---> ', dameOpinion);
                            const displayText = "Joe Cronin took your GRIND!";
                            textSize(14);
                            textFont('Verdana');
                            textAlign(CENTER);
                            text(displayText, width / 4, height / 2 - 50); // x, y are the coordinates where you want to display the text
                            textFont('Arial')
                            textSize(20);
                        }
                        console.log('Dame\'s opinion: ', dameOpinion);
                    }); */
                    
                    console.log("Team: ",team);
                                        
                    // Show placeholder text before openAI response is received
                    let sideMarginPercent = 0.075;

                    textAlign(CENTER);
                    textSize(18);
                    textStyle(NORMAL);
                    textFont('TAHOMA');
                    text("When asked about playing on the", width / 2, height / 4 * 2 + 75);
                    text(team + " next season,", width / 2, height / 4 * 2 + 95);
                    text("Dame replied:", width / 2, height / 4 * 2 + 115);
                    textAlign(LEFT);
                    textStyle(NORMAL);

                    // Send prompt to openAI, then receive and show response
                    getDameOpinion(team, score, textModifier).then(dameOpinion => {
                        // Once Dame's opinion is received, verify it's actually a string
                        if (typeof dameOpinion === 'string' || dameOpinion instanceof String) {

                            // break the AI's response into words
                            const words = dameOpinion.split(' ');
                            let line = '';

                            // print the AI's response
                            textSize(15);
                            textFont('TAHOMA');
                            textStyle(NORMAL);
                            textAlign(LEFT);
                            // break the AI's response into lines to fit the screen size
                            let y = height / 4 * 2 + 150;
                            for (let i = 0; i < words.length; i++) {
                                let testLine = line + words[i] + ' ';
                                let testWidth = textWidth(testLine);
                                if ((testWidth > width * (1 - (2 * sideMarginPercent))) && i > 0) {
                                    textAlign(LEFT);
                                    text(line, width * sideMarginPercent, y);
                                    line = words[i] + ' ';
                                    y += textAscent() + textDescent();
                                } else {
                                    line = testLine;
                                }
                            }
                            text(line, width * (1.1*sideMarginPercent), y);
                            
                            // reset text style
                            textFont('Arial')
                            textSize(20);
                            textStyle(NORMAL);
                            textAlign(LEFT);
                        } else {
                            console.error('UH-OH! Damian Lillard gave a bad response ---> ', dameOpinion);
                            const displayText = "Joe Cronin took your GRIND!";
                            
                            // print the bad response
                            textFont('Verdana');
                            textSize(12);
                            textStyle(ITALIC);
                            textAlign(CENTER);
                            text(displayText, width / 2 + 20, height / 4 * 3 + 40); // x, y are the coordinates where you want to display the text
                            
                            // reset text style
                            textFont('Arial')
                            textStyle(NORMAL);
                            textStyle(LEFT);
                            textSize(20);
                        }
                        console.log('Dame\'s opinion: ', dameOpinion);
                    }).then(dameTweetText => {
                        // Compose the tweet using the dameTweetText and the url
                        let dameTweet = getDameTweet(team, dameOpinion);
                        let dameTweetURL = "https://damian.lillard.trade";
                        console.log(dameTweet);
                        ////////let tweetUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(dameTweet) + "&url=" + encodeURIComponent(dameTweetURL);
                        // Auto open a window
                        ////////window.open(tweetUrl, '_blank');
                        // Show the tweet button;
                        ////////tweetButton.show();
                    });

				// If NOT game over yet, then make the spaceship invincible for a short period of time
				} else {
					invincible = true;
					invincibleTimer = 90; // 1.5 second of invincibility
				}
			}
			if (asteroids[i] !== undefined && asteroids[i].alpha <= 0) {
				asteroids.splice(i, 1);
			}
		}

        /* LEVEL (transition) related stuff: */

		if (score >= currentLevel.asteroidCount) {
			let nextLevelIndex = levels.indexOf(currentLevel) + 1;
			if (levels[nextLevelIndex]) {
				currentLevel = levels[nextLevelIndex];
				levelTransition = true;
				levelTransitionTimer = 300; // Transition will last for 5 seconds
		
				// Clear the asteroids array
				asteroids = [];

				// Play level up sound
				levelUpSound.play();
                
                // When the next level condition is met
                gtag('event', 'level_up', {
                    'event_category': 'game',
                    'event_label': 'Level Up',
                    'value': nbaTeams[nextLevelIndex]
                });
			} else {
				console.log("You win!");
				// Implement game completion logic here...
			}
		}
		
        /* TEXT related stuff: */
        
		// Determine current team by looking up current score in the list of NBA teams
		let team = score <= 30 ? nbaTeams[score - 1] : nbaTeams[nbaTeams.length - 1];

		// Draw lives remaining
        fill(255);
		textSize(22);
		textAlign(RIGHT);
		textStyle(BOLD);
        if (spaceship.lives > 0) {
            drawLabel("GRIND: ", 30, height - 180, textSize(), "left");
        } else {
            textStyle(NORMAL);
            textSize(22);
            drawLabel("You ran from the grind!", width / 2, height / 2 - 200, textSize(), "center");
            textStyle(NORMAL);
            textSize(22);
        }
		textStyle(NORMAL);
		textSize(24);
		textAlign(RIGHT);
		for (let i = 0; i < spaceship.lives; i++) {
			drawLabel("❤️", 50 + i * 30 - 30, height - 150, textSize(), "left");
		}
		
		// Draw current scorel
		textSize(20);
		textAlign(LEFT);
		textStyle(BOLD);
		let scoreText;
		if (score == 1) {
			scoreText = score + " CRONIN KILLED";
		} else {
			scoreText = score + " CRONINS KILLED";
		}
		drawLabel(scoreText, 50, 50, textSize(), "left");
		textStyle(NORMAL);

		// Draw current team
		if (score > 0) {
			let team = nbaTeams[currentLevel.levelNumber - 1];
			textSize(16);
			drawLabel(team, 50, 70, textSize(), "left");
			textSize(20);
		}
		
        /* OTHER stuff: */

		// (text announcement)
		if (levelTransition) {
			textSize(60);
			textAlign(CENTER, CENTER);
			fill(255);
			//text("Level " + currentLevel.levelNumber, width / 2, height / 2);
			drawLabel("LEVEL " + currentLevel.levelNumber, width / 2, height / 2 - 150, textSize(), "center");
			textSize(40);
			let team = nbaTeams[currentLevel.levelNumber - 1];
			//text(team, width / 2, height / 2 + 50);
			drawLabel(team, width / 2, height / 2 - 100, textSize(), "center");
		}
		// (for transition timer)
		if (levelTransition) {
			levelTransitionTimer--;
			if (levelTransitionTimer <= 0) {
				levelTransition = false;
			}
		}

		// ...for reverting spaceship back to normal after damage-rcvd image
		if (spaceship.timer > 0) {
			spaceship.timer--;
			if (spaceship.timer <= 0) {
				spaceship.img = spaceshipImg;
			}
		}
	}
}


/* HELPER FUNCTIONS: */


// Show fancy text labels
function drawLabel(labelText, x, y, size, tAlign) {
    // Use the selected alignment option
    if (tAlign === "left") {
        textAlign(LEFT, CENTER);
    } else if (tAlign === "right") {
        textAlign(RIGHT, CENTER);
    } else if (tAlign === "center") {
        textAlign(CENTER, CENTER);
    } else {
        textAlign(CENTER, CENTER);
    }

    // Draw the text
    fill(255);  // white text
    if (tAlign === "center") {
        // Adjust x and y for centered text
        text(labelText, x, y);
    } else if (tAlign === "left") {
        text(labelText, x, y);
    } else if (tAlign === "right") {
        text(labelText, x, y);
    }
}

// Mouse-pressed function
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
    let url = "https://damian.lillard.trade";
    let tweetUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url);
    window.open(tweetUrl, '_blank');
    // When the tweet my score button is clicked
    gtag('event', 'tweet_my_score', {
        'event_category': 'game',
        'event_label': 'Tweet My Score',
        'value': text
    });
}

/* CLASSES: */

// Spaceship class
function Spaceship(r, lives) {
	this.pos = createVector(width / 2, height / 2);
	this.r = r;
	this.lives = lives;
	this.img = spaceshipImg;
	this.timer = 0;
	this.show = function() {
		if (invincible && frameCount % 2 == 0) {
			return; // don't draw spaceship for this frame to create flicker effect
		}
		image(this.img, this.pos.x - this.r, this.pos.y - this.r, this.r * 2, this.r * 2);
	}

	this.move = function() {
		this.pos.set(mouseX, mouseY);
	}
}

// Asteroid class
function Asteroid(r, img) {
    let spawnEdge = floor(random(4)); // 0: top, 1: right, 2: bottom, 3: left
    if (spawnEdge === 0) {
        this.pos = createVector(random(width), -r);
    } else if (spawnEdge === 1) {
        this.pos = createVector(width + r, random(height));
    } else if (spawnEdge === 2) {
        this.pos = createVector(random(width), height + r);
    } else if (spawnEdge === 3) {
        this.pos = createVector(-r, random(height));
    }

    this.isMoving = true;
    this.vel = p5.Vector.sub(spaceship.pos, this.pos);
    this.vel.setMag(random(1, 3)); // random speed between 1 and 3
    this.r = r;
    this.hit = false;
    this.alpha = 255;
    this.gracePeriod = 60; // 1 second grace period
    this.hitImg = img;
	this.show = function() {
	    console.log("Showing asteroid");
	    tint(255, this.alpha);
	    image(this.hitImg, this.pos.x - this.r, this.pos.y - this.r);
	    noTint();
	    if (this.hit) {
	        this.hitImg = asteroid2Img;  // Change the image upon being hit
	        this.alpha -= 2.55; // Fade out
	        if (this.alpha <= 0) {
	            this.offscreen = function() {
	                return true;
	            }
	        }
	    }
	}

    this.move = function() {
        if (!this.hit && this.isMoving) {
            this.pos.add(this.vel);
        }
		// ???
        if (this.gracePeriod > 0) {
            this.gracePeriod--;
        }
    }
    
    this.offscreen = function() {
        return this.gracePeriod <= 0 && (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0);
    }
    
	this.hits = function(other) {
		if (this.gracePeriod > 0 || this.hit) { 
			return false;
		}
		let dx = this.pos.x - other.pos.x;
		let dy = this.pos.y - other.pos.y;
		let distanceSquared = dx * dx + dy * dy;
		let radiiSquared = (this.r + other.r) * (this.r + other.r);
		return distanceSquared < radiiSquared;
	}

	// Homing asteroids (introduced in Level 1)
	this.follow = function(target, speed) {
        // Create a vector pointing from this asteroid to the target
        let force = p5.Vector.sub(target, this.pos);
        // Set the magnitude of the vector to the desired speed
        force.setMag(speed);
        // Apply the force to the asteroid's velocity
        this.vel = force;
    };

	// Edge-bouncing asteroids (introduced in Level 3)
	this.bounce = function() {
		if (this.pos.x < this.r || this.pos.x > width - this.r) {
			this.vel.x *= -1;
		}
		if (this.pos.y < this.r || this.pos.y > height - this.r) {
			this.vel.y *= -1;
		}
	}

	// Zig-zagging asteroids (introduced in Level 6)
    this.zigzag = function(amplitude, frequency) {
        // Calculate the y offset using a sine wave
        let yOffset = amplitude * sin(frameCount * frequency);

        // Add the offset to the asteroid's y position
        this.pos.y += yOffset;

        // Restrict the asteroid's y position to within the canvas
        this.pos.y = constrain(this.pos.y, 0, height);
    };

}

// Bullet Class
function Bullet(spos, epos) {
    this.pos = createVector(spos.x, spos.y);
    if (spos.x === epos.x && spos.y === epos.y) {
        // Create a random velocity vector
        this.vel = createVector(random(-2, 2), random(-2, 2));
    } else {
        this.vel = p5.Vector.sub(epos, spos);
    }
    this.vel.setMag(4);
    this.r = 16;
    this.particles = []; // New particle array
    this.alpha = 255;
    this.show = function() {
        push();
        textSize(this.r * 2);
		
        text("🏀", this.pos.x, this.pos.y);
        pop();
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].show();
            if (this.particles[i].alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    this.move = function() {
        this.pos.add(this.vel);
        this.particles.push(new Particle(this.pos)); // Add a new particle each frame
    }

    this.offscreen = function() {
        return (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height);
    }

    this.hits = function(other) {
        let dx = this.pos.x - other.pos.x;
        let dy = this.pos.y - other.pos.y;
        let distanceSquared = dx * dx + dy * dy;
        let radiiSquared = (this.r + other.r) * (this.r + other.r);
        if (distanceSquared < radiiSquared) {
            return true;
        } else {
            return false;
        }
    }
}

// Particle Class
function Particle(pos) {
    this.pos = createVector(pos.x, pos.y);
    this.alpha = 255;
    
	this.show = function() {
		fill(255, this.alpha);
		noStroke();
		ellipse(this.pos.x, this.pos.y, 4);
		this.alpha -= 12.75 * 0.2; // Adjust this value to alter the rate of fading
	}
}


/* OTHER GAME FUNCTIONS: */


// Reset the game
function resetGame() {
	spaceship = new Spaceship(spaceshipImg.width / 2, 3);
	spaceship.pos = createVector(width / 2, height / 2);
	asteroids = [];
	for (let i = 0; i < 5; i++) {
		asteroids.push(new Asteroid(asteroidImg.width / 2, asteroidImg));
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
	soundtrack.play(); // Restart the soundtrack
	loop(); // Restart the draw loop
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function toggleSound() {
    if (soundIsOn) {
        soundIsOn = false;
        //muteButton.html('Unmute');
        soundtrack.stop(); // stop the sound
    } else {
        soundIsOn = true;
        //muteButton.html('Mute');
        soundtrack.loop(); // play the sound
    }
}

function toggleDameSound() {
    if (dameSoundIsOn) {
        dameSoundIsOn = false;
        //dameSoundIsOn.html('X'); // change the button text
        soundtrack.stop(); // stop the soundtrack
		dameDollaSound.loop(); // play alternate soundtrack
    } else {
        dameSoundIsOn = true;
        //dameSoundIsOn.html('Dame'); // change the button text
		dameDollaSound.stop(); // stop the alternate soundtrack	
        soundtrack.loop(); // play the soundtrack
    }
}
