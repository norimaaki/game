// ゲームのロジックを記述する

// キャンバス要素を取得
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// プレイヤーの初期位置
let playerX = canvas.width / 2;
let playerY = canvas.height - 50;
const playerSize = 50;

// スタートとゴールの位置
const startX = 50;
const startY = canvas.height - 100;
const goalX = canvas.width - 100;
const goalY = 50;
const goalSize = 50;

// 障害物の初期位置
let obstacleX = 200;
let obstacleY = 100;
const obstacleSize = 50;

// タッチの状態を格納するオブジェクト
const touches = {};

// タッチイベントのリスナーを設定
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);
canvas.addEventListener('touchcancel', handleTouchEnd);
canvas.addEventListener('touchmove', handleTouchMove);

// タッチが開始されたときの処理
function handleTouchStart(event) {
  event.preventDefault();
  for (let touch of event.changedTouches) {
    touches[touch.identifier] = { x: touch.clientX, y: touch.clientY };
  }
}

// タッチが終了したときの処理
function handleTouchEnd(event) {
  event.preventDefault();
  for (let touch of event.changedTouches) {
    delete touches[touch.identifier];
  }
}

// タッチがキャンセルされたときの処理
function handleTouchCancel(event) {
  event.preventDefault();
  touches = {};
}

// タッチが移動したときの処理
function handleTouchMove(event) {
  event.preventDefault();
  for (let touch of event.changedTouches) {
    touches[touch.identifier] = { x: touch.clientX, y: touch.clientY };
  }
}

// 衝突判定
function checkCollision() {
  if (
    playerX < obstacleX + obstacleSize &&
    playerX + playerSize > obstacleX &&
    playerY < obstacleY + obstacleSize &&
    playerY + playerSize > obstacleY
  ) {
    return true; // 衝突した
  }
  return false; // 衝突していない
}

// ゲームクリア判定
function checkGameClear() {
  if (
    playerX < goalX + goalSize &&
    playerX + playerSize > goalX &&
    playerY < goalY + goalSize &&
    playerY + playerSize > goalY
  ) {
    return true; // ゲームクリア
  }
  return false; // ゲームクリアしていない
}

// ゲームループ
function gameLoop() {
  // キャンバスをクリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤーを描画
  ctx.fillRect(playerX, playerY, playerSize, playerSize);

  // スタートを描画
  ctx.fillStyle = 'green';
  ctx.fillRect(startX, startY, playerSize, playerSize);

  // ゴールを描画
  ctx.fillStyle = 'red';
  ctx.fillRect(goalX, goalY, goalSize, goalSize);

  // 障害物を描画
  ctx.fillStyle = 'gray';
  ctx.fillRect(obstacleX, obstacleY, obstacleSize, obstacleSize);

  // タッチの入力に応じてプレイヤーの位置を更新
  for (let touchId in touches) {
    let touch = touches[touchId];
    if (touch.x < playerX && playerX > 0) {
      playerX -= 5;
    }
    if (touch.x > playerX && playerX < canvas.width - playerSize) {
      playerX += 5;
    }
    if (touch.y < playerY && playerY > 0) {
      playerY -= 5;
    }
    if (touch.y > playerY && playerY < canvas.height - playerSize) {
      playerY += 5;
    }
  }

  // 衝突判定
  if (checkCollision()) {
    // ゲームオーバー処理
    alert('ゲームオーバー');
    resetGame();
  } else if (checkGameClear()) {
    // ゲームクリア処理
    alert('ゲームクリア！');
    resetGame();
  } else {
    // ループを継続するために再帰呼び出し
    requestAnimationFrame(gameLoop);
  }
}

// ゲームをリセット
function resetGame() {
  playerX = startX;
  playerY = startY;
}

// ゲームループを開始
gameLoop();
