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