class Level {
    constructor(levelNumber, asteroidLogic, asteroidCount) {
        this.levelNumber = levelNumber;
        this.asteroidLogic = asteroidLogic; // This is a function that describes the logic for the asteroids
        this.asteroidCount = asteroidCount;
    }
    
    applyAsteroidLogic(asteroid) {
        this.asteroidLogic(asteroid);
    }
}
