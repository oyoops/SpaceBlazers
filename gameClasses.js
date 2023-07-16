// Leveling
class Level {
    constructor(levelNumber, asteroidLogic, asteroidCount) {
        this.levelNumber = levelNumber;
        this.asteroidLogic = asteroidLogic;
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
                //asteroid.zigzag(10, 0.1);
                asteroid.follow(spaceship.pos, 3);
				break;
            case 7:
                asteroid.follow(spaceship.pos, 3.5);
                break;
            case 8:
                if (frameCount > 180) { // 3 seconds
                    asteroid.follow(spaceship.pos, 4);
                    //asteroid.zigzag(10, 0.1);
                }
                break;
            case 9:
                asteroid.follow(spaceship.pos, 4);
                //asteroid.zigzag(10, 0.1);
                break;
            case 10:
				asteroid.follow(spaceship.pos, 4);
                asteroid.vel = createVector(random(0, 1), random(0, 1));
                asteroid.vel.setMag(random(1, 2));
                break;
			case 11:
				asteroid.zigzag();
				asteroid.vel = createVector(random(0, 1), random(0, 1));
				asteroid.vel.setMag(random(3, 4));
				break;
            default:
				asteroid.follow(spaceship.pos, 4);
				asteroid.vel = createVector(random(0, 1), random(0, 1));
				asteroid.vel.setMag(random(3, 4));
                console.error('ERROR: Non-contact injury during practice; undergoing further evaluation ... team fears torn ACL.', this.levelNumber);
        }
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

    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.vel.setMag(random(1, 2));
    this.r = r;
    this.c = color(255, 0, 0, 150);

    this.show = function() {
        fill(this.c);
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }

    this.update = function() {
        this.pos.add(this.vel);
    }

    this.follow = function(target, speed) {
        let force = p5.Vector.sub(target, this.pos);
        force.setMag(speed);
        this.vel = force;
    }

	this.zigzag = function(amplitude, frequency) {
		this.pos.y += amplitude * sin(frequency * frameCount);
	}
}

// Bullet Class
function Bullet(pos, target, r) {
	this.pos = createVector(pos.x, pos.y);
	let force = p5.Vector.sub(target, this.pos);
	force.setMag(10);
	this.vel = force;
	this.r = r;
	this.toDelete = false;
	this.c = color(255, 255, 0, 150);

	this.show = function() {
		fill(this.c);
		noStroke();
		ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
	}

	this.update = function() {
		this.pos.add(this.vel);
	}

	this.hits = function(asteroid) {
		let d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
		if (d < this.r + asteroid.r) {
			return true;
		} else {
			return false;
		}
	}

	this.evaporate = function() {
		this.toDelete = true;
	}
}
