const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const mario = {
  x: 50,
  y: canvas.height - 100,
  width: 50,
  height: 50,
  speed: 5,
  velocityX: 0,
  velocityY: 0,
  jumping: false
};

const gravity = 0.5;
const platform = {
  x: 0,
  y: canvas.height - 50,
  width: canvas.width,
  height: 50
};

const enemy = {
  x: canvas.width - 50,
  y: canvas.height - 100,
  width: 50,
  height: 50,
  speed: 3
};

const coin = {
  x: canvas.width / 2,
  y: canvas.height - 200,
  width: 25,
  height: 25,
  collected: false
};

const goal = {
  x: canvas.width - 100,
  y: 0,
  width: 100,
  height: 50
};

function drawEnemy() {
  ctx.fillStyle = 'red';
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

function updateEnemy() {
  enemy.x -= enemy.speed;

  if (enemy.x + enemy.width < 0) {
    enemy.x = canvas.width;
    enemy.y = canvas.height - 100;
  }
}

function detectCollision() {
  // プラットフォームとの衝突検出
  if (
    mario.x < platform.x + platform.width &&
    mario.x + mario.width > platform.x &&
    mario.y + mario.height > platform.y
  ) {
    mario.velocityY = 0;
    mario.y = platform.y - mario.height;
    mario.jumping = false;
  }

  // 敵キャラクターとの衝突検出
  if (
    mario.x < enemy.x + enemy.width &&
    mario.x + mario.width > enemy.x &&
    mario.y < enemy.y + enemy.height &&
    mario.y + mario.height > enemy.y
  ) {
    console.log('ゲームオーバー');
    resetGame();
  }

  // コインの収集判定
  if (
    mario.x < coin.x + coin.width &&
    mario.x + mario.width > coin.x &&
    mario.y < coin.y + coin.height &&
    mario.y + mario.height > coin.y
  ) {
    if (!coin.collected) {
      coin.collected = true;
      console.log('コインを収集しました');
    }
  }

  // ゴールとの衝突検出
  if (
    mario.x < goal.x + goal.width &&
    mario.x + mario.width > goal.x &&
    mario.y < goal.y + goal.height &&
    mario.y + mario.height > goal.y
  ) {
    console.log('ゲームクリア！');
    resetGame();
  }
}

function resetGame() {
  mario.x = 50;
  mario.y = canvas.height - 100;
  mario.velocityX = 0;
  mario.velocityY = 0;
  mario.jumping = false;
  coin.collected = false;
  enemy.x = canvas.width - 50;
  enemy.y = canvas.height - 100;
}

function updateMarioPosition() {
  mario.x += mario.velocityX;
  mario.y += mario.velocityY;

  if (mario.x < 0) {
    mario.x = 0;
  } else if (mario.x + mario.width > canvas.width) {
    mario.x = canvas.width - mario.width;
  }

  if (mario.y + mario.height > canvas.height) {
    mario.y = canvas.height - mario.height;
    mario.velocityY = 0;
    mario.jumping = false;
  }
}

function applyGravity() {
  if (mario.jumping) {
    mario.velocityY += gravity;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw platform
  ctx.fillStyle = 'gray';
  ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

  // Draw enemy
  drawEnemy();

  // Draw coin
  if (!coin.collected) {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
  }

  // Draw goal
  ctx.fillStyle = 'green';
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

  // Draw Mario
  ctx.fillStyle = 'blue';
  ctx.fillRect(mario.x, mario.y, mario.width, mario.height);

  // Update Mario's position
  updateMarioPosition();

  // Apply gravity
  applyGravity();

  // Detect collisions
  detectCollision();

  requestAnimationFrame(draw);
}

function handleKeyDown(event) {
  if (event.key === 'ArrowUp' || event.key === ' ') {
    handleJump();
  }
  if (event.key === 'ArrowLeft') {
    mario.velocityX = -mario.speed;
  }
  if (event.key === 'ArrowRight') {
    mario.velocityX = mario.speed;
  }
}

function handleKeyUp(event) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    mario.velocityX = 0;
  }
}

function handleTouchStart(event) {
  if (event.targetTouches.length === 1) {
    event.preventDefault();
    const touch = event.targetTouches[0];
    const touchX = touch.pageX - canvas.offsetLeft;
    const touchY = touch.pageY - canvas.offsetTop;

    if (touchY >= mario.y) {
      handleJump();
    } else if (touchX < canvas.width / 2) {
      mario.velocityX = -mario.speed;
    } else {
      mario.velocityX = mario.speed;
    }
  }
}

function handleTouchEnd(event) {
  if (event.changedTouches.length === 1) {
    event.preventDefault();
    const touch = event.changedTouches[0];
    const touchX = touch.pageX - canvas.offsetLeft;
    const touchY = touch.pageY - canvas.offsetTop;

    if (touchY < mario.y && (touchX < canvas.width / 2 || touchX >= canvas.width / 2)) {
      mario.velocityX = 0;
    }
  }
}

function handleJump() {
  if (!mario.jumping) {
    mario.velocityY -= 15;
    mario.jumping = true;
  }
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);

draw();
