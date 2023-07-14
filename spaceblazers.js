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
//let dingSound;


// Leveling
class Level {
    constructor(levelNumber, asteroidLogic, asteroidCount) {
        this.levelNumber = levelNumber;
        this.asteroidLogic = asteroidLogic; // This is a function that describes the logic for the asteroids
        this.asteroidCount = asteroidCount;
    }
    
    applyAsteroidLogic(asteroid) {
        switch (this.levelNumber) {
            case 1:
                // Initial logic is already set, so nothing to do here
                break;
            case 2:
                asteroid.follow(spaceship.pos, 1);
                break;
            case 3:
                asteroid.follow(spaceship.pos, 2);
				asteroid.bounce();
                break;
            case 4:
                if (frameCount > 180) { // 3 seconds
                    asteroid.follow(spaceship.pos, 1);
                }
                break;
            case 5:
                if (frameCount > 180) { // 3 seconds
                    asteroid.follow(spaceship.pos, 2);
                }
                break;
            case 6:
                asteroid.zigzag(10, 0.1);
                break;
            case 7:
                asteroid.follow(spaceship.pos, 1);
                asteroid.zigzag(10, 0.1);
                break;
            case 8:
                if (frameCount > 180) { // 3 seconds
                    asteroid.follow(spaceship.pos, 1);
                    asteroid.zigzag(10, 0.1);
                }
                break;
            case 9:
                asteroid.follow(spaceship.pos, 2);
                asteroid.zigzag(10, 0.1);
                break;
            case 10:
                asteroid.vel = createVector(random(-1, 1), random(-1, 1));
                asteroid.vel.setMag(random(1, 2));
                break;
			case 11:
				asteroid.bounce();
				asteroid.vel = createVector(random(-1, 1), random(-1, 1));
				asteroid.vel.setMag(random(1, 2));
				break;
            default:
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
        // Level 1 logic
    }, 5),
    new Level(2, function(asteroid) {
        // Level 2 logic
    }, 10),
    new Level(3, function(asteroid) {
        // Level 3 logic
    }, 10),
    new Level(4, function(asteroid) {
        // Level 4 logic
    }, 10),
    new Level(5, function(asteroid) {
        // Level 5 logic
    }, 10),
    new Level(6, function(asteroid) {
        // Level 6 logic
    }, 10),
    new Level(7, function(asteroid) {
        // Level 7 logic
    }, 10),
    new Level(8, function(asteroid) {
        // Level 8 logic
    }, 10),
    new Level(9, function(asteroid) {
        // Level 9 logic
    }, 10),
    new Level(10, function(asteroid) {
        // Level 10 logic
    }, 10),
    // Add more levels as needed...
];
let currentLevel = levels[0]; // Start at level 1


// Preload
function preload() {
    console.log("Demanding a trade from Joe Cronin...");
    spaceshipImg = loadImage('imgs/spaceship.png', img => img.resize(100, 100));
    spaceship2Img = loadImage('imgs/spaceship2.png', img => img.resize(100, 100));
    spaceship3Img = loadImage('imgs/spaceship3.png', img => img.resize(100, 100));
    asteroidImg = loadImage('imgs/asteroid.png', img => img.resize(100, 0), err => console.log('Error loading asteroid image:', err));
    asteroid2Img = loadImage('imgs/asteroid2.png', img => img.resize(100, 0), err => console.log('Error loading asteroid image:', err));
    //dingSound = loadSound('sounds/ding.mp3');
}


// Setup
function setup() {
    createCanvas(windowWidth, windowHeight);
    spaceship = new Spaceship(spaceshipImg.width / 2, 3);
    
	// Try again button (Hidden until game over))
	button = createButton('Try again');
    button.position(width / 2 - button.width / 2, height / 2 - button.height / 2 - 30); // Place above the Tweet button
    button.hide();
    button.mousePressed(resetGame);

    // Tweet button (Hidden until game over)
    tweetButton = createButton('Tweet my score');
    tweetButton.position(width / 2 - tweetButton.width / 2, height / 2 - tweetButton.height / 2);
    tweetButton.mousePressed(() => tweetScore(score));
    tweetButton.hide();

	// Hide cursor
    noCursor();
}


