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