// Draw function
function draw() {
	// Draw background
	image(spaceImage, 0, 0, width, height);
	if (score >= 30) {

		// Future update: CHANGE THIS INTO THE MIAMI HEAT COURT!
		//background(50);

	} else if (score >= 20) {
		//background(0);
	} else if (score >= 15) {
		//background(0);
	} else if (score >= 10) {
		//background(0);
	} else if (score >= 5) {
		//background(0);
	} else if (score >= 1) {
		//background(0);
	} else {
		//background(0);
   	}

	// Draw the game
	if (gameState === "start") {
        cursor();
		
		// Show the title
		textSize(48);
		textAlign(CENTER, CENTER);
		textStyle(BOLD);
		drawLabel("🔥  HEAT SEEKER:  🔥", width / 2, height / 2 - 260, textSize(), "center");
		textSize(34);
		textStyle(NORMAL);
		drawLabel("Portland Escape", width / 2, height / 2 - 230, textSize(), "center");

		// Show a cute basketball emoji
		textSize(72);
		textAlign(CENTER, CENTER);
		fill(255);
		text("🏀", width / 2, height / 2 - 155);

		// Show the "click to start" message
		textSize(28);
		textStyle(BOLD);
		drawLabel("CLICK TO DEMAND TRADE", width / 2, height / 2 - 155, textSize(), "center");
		textStyle(NORMAL);

		// Show the game's instructions
		textSize(22);
		textStyle(BOLD);
		drawLabel("You are Damian Lillard,", width / 2, height / 2 - 95, textSize(), "center");
		textStyle(NORMAL);
		drawLabel("11x NBA All-Star 🏆", width / 2, height / 2 - 75, textSize(), "center");
		drawLabel("and greatest player in", width / 2, height / 2 - 55, textSize(), "center");
		drawLabel("Portland history 💯", width / 2, height / 2 - 35, textSize(), "center");
		textSize(20);
		drawLabel("You recently made a very polite", width / 2, height / 2 + 40, textSize(), "center");
		drawLabel("request to go pursue your dream 🙏", width / 2, height / 2 + 60, textSize(), "center");
		drawLabel("But Crooked Cronin has other plans... 🐍", width / 2, height / 2 + 80, textSize(), "center");
		textSize(18);
		drawLabel("Kill Joe Cronins by shooting", width / 2 - 0, height / 2 + 120, textSize(), "center");
		drawLabel("them with basketballs 🏀💀", width / 2 - 0, height / 2 + 140, textSize(), "center");
		drawLabel("But you make contact with a Crooked Cronin,", width / 2 + 0, height / 2 + 180, textSize(), "center");
		drawLabel("you\'ll lose some of your GRIND! 😤", width / 2 + 0, height / 2 + 200, textSize(), "center");
		textSize(20);
		drawLabel("Kill 150 Crooked Cronins before he takes", width / 2, height / 2 + 240, textSize(), "center"); 
		drawLabel("all your GRIND to get traded to Miami! 🌊🌴", width / 2, height / 2 + 260, textSize(), "center");
	
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
		// Draw the team logo in the center of the canvas
		if (typeof myObject !== 'undefined' && myObject !== null) {
			logo = teamLogos[myObject.levelNumber - 1];
		} else {
			logo = teamLogos[currentLevel.levelNumber - 1];
		}
		
		////let logo = teamLogos[currentLevel.levelNumber - 1];
		image(logo, width / 2 - 150/ 2, height / 2 - 150 / 2, 150, 150);

		// Display and move the spaceship
		spaceship.show();
		spaceship.move();

		// Generate asteroids
        /*
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
            if (levelTransitionTimer === 30) {
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

			// Bullet goes offscreen
			if (bullets[i].offscreen()) {
				bullets.splice(i, 1);
				continue; // Skip to next iteration as current bullet is removed
			}

			// Bullet hits asteroid
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
			// Apply asteroid logic
			currentLevel.applyAsteroidLogic(asteroids[i]);

			// Display and move each asteroid
			asteroids[i].show();
			asteroids[i].move();

			// Asteroid goes offscreen
			if (asteroids[i].offscreen()) {
				asteroids.splice(i, 1);
				continue; // Skip to next iteration as current asteroid is removed
			}
			// Asteroid hits spaceship
			if (asteroids[i] !== undefined && asteroids[i].hits(spaceship) && !invincible) {
				spaceship.lives--;
				asteroids[i].hit = true;
				// If spaceship has no more lives, game over
				if (spaceship.lives <= 0) {
					cursor(); // Show the cursor again
					gameOver = true;
					button.show(); // Try again button
					tweetButton.show();  // Tweet button
					noLoop();
				// Otherwise, make the spaceship invincible for a short period of time
				} else {
					invincible = true;
					invincibleTimer = 90; // 1.5 second of invincibility
				}
			}
			if (asteroids[i] !== undefined && asteroids[i].alpha <= 0) {
				asteroids.splice(i, 1);
			}
		}

		//
		// Logic for moving to next level
		//

		if (score >= currentLevel.asteroidCount) {
			let nextLevelIndex = levels.indexOf(currentLevel) + 1;
			if (levels[nextLevelIndex]) {
				currentLevel = levels[nextLevelIndex];
				levelTransition = true;
				levelTransitionTimer = 180; // Transition will last for 3 seconds
		
				// Clear the asteroids array
				asteroids = [];
			} else {
				console.log("You win!");
				// Implement game completion logic here...
			}
		}
		

		//
		// Determine team v2:
		//
		
		// Determine current team by looking up current score in the list of NBA teams
		let team = score <= 30 ? nbaTeams[score - 1] : nbaTeams[nbaTeams.length - 1];
		//let team = level <= 30 ? nbaTeams[level - 1] : nbaTeams[nbaTeams.length - 1];
		
		// !!!

		// Draw lives
		fill(255);
		textSize(22);
		textAlign(RIGHT);
		textStyle(BOLD);
		//text("GRIND: ", width - 45, 20);
		drawLabel("GRIND: ", width - 70, 50, textSize(), "right");
		textStyle(NORMAL);

		textSize(24);
		textAlign(RIGHT);
		for (let i = 0; i < spaceship.lives; i++) {
			//text("❤️", width - 90 + i * 30, 50);
			drawLabel("❤️", width - 100 + i * 30 - 30, 20 + 60, textSize(), "right");
		}
		
		// Draw score label
		textSize(22);
		textAlign(LEFT);
		textStyle(BOLD);
		let scoreText;
		if (score == 1) {
			scoreText = score + " CRONIN KILLED";
		} else {
			scoreText = score + " CRONINS KILLED";
		}
		drawLabel(scoreText, 50, 50, textSize(), "left");
		textStyle(NORMAL);

		// Draw team label
		if (score > 0) {
			let team = nbaTeams[currentLevel.levelNumber - 1];
			textSize(18);
			drawLabel(team, 50, 70, textSize(), "left");
			textSize(22);
		}
		
		//
		// Level transition
		//

		// (text announcement)
		if (levelTransition) {
			textSize(60);
			textAlign(CENTER, CENTER);
			fill(255);
			//text("Level " + currentLevel.levelNumber, width / 2, height / 2);
			drawLabel("LEVEL " + currentLevel.levelNumber, width / 2, height / 2 - 150, textSize(), "center");
			textSize(40);
			let team = nbaTeams[currentLevel.levelNumber - 1];
			//text(team, width / 2, height / 2 + 50);
			drawLabel(team, width / 2, height / 2 - 100, textSize(), "center");
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


// Show fancy labels
function drawLabel(labelText, x, y, size, tAlign) {
    // Use the selected alignment option
    if (tAlign === "left") {
        textAlign(LEFT, CENTER);
    } else if (tAlign === "right") {
        textAlign(RIGHT, CENTER);
    } else if (tAlign === "center") {
        textAlign(CENTER, CENTER);
    } else {
        textAlign(CENTER, CENTER);
    }

    // Draw the text
    fill(255);  // white text
    if (tAlign === "center") {
        // Adjust x and y for centered text
        text(labelText, x, y);
    } else if (tAlign === "left") {
        text(labelText, x, y);
    } else if (tAlign === "right") {
        text(labelText, x, y);
    }
}