// Draw function
function draw() {
	if (score >= 30) {
		background(50);
	} else if (score >= 20) {
		background(0);
	} else if (score >= 15) {
		background(0);
	} else if (score >= 10) {
		background(0);
	} else if (score >= 5) {
		background(0);
	} else if (score >= 1) {
		background(0);
	} else {
		background(0);
   	}

	if (gameState === "start") {
        cursor();
		textSize(72);
		textAlign(CENTER, CENTER);
		fill(255);
		text("🏀", width / 2, height / 2);
		textSize(28);
		text("Click to demand a trade.", width / 2, height / 2 + 50);
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

		spaceship.show();
		spaceship.move();

        /*
        // Generate asteroids
        if (frameCount >= 60 && frameCount % asteroidGenerationTime == 0) {
			asteroids.push(new Asteroid(asteroidImg.width / 2));
			timeElapsed += asteroidGenerationTime;
			if (timeElapsed >= 600) { // 10 seconds
				asteroidGenerationTime /= 2;
				timeElapsed = 0;
			}
		}
        // Simplified asteroid generation logic
        //if (frameCount % 60 == 0) {  // Every 60 frames (or 1 second), create a new asteroid
        //    asteroids.push(new Asteroid(asteroidImg.width / 2));
        //}
        // Display and move each asteroid
        //for (let i = asteroids.length - 1; i >= 0; i--) {
        //    asteroids[i].show();
        //    asteroids[i].move();
        //}
	*/
		// Generate asteroids
		asteroidCounter++;
        if (asteroidCounter >= asteroidGenerationRate && !levelTransition) {
            let newAsteroid = new Asteroid(asteroidImg.width / 2);
            asteroids.push(newAsteroid);
            asteroidCounter = 0;
        }
		

        // Handle level transition
        if (levelTransition) {
            levelTransitionTimer--;
            // Freeze asteroids and start fade-out effect
            if (levelTransitionTimer === 120) {
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
		

		// Bullet and asteroid interaction
		for (let i = bullets.length - 1; i >= 0; i--) {
			bullets[i].show();
			bullets[i].move();

			for (let j = asteroids.length - 1; j >= 0; j--) {
				if (bullets[i] !== undefined && asteroids[j] !== undefined && bullets[i].hits(asteroids[j])) {
					asteroids[j].hit = true;
					bullets.splice(i, 1);
					score++;
                    			//dingSound.play();
					spaceship.img = spaceship2Img;
					spaceship.timer = 90; // 1.5 seconds recovery timer
					break;
				}
			}
		}

		for (let i = asteroids.length - 1; i >= 0; i--) {
			currentLevel.applyAsteroidLogic(asteroids[i]);

			asteroids[i].show();
			asteroids[i].move();
			if (asteroids[i].offscreen()) {
				asteroids.splice(i, 1);
				continue; // Skip to next iteration as current asteroid is removed
			}
			if (asteroids[i] !== undefined && asteroids[i].hits(spaceship) && !invincible) {
				spaceship.lives--;
				asteroids[i].hit = true;
				if (spaceship.lives <= 0) {
					cursor(); // Show the cursor again
					gameOver = true;
					button.show(); // Show the try again button on game over
					tweetButton.show();  // Show the tweet button on game over
					noLoop();
				} else {
					invincible = true;
					invincibleTimer = 60; // 1 second of invincibility
				}
			}
			if (asteroids[i] !== undefined && asteroids[i].alpha <= 0) {
				asteroids.splice(i, 1);
			}
		}

		//
		// Logic to move to the next level
		//

		if (score >= currentLevel.asteroidCount) {
			let nextLevelIndex = levels.indexOf(currentLevel) + 1;
			if (levels[nextLevelIndex]) {
				currentLevel = levels[nextLevelIndex];
				levelTransition = true;
				levelTransitionTimer = 120; // Transition will last for 2 seconds
			} else {
				console.log("You win!");
				// Implement game completion logic here...
			}
		}		
		

		//
		// Determine team v2:
		//
		
		// List of NBA teams
		let nbaTeams = [
			"Portland Trail Blazers",  // Portland Trail Blazers is the team for score 1
			"Boston Celtics",
			"Brooklyn Nets",
			"Charlotte Hornets",
			"Chicago Bulls",
			"Cleveland Cavaliers",
			"Dallas Mavericks",
			"Denver Nuggets",
			"Detroit Pistons",
			"Golden State Warriors",
			"Houston Rockets",
			"Indiana Pacers",
			"LA Clippers",
			"Los Angeles Lakers",
			"Memphis Grizzlies",
			"Milwaukee Bucks",
			"Minnesota Timberwolves",
			"New Orleans Pelicans",
			"New York Knicks",
			"Oklahoma City Thunder",
			"Orlando Magic",
			"Philadelphia 76ers",
			"Phoenix Suns",
			"Atlanta Hawks",
			"Sacramento Kings",
			"San Antonio Spurs",
			"Toronto Raptors",
			"Utah Jazz",
			"Washington Wizards",
			"Miami HEAT"  // Miami Heat is the team for score 30
		];

		// Determine team by looking up current score in the list of NBA teams
		let team = score <= 30 ? nbaTeams[score - 1] : nbaTeams[nbaTeams.length - 1];
		
		// Draw lives
		fill(255);
		textSize(20);
		textAlign(RIGHT);
		text("GRIND: ", width - 45, 20);
        textSize(26);
		for (let i = 0; i < spaceship.lives; i++) {
			text("❤️", width - 90 + i * 30, 50);
		}

		// Draw score and team
		textSize(20);
		textAlign(LEFT);
		text(score + " CRONINS KILLED", 30, 30);
		text("");
        textSize(20);
		if (score > 0) {
			let team = nbaTeams[currentLevel.levelNumber - 1];
			text("" + team, 30, 50);
		}
        
		//
		// Level transition
		//

		// (text announcement)
		if (levelTransition) {
			textSize(60);
			textAlign(CENTER, CENTER);
			fill(255);
			text("Level " + currentLevel.levelNumber, width / 2, height / 2);
			textSize(40);
			let team = nbaTeams[currentLevel.levelNumber - 1];
			text(team, width / 2, height / 2 + 50);
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
    let team = score >= 1 && score <= 30 ? "traded to the " + nbaTeams[score - 1] : "to retire from NBA";
    let text = "I got Damian Lillard " + team + " in #SpaceBlazers! Can you beat my score of " + score + " Joe Cronins destroyed? ";
    let url = "https://dame.lillard.trade";
    let tweetUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url);
    window.open(tweetUrl, '_blank');
}

// Spaceship Class
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

// Asteroid Class
function Asteroid(r) {
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
    this.hitImg = asteroidImg;
	this.show = function() {
	    console.log("Showing asteroid");
	    tint(255, this.alpha);
	    image(this.hitImg, this.pos.x - this.r, this.pos.y - this.r);
	    noTint();
	    if (this.hit) {
	        this.hitImg = asteroid2Img;  // Change the image upon hit
	        this.alpha -= 2.55;
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
        if (this.gracePeriod > 0) {
            return false;
        }
        let dx = this.pos.x - other.pos.x;
        let dy = this.pos.y - other.pos.y;
        let distanceSquared = dx * dx + dy * dy;
        let radiiSquared = (this.r + other.r) * (this.r + other.r);
        return distanceSquared < radiiSquared;
    }

	// FOLLOW - function to make asteroids follow the spaceship (introduced in Level 1)
	this.follow = function(target, speed) {
        // Create a vector pointing from this asteroid to the target
        let force = p5.Vector.sub(target, this.pos);
        // Set the magnitude of the vector to the desired speed
        force.setMag(speed);
        // Apply the force to the asteroid's velocity
        this.vel = force;
    };

	// BOUNCE - function to make asteroids bounce off the edges of the canvas (introduced in Level 3)
	this.bounce = function() {
		// Check if the asteroid has hit the left or right edge of the canvas
		if (this.pos.x < 0 || this.pos.x > width) {
			// Reverse the asteroid's x velocity
			this.vel.x *= -1;
		}
		// Check if the asteroid has hit the top or bottom edge of the canvas
		if (this.pos.y < 0 || this.pos.y > height) {
			// Reverse the asteroid's y velocity
			this.vel.y *= -1;
		}
	};

	// ZIGZAG - function to make asteroids zigzag in their paths (introduced in Level 6)
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
        this.vel = createVector(random(-1, 1), random(-1, 1));
    } else {
        this.vel = p5.Vector.sub(epos, spos);
    }
    this.vel.setMag(3);
    this.r = 16;
    this.particles = []; // New particle array
    
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
        this.alpha -= 5; // Decrease alpha to fade out
    }
}

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
	loop();
}
