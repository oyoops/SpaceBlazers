// Preload Images
let spaceship;
let spaceshipImg;
let spaceshipImg2;
let spaceshipImg3;
let asteroids = [];
let asteroidImg;
let bullets = [];
let gameState = "start";
let gameOver = false;
let invincible = false;
let invincibleTimer = 0;
let button;
let asteroidGenerationTime = 300; // 5 seconds
let timeElapsed = 0;
let score = 0;
let gameStarted = false;

function preload() {
	spaceshipImg = loadImage('imgs/spaceship.png', img => img.resize(90, 0));
	spaceship2Img = loadImage('imgs/spaceship2.png', img => img.resize(90, 0));
	spaceship3Img = loadImage('imgs/spaceship3.png', img => img.resize(90, 0));
	asteroidImg = loadImage('imgs/asteroid.png', img => img.resize(75, 0));
}

// Setup
function setup() {
    createCanvas(windowWidth, windowHeight);
    spaceship = new Spaceship(spaceshipImg.width / 2, 3);
    button = createButton('Try Again');
    button.position(width / 2 - button.width / 2, height / 2 - button.height / 2);
    button.mousePressed(resetGame);
    button.hide();
}
/*
function setup() {
	createCanvas(800, 600);
	spaceship = new Spaceship(spaceshipImg.width / 2, 3);
	for(let i=0; i<5; i++) {
		asteroids.push(new Asteroid(asteroidImg.width / 2));
	}
	button = createButton('Try Again');
	button.position(width / 2 - button.width / 2, height / 2 - button.height / 2);
	button.mousePressed(resetGame);
	button.hide();
}
*/

// Main Draw Function
function draw() {
	if (score >= 5) {
		background(50);
	} else {
		background(0);
	}

	if (gameState === "start") {
		textSize(48);
		textAlign(CENTER, CENTER);
		fill(255);
		text("Space Blazers", width / 2, height / 2);
		textSize(24);
		text("Click to Start", width / 2, height / 2 + 50);
	} else if (gameState === "play") {
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
        */
        // Simplified asteroid generation logic
        if (frameCount % 60 == 0) {  // Every 60 frames (or 1 second), create a new asteroid
            asteroids.push(new Asteroid(asteroidImg.width / 2));
        }
        // Display and move each asteroid
        for (let i = asteroids.length - 1; i >= 0; i--) {
            asteroids[i].show();
            asteroids[i].move();
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
					spaceship.img = spaceship2Img;
					spaceship.timer = 90; // 1.5 seconds recovery timer
					break;
				}
			}
		}

		for (let i = asteroids.length - 1; i >= 0; i--) {
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
					//console.log("GAME OVER");
					gameOver = true;
					button.show();
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

		// Determine current score --> team
		let team = "Portland Trail-Blazers";
		if (score >= 10) {
			team = "Miami Heat";
		} else if (score >= 5) {
			team = "Sacramento Kings";
		}

		// Draw lives
		fill(255);
		textSize(24);
		text("LIVES:", 10, 30);
		for (let i = 0; i < spaceship.lives; i++) {
			text("❤️", 90 + i * 30, 30);
		}

		// Draw score and team
		textSize(24);
		textAlign(RIGHT);
		text("SCORE: " + score, width - 30, 30);
		text("TEAM: " + team, width - 30, 60);

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

	this.vel = p5.Vector.sub(createVector(width / 2, height / 2), this.pos);
	this.vel.setMag(random(1, 3)); // random speed between 1 and 3
	this.r = r;
	this.hit = false;
	this.alpha = 255;
	this.show = function() {
		tint(255, this.alpha);
		image(asteroidImg, this.pos.x - this.r, this.pos.y - this.r);
		noTint();
		if (this.hit) {
			this.alpha -= 2.55; // fade out over 1 second
			if (this.alpha <= 0) {
				this.offscreen = function() {
					return true;
				}
			}
		}
	}
	this.move = function() {
		if (!this.hit) {
			this.pos.add(this.vel);
		}
	}
	this.offscreen = function() {
		return this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0;
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

// Bullet Class
function Bullet(spos, epos) {
	this.pos = createVector(spos.x, spos.y);
	this.vel = p5.Vector.sub(epos, spos);
	this.vel.setMag(2);
	this.r = 8;
	this.show = function() {
		push();
		textSize(this.r * 2);
		text("🏀", this.pos.x, this.pos.y);
		pop();
	}
	this.move = function() {
		this.pos.add(this.vel);
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
	button.hide();
	loop();
}