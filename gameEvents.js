// Events
function mousePressed() {
    if (!gameOver) {
        let bullet = new Bullet(spaceship.pos, createVector(mouseX, mouseY), 4);
        bullets.push(bullet);
        shootSound.play();
    }
}

function keyPressed() {
    if (key == ' ') {
        let bullet = new Bullet(spaceship.pos, createVector(mouseX, mouseY), 4);
        bullets.push(bullet);
        shootSound.play();
    }
}
