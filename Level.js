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
                //asteroid.vel = createVector(random(0, 1), random(0, 1));
                //asteroid.vel.setMag(random(1, 2));
                break;
			case 11:
				asteroid.zigzag();
				//asteroid.vel = createVector(random(0, 1), random(0, 1));
				//asteroid.vel.setMag(random(3, 4));
				break;
            default:
				asteroid.follow(spaceship.pos, 4);
				//asteroid.vel = createVector(random(0, 1), random(0, 1));
				//asteroid.vel.setMag(random(3, 4));
                console.error('ERROR: Non-contact injury during practice; undergoing further evaluation ... team fears torn ACL.', this.levelNumber);
        }
    }
}
