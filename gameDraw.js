// Draw
function draw() {
    background(0);

    if (gameOver) {
        drawGameOver();
        noLoop();
    } else {
        spaceship.move();
        spaceship.show();

        for (let i = asteroids.length - 1; i >= 0; i--) {
            if (asteroids[i].pos.x > width + asteroids[i].r || asteroids[i].pos.x < -asteroids[i].r || asteroids[i].pos.y > height + asteroids[i].r || asteroids[i].pos.y < -asteroids[i].r) {
                asteroids.splice(i, 1);
            } else {
                asteroids[i].show();
                asteroids[i].update();

                if (frameCount > 60 && spaceship && !invincible && dist(spaceship.pos.x, spaceship.pos.y, asteroids[i].pos.x, asteroids[i].pos.y) < spaceship.r + asteroids[i].r) {
                    lives -= 1;
                    if (lives <= 0) {
                        gameOver = true;
                        explosionSound.play();
                    } else {
                        spaceship = new Spaceship(spaceshipImg.width / 2, lives);
                        invincible = true;
                        setTimeout(() => invincible = false, 3000); // Invincible for 3 seconds
                    }
                }

                for (let j = bullets.length - 1; j >= 0; j--) {
                    if (bullets[j].hits(asteroids[i])) {
                        if (asteroids[i].r > 10) {
                            let newAsteroids = asteroids[i].breakup();
                            asteroids = asteroids.concat(newAsteroids);
                        }
                        asteroids.splice(i, 1);
                        bullets[j].evaporate();
                        score += 10;
                    }
                }
            }
        }

        for (let i = bullets.length - 1; i >= 0; i--) {
            if (bullets[i].toDelete) {
                bullets.splice(i, 1);
            } else {
                bullets[i].show();
                bullets[i].update();
            }
        }

        drawLabel();
    }
}
