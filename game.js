// ゲームのロジックを記述する

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const mario = {
  x: 50,
  y: 0,
  width: 50,
  height: 50,
  speed: 5,
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
  y: canvas.height - 50,
  width: 50,
  height: 50,
  speed: 3
};

const coin = {
  x: canvas.width / 2,
  y: canvas.height - 100,
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

function drawMario() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(mario.x, mario.y, mario.width, mario.height);
}

function drawPlatform() {
  ctx.fillStyle = 'green';
  ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
}

function drawEnemy() {
  ctx.fillStyle = 'red';
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

function drawCoin() {
  if (!coin.collected) {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
  }
}

function drawGoal() {
  ctx.fillStyle = 'orange';
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
}

function applyGravity() {
  if (mario.y + mario.height < canvas.height) {
    mario.velocityY += gravity;
    mario.y += mario.velocityY;
  } else {
    mario.velocityY = 0;
    mario.y = canvas.height - mario.height;
    mario.jumping = false;
  }
}

function handleJump() {
  if (!mario.jumping) {
    mario.velocityY = -12;
    mario.jumping = true;
  }
}

function handleKeyDown(event) {
  if (event.key === 'ArrowUp') {
    handleJump();
  }
}

function handleTouchStart() {
  handleJump();
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
    // 衝突時の処理（ゲームオーバーなど）
    console.log('ゲームオーバー');
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
    // ゴール到達時の処理（ゲームクリアなど）
    console.log('ゲームクリア！');
  }
}

function updateEnemy() {
  enemy.x -= enemy.speed;

  if (enemy.x + enemy.width < 0) {
    enemy.x = canvas.width;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMario();
  drawPlatform();
  drawEnemy();
  drawCoin();
  drawGoal();
  applyGravity();
  detectCollision();
  updateEnemy();

  window.requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', handleKeyDown);
canvas.addEventListener('touchstart', handleTouchStart);

gameLoop();
