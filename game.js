class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Game state
        this.level = 1;
        this.lives = 3;
        this.score = 0;
        this.gameOver = false;
        this.levelComplete = false;
        
        // Game physics
        this.gravity = 0.5;
        this.jumpHeight = -15;
        this.jumpDistance = 75;
        this.blockSpeed = 2;
        this.blockSpawnInterval = 2000;
        this.lastBlockSpawn = 0;
        
        // Audio
        this.bgMusic = document.getElementById('bgMusic');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.5;
        
        // Try to play music when user interacts
        document.addEventListener('click', () => {
            this.bgMusic.play().catch(error => {
                console.log("Audio play failed:", error);
            });
        }, { once: true });
        
        // UI elements
        this.livesDisplay = document.getElementById('lives');
        this.levelDisplay = document.getElementById('level');
        this.gameOverScreen = document.getElementById('gameOver');
        this.levelCompleteScreen = document.getElementById('levelComplete');
        this.restartButton = document.getElementById('restartButton');
        this.nextLevelButton = document.getElementById('nextLevelButton');
        
        // Initialize game elements
        this.player = {
            x: 50,
            y: this.canvas.height - 50,
            width: 30,
            height: 30,
            velocityY: 0,
            velocityX: 0,
            isJumping: false,
            jumpsLeft: 3,
            lives: 3
        };
        
        this.platforms = [];
        this.stars = [];
        this.createLevel1();
        
        // Event listeners
        this.restartButton.addEventListener('click', () => this.restart());
        this.nextLevelButton.addEventListener('click', () => this.nextLevel());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.canvas.addEventListener('click', (e) => {
            if (!this.gameOver && !this.levelComplete && !this.player.isJumping) {
                this.jump();
            }
        });
        
        // Start game loop
        this.gameLoop();
    }

    handleKeyPress(e) {
        if (e.code === 'Space' && !this.player.isJumping && !this.gameOver && !this.levelComplete) {
            this.jump();
        }
    }

    createLevel1() {
        // Clear existing platforms and stars
        this.platforms = [];
        this.stars = [];
        
        // Create ground
        this.platforms.push({
            x: 0,
            y: this.canvas.height - 50,
            width: this.canvas.width,
            height: 50,
            isGround: true,
            speed: 0
        });
        
        // Create initial blocks
        const blockPositions = [
            { x: 200, y: this.canvas.height - 150 },
            { x: 400, y: this.canvas.height - 200 },
            { x: 600, y: this.canvas.height - 250 }
        ];
        
        blockPositions.forEach(pos => {
            this.platforms.push({
                x: pos.x,
                y: pos.y,
                width: 50,
                height: 10,
                speed: this.blockSpeed
            });
        });
        
        // Add star
        this.stars.push({
            x: 700,
            y: this.canvas.height - 300,
            width: 20,
            height: 20
        });
    }

    createLevel2() {
        // Clear existing platforms and stars
        this.platforms = [];
        this.stars = [];
        
        // Create ground
        this.platforms.push({
            x: 0,
            y: this.canvas.height - 50,
            width: this.canvas.width,
            height: 50,
            isGround: true,
            speed: 0
        });
        
        // Create more challenging block layout
        const blockPositions = [
            { x: 150, y: this.canvas.height - 150 },
            { x: 300, y: this.canvas.height - 200 },
            { x: 450, y: this.canvas.height - 250 },
            { x: 600, y: this.canvas.height - 200 }
        ];
        
        blockPositions.forEach(pos => {
            this.platforms.push({
                x: pos.x,
                y: pos.y,
                width: 50,
                height: 10,
                speed: this.blockSpeed
            });
        });
        
        // Add star
        this.stars.push({
            x: 700,
            y: this.canvas.height - 300,
            width: 20,
            height: 20
        });
    }

    createLevel3() {
        // Clear existing platforms and stars
        this.platforms = [];
        this.stars = [];
        
        // Create ground
        this.platforms.push({
            x: 0,
            y: this.canvas.height - 50,
            width: this.canvas.width,
            height: 50,
            isGround: true,
            speed: 0
        });
        
        // Create most challenging block layout
        const blockPositions = [
            { x: 100, y: this.canvas.height - 150 },
            { x: 250, y: this.canvas.height - 200 },
            { x: 400, y: this.canvas.height - 250 },
            { x: 550, y: this.canvas.height - 200 },
            { x: 700, y: this.canvas.height - 150 }
        ];
        
        blockPositions.forEach(pos => {
            this.platforms.push({
                x: pos.x,
                y: pos.y,
                width: 50,
                height: 10,
                speed: this.blockSpeed
            });
        });
        
        // Add star
        this.stars.push({
            x: 700,
            y: this.canvas.height - 300,
            width: 20,
            height: 20
        });
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => {
            if (this.gameOver || this.levelComplete || this.player.isJumping) return;
            this.jump();
        });

        document.getElementById('restartButton').addEventListener('click', () => {
            this.resetGame();
        });
    }

    jump() {
        if (this.player.lives <= 0 || this.player.isJumping) return;
        
        this.player.isJumping = true;
        this.player.velocityY = this.jumpHeight;
        this.player.velocityX = this.jumpDistance / 30;
    }

    spawnNewBlock() {
        const currentTime = Date.now();
        if (currentTime - this.lastBlockSpawn > this.blockSpawnInterval) {
            const groundY = this.canvas.height - 100;
            const starY = this.stars[0].y;
            
            // Calculate the total height range for blocks
            const minBlockY = starY + 50;
            const maxBlockY = groundY - 20;
            
            // Create blocks at more varied heights
            const heights = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
            const randomHeight = heights[Math.floor(Math.random() * heights.length)];
            
            const block = {
                x: this.canvas.width,
                y: maxBlockY - (maxBlockY - minBlockY) * randomHeight,
                width: 50,
                height: 10,
                speed: this.blockSpeed
            };
            this.platforms.push(block);
            this.lastBlockSpawn = currentTime;
        }
    }

    updateBlocks() {
        this.spawnNewBlock();

        for (let i = this.platforms.length - 1; i >= 0; i--) {
            const block = this.platforms[i];
            block.x -= block.speed;

            if (block.x + block.width < 0) {
                this.platforms.splice(i, 1);
            }
        }
    }

    initializeGame() {
        this.platforms = [];
        this.stars = [];
        
        // Create ground block
        this.platforms.push({
            x: 0,
            y: this.canvas.height - 50,
            width: this.canvas.width,
            height: 50,
            isGround: true,
            speed: 0
        });

        // Create initial blocks and star
        this.createGameElements();
    }

    createGameElements() {
        const maxJumpHeight = Math.abs(this.player.jumpHeight) * 2;
        const groundY = this.canvas.height - 100;
        const screenHeight = this.canvas.height;
        const starY = screenHeight * 0.3;
        
        // Calculate the total height range for blocks
        const minBlockY = starY + 50;
        const maxBlockY = groundY - 20;
        
        // Create blocks at various heights
        this.platforms.push(
            // First set of blocks - lower heights
            {
                x: 150,
                y: maxBlockY - (maxBlockY - minBlockY) * 0.2,
                width: 50,
                height: 10,
                speed: this.blockSpeed
            },
            {
                x: 250,
                y: maxBlockY - (maxBlockY - minBlockY) * 0.3,
                width: 50,
                height: 10,
                speed: this.blockSpeed
            },
            // Second set - middle heights
            {
                x: 350,
                y: maxBlockY - (maxBlockY - minBlockY) * 0.4,
                width: 50,
                height: 10,
                speed: this.blockSpeed
            },
            {
                x: 450,
                y: maxBlockY - (maxBlockY - minBlockY) * 0.5,
                width: 50,
                height: 10,
                speed: this.blockSpeed
            },
            // Third set - higher heights
            {
                x: 550,
                y: maxBlockY - (maxBlockY - minBlockY) * 0.6,
                width: 50,
                height: 10,
                speed: this.blockSpeed
            },
            {
                x: 650,
                y: maxBlockY - (maxBlockY - minBlockY) * 0.7,
                width: 50,
                height: 10,
                speed: this.blockSpeed
            }
        );

        // Add star
        this.stars.push({
            x: 700,
            y: starY,
            width: 20,
            height: 20
        });

        this.totalStars = this.stars.length;
    }

    updatePlayer() {
        if (this.player.isJumping) {
            this.player.velocityY += this.gravity;
            this.player.y += this.player.velocityY;
            this.player.x += this.player.velocityX;

            // Check for collisions with blocks
            for (const block of this.platforms) {
                if (this.checkCollision(this.player, block)) {
                    if (this.player.velocityY > 0) {
                        this.player.isJumping = false;
                        this.player.velocityY = 0;
                        this.player.velocityX = 0;
                        this.player.y = block.y - this.player.height;
                    }
                }
            }

            // Check for collisions with stars
            this.checkStarCollision();

            // Check if player fell off the screen
            if (this.player.y > this.canvas.height || this.player.x < 0 || this.player.x > this.canvas.width) {
                this.lives--;
                this.livesDisplay.textContent = `Lives: ${this.lives}`;
                if (this.lives <= 0) {
                    this.endGame();
                } else {
                    this.resetPlayerPosition();
                }
            }
        }
    }

    resetPlayerPosition() {
        this.player.x = 50;
        this.player.y = this.canvas.height - 100;
        this.player.isJumping = false;
        this.player.velocityY = 0;
        this.player.velocityX = 0;
    }

    checkCollision(player, object) {
        return player.x < object.x + object.width &&
               player.x + player.width > object.x &&
               player.y < object.y + object.height &&
               player.y + player.height > object.y;
    }

    endGame(isWin = false) {
        this.gameOver = true;
        document.getElementById('gameOver').classList.remove('hidden');
        document.getElementById('finalScore').textContent = this.score;
        if (isWin) {
            document.querySelector('#gameOver h2').textContent = 'You Win!';
        }
    }

    resetGame() {
        this.player = {
            x: 50,
            y: this.canvas.height - 100,
            width: 30,
            height: 30,
            velocityY: 0,
            velocityX: 0,
            isJumping: false,
            jumpsLeft: 3,
            lives: 3
        };
        this.score = 0;
        this.gameOver = false;
        this.levelComplete = false;
        this.blockSpeed = 2;
        this.blockSpawnInterval = 2000;
        
        document.getElementById('lives').textContent = `Lives: ${this.lives}`;
        document.getElementById('gameOver').classList.add('hidden');
        document.querySelector('#gameOver h2').textContent = 'Game Over!';
        
        this.initializeGame();
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw blocks
        this.ctx.fillStyle = '#0ff';
        this.platforms.forEach(block => {
            this.ctx.fillRect(block.x, block.y, block.width, block.height);
        });

        // Draw stars
        this.ctx.fillStyle = '#ff0';
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.moveTo(star.x + star.width/2, star.y);
            for (let i = 0; i < 5; i++) {
                this.ctx.lineTo(
                    star.x + star.width/2 + Math.cos((18 + i * 72) * Math.PI / 180) * star.width/2,
                    star.y + star.height/2 + Math.sin((18 + i * 72) * Math.PI / 180) * star.height/2
                );
                this.ctx.lineTo(
                    star.x + star.width/2 + Math.cos((54 + i * 72) * Math.PI / 180) * star.width/4,
                    star.y + star.height/2 + Math.sin((54 + i * 72) * Math.PI / 180) * star.height/4
                );
            }
            this.ctx.closePath();
            this.ctx.fill();
        });

        // Draw pixel art character
        const x = this.player.x;
        const y = this.player.y;
        const size = 4; // Size of each pixel

        // Body (light blue)
        this.ctx.fillStyle = '#7cc6fe';
        this.ctx.fillRect(x + size * 2, y + size * 4, size * 6, size * 4);
        
        // Big head (skin tone)
        this.ctx.fillStyle = '#ffdbac';
        this.ctx.fillRect(x + size * 1, y, size * 8, size * 4);
        
        // Sunglasses
        this.ctx.fillStyle = '#000';
        // Left lens
        this.ctx.fillRect(x + size * 2, y + size * 1, size * 2, size * 1);
        // Right lens
        this.ctx.fillRect(x + size * 5, y + size * 1, size * 2, size * 1);
        // Bridge
        this.ctx.fillRect(x + size * 4, y + size * 1, size * 1, size * 1);
        
        // Cute rosy cheeks
        this.ctx.fillStyle = '#ffb6c1';
        this.ctx.fillRect(x + size * 1, y + size * 2, size * 1, size * 1);
        this.ctx.fillRect(x + size * 7, y + size * 2, size * 1, size * 1);
        
        // Smile
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(x + size * 3, y + size * 3, size * 1, size * 1);
        this.ctx.fillRect(x + size * 5, y + size * 3, size * 1, size * 1);
        
        // Arms (light blue)
        this.ctx.fillStyle = '#7cc6fe';
        // Left arm
        this.ctx.fillRect(x, y + size * 4, size * 2, size * 2);
        // Right arm
        this.ctx.fillRect(x + size * 8, y + size * 4, size * 2, size * 2);
        
        // Legs (light blue)
        // Left leg
        this.ctx.fillRect(x + size * 3, y + size * 8, size * 2, size * 2);
        // Right leg
        this.ctx.fillRect(x + size * 5, y + size * 8, size * 2, size * 2);
        
        // Cute details
        // Belly button
        this.ctx.fillStyle = '#ffb6c1';
        this.ctx.fillRect(x + size * 5, y + size * 6, size * 1, size * 1);
    }

    gameLoop() {
        if (!this.gameOver) {
            this.updateBlocks();
            this.updatePlayer();
        }
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    checkStarCollision() {
        for (let i = this.stars.length - 1; i >= 0; i--) {
            const star = this.stars[i];
            if (this.checkCollision(this.player, star)) {
                this.stars.splice(i, 1);
                this.score += 100;
                this.levelComplete = true;
                this.levelCompleteScreen.classList.remove('hidden');
                // Pause the game loop when level is complete
                this.gameOver = true;
                return;
            }
        }
    }
    
    nextLevel() {
        this.level++;
        this.levelDisplay.textContent = `Level: ${this.level}`;
        this.levelComplete = false;
        this.levelCompleteScreen.classList.add('hidden');
        
        // Reset player position and state
        this.player = {
            x: 50,
            y: this.canvas.height - 50,
            width: 30,
            height: 30,
            velocityY: 0,
            velocityX: 0,
            isJumping: false,
            jumpsLeft: 3,
            lives: this.lives
        };
        
        // Clear existing platforms and stars
        this.platforms = [];
        this.stars = [];
        
        // Create new level
        if (this.level === 2) {
            this.createLevel2();
        } else if (this.level === 3) {
            this.createLevel3();
        } else {
            this.createLevel1();
        }
        
        // Ensure game is in running state
        this.gameOver = false;
        this.gameOverScreen.classList.add('hidden');
    }
    
    restart() {
        this.level = 1;
        this.lives = 3;
        this.score = 0;
        this.gameOver = false;
        this.levelComplete = false;
        this.gameOverScreen.classList.add('hidden');
        this.levelCompleteScreen.classList.add('hidden');
        
        // Reset player
        this.player = {
            x: 50,
            y: this.canvas.height - 50,
            width: 30,
            height: 30,
            velocityY: 0,
            velocityX: 0,
            isJumping: false,
            jumpsLeft: 3,
            lives: this.lives
        };
        
        // Clear and recreate level
        this.platforms = [];
        this.stars = [];
        this.createLevel1();
        
        // Update UI
        this.livesDisplay.textContent = `Lives: ${this.lives}`;
        this.levelDisplay.textContent = `Level: ${this.level}`;
        
        // Restart music
        this.bgMusic.currentTime = 0;
        this.bgMusic.play().catch(error => {
            console.log("Audio play failed:", error);
        });
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 