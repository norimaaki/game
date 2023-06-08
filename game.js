// ゲームのロジックを記述する

// キャンバス要素を取得
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// プレイヤーの初期位置
let playerX = canvas.width / 2;
let playerY = canvas.height / 2;

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

// ゲームループ
function gameLoop() {
  // キャンバスをクリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤーを描画
  ctx.fillRect(playerX, playerY, 50, 50);

  // タッチの入力に応じてプレイヤーの位置を更新
  for (let touchId in touches) {
    let touch = touches[touchId];
    if (touch.x < playerX && playerX > 0) {
      playerX -= 5;
    }
    if (touch.x > playerX && playerX < canvas.width - 50) {
      playerX += 5;
    }
    if (touch.y < playerY && playerY > 0) {
      playerY -= 5;
    }
    if (touch.y > playerY && playerY < canvas.height - 50) {
      playerY += 5;
    }
  }

  // ループを継続するために再帰呼び出し
  requestAnimationFrame(gameLoop);
}

// ゲームループを開始
gameLoop();
