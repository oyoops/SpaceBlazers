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
