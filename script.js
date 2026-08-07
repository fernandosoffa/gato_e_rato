const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const gameOverModal = document.getElementById("game-over-modal");

let playerX = 200, playerY = 200;
let enemyX = 50, enemyY = 50;
let playerSpeed = 5;
let enemySpeed = 1.5; // Velocidade equilibrada para o gato perseguir sem bugar
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

let isGameOver = false;
const containerSize = 500;
const charSize = 50;
const maxCoord = containerSize - charSize; // 450px (limite exato para não sumir)

// Captura as teclas pressionadas
document.addEventListener("keydown", (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
        e.preventDefault(); 
    }
});

document.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

// Movimenta o jogador suavemente dentro dos limites
function movePlayer() {
    if (keys.ArrowUp && playerY > 0) playerY -= playerSpeed;
    if (keys.ArrowDown && playerY < maxCoord) playerY += playerSpeed; 
    if (keys.ArrowLeft && playerX > 0) playerX -= playerSpeed;
    if (keys.ArrowRight && playerX < maxCoord) playerX += playerSpeed; 

    player.style.transform = `translate3d(${playerX}px, ${playerY}px, 0)`;
}

// Movimenta o inimigo com perseguição real e segura
function moveEnemy() {
    // Perseguição no eixo X
    if (enemyX < playerX) {
        enemyX += Math.min(enemySpeed, playerX - enemyX);
    } else if (enemyX > playerX) {
        enemyX -= Math.min(enemySpeed, enemyX - playerX);
    }

    // Perseguição no eixo Y
    if (enemyY < playerY) {
        enemyY += Math.min(enemySpeed, playerY - enemyY);
    } else if (enemyY > playerY) {
        enemyY -= Math.min(enemySpeed, enemyY - playerY);
    }

    // Garante que o gato nunca ultrapasse os limites da tela
    enemyX = Math.max(0, Math.min(enemyX, maxCoord));
    enemyY = Math.max(0, Math.min(enemyY, maxCoord));

    enemy.style.transform = `translate3d(${enemyX}px, ${enemyY}px, 0)`;
}

// Checa colisão
function checkCollision() {
    const distance = Math.hypot(playerX - enemyX, playerY - enemyY);
    if (distance < 35 && !isGameOver) {
        triggerGameOver();
    }
}

// Ativa o Game Over
function triggerGameOver() {
    isGameOver = true;
    gameOverModal.classList.remove("hidden");
}

// Reinicia o jogo garantindo posições válidas e separadas
function restartGameModal() {
    // Gera posições aleatórias seguras dentro da área útil
    playerX = Math.floor(Math.random() * 350) + 50;
    playerY = Math.floor(Math.random() * 350) + 50;
    
    // Posiciona o gato longe o suficiente para não morrer instantaneamente
    do {
        enemyX = Math.floor(Math.random() * maxCoord);
        enemyY = Math.floor(Math.random() * maxCoord);
    } while (Math.hypot(playerX - enemyX, playerY - enemyY) < 150);

    isGameOver = false;
    gameOverModal.classList.add("hidden");
}

// Loop principal do jogo
function updateGame() {
    if (!isGameOver) {
        movePlayer();
        moveEnemy();
        checkCollision();
    }
    requestAnimationFrame(updateGame);
}

// Inicializa o jogo
restartGameModal();
updateGame();