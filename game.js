'use strict';
var c = undefined,
    // canvas
cc = undefined,
    // canvascontext
winScreen = false,
    ball = {
  'speedX': 10,
  'speedY': 4,
  'x': 50,
  'y': 50
},
    player1 = {
  'y': 210,
  'score': 0
},
    player2 = {
  'y': 210,
  'score': 0
},
    mouse = {
  'x': 0,
  'y': 0
};

var PADDLE_HEIGHT = 100;
var PADDLE_WIDTH = 10;
var WINNING_SCORE = 3;

window.onload = function () {

  c = document.getElementById('game');
  c.width = window.innerWidth;
  c.height = window.innerHeight;

  cc = c.getContext('2d');

  var fps = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / fps);

  c.addEventListener('mousemove', function (event) {
    var mousePos = calculateMousePos(event);
    player1.y = mousePos.y - PADDLE_HEIGHT / 2;
  });

  c.addEventListener('mousedown', handleMouseClick);
};

var handleMouseClick = function handleMouseClick(e) {
  if (winScreen) {
    player1.score = 0;
    player2.score = 0;
    resetBall();
    winScreen = false;
  }
};

var calculateMousePos = function calculateMousePos(event) {
  var rect = c.getBoundingClientRect();
  var root = document.documentElement;
  mouse.x = event.clientX - rect.left - root.scrollLeft;
  mouse.y = event.clientY - rect.top - root.scrollTop;

  return {
    x: mouse.x,
    y: mouse.y
  };
};

var ai = function ai() {
  var player2Center = player2.y + PADDLE_HEIGHT / 2;
  if (player2Center < ball.y - 35) {
    player2.y += 6;
  } else if (player2Center > ball.y + 35) {
    player2.y -= 6;
  }
};

var moveEverything = function moveEverything() {
  // ai movement
  ai();

  // ball
  ball.x += ball.speedX;
  ball.y += ball.speedY;
  if (ball.x > c.width) {
    // hitting right side
    if (ball.y > player2.y && ball.y < player2.y + PADDLE_HEIGHT) {
      ball.speedX = -ball.speedX;
      var deltaY = ball.y - (player2.y + PADDLE_HEIGHT / 2);
      ball.speedY = deltaY * .35;
    } else {
      player1.score++;
      resetBall();
    }
  } else if (ball.x < 0) {
    // hitting left side
    if (ball.y > player1.y && ball.y < player1.y + PADDLE_HEIGHT) {
      ball.speedX = -ball.speedX;
      var deltaY = ball.y - (player1.y + PADDLE_HEIGHT / 2);
      ball.speedY = deltaY * .35;
    } else {
      player2.score++;
      resetBall();
    }
  }

  if (ball.y < 0) {
    ball.speedY = -ball.speedY;
  } else if (ball.y > c.height) {
    ball.speedY = -ball.speedY;
  }
};

var drawEverything = function drawEverything() {
  if (winScreen) {
    colorRect(0, 0, c.width, c.height, 'black');

    var message = '';
    if (player1.score === WINNING_SCORE) {
      message = 'Player 1 won!';
    } else {
      message = 'Player 2 won!';
    }
    ccc.fillStyle = 'white';
    cc.font = "20px Helvetica";

    var messageTextWidth = cc.measureText(message);
    cc.fillText(message, c.width / 2 - messageTextWidth.width / 2, 50);
    var continueTextWidth = cc.measureText('Click to continue');
    cc.fillText('Click to continue', c.width / 2 - continueTextWidth.width / 2, 150);c.fillStyle = 'white';

    return;
  }

  // background
  colorRect(0, 0, c.width, c.height, 'black');

  // ball
  colorCircle(ball.x, ball.y, 10, 'white');

  // net
  drawNet();

  // left paddle
  colorRect(0, player1.y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

  // right paddle
  colorRect(c.width - PADDLE_WIDTH, player2.y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

  // score
  cc.font = "20px helvetica";
  cc.fillText(player1.score, 100, 50);
  cc.fillText(player2.score, c.width - 100, 50);
};

var drawNet = function drawNet() {
  for (var i = 0; i < c.height; i += 40) {
    colorRect(c.width / 2 - 1, i, 2, 20, 'white');
  }
};

var colorRect = function colorRect(leftX, topY, width, height, drawColor) {
  cc.fillStyle = drawColor;
  cc.fillRect(leftX, topY, width, height);
};

var colorCircle = function colorCircle(centerX, centerY, radius, color) {
  cc.fillStyle = color;
  cc.beginPath();
  cc.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  cc.fill();
};

var resetBall = function resetBall() {

  if (player1.score >= WINNING_SCORE || player2.score >= WINNING_SCORE) {
    winScreen = true;
  } else {}

  ball.speedX = -ball.speedX;
  ball.speedY = 0;
  ball.x = c.width / 2;
  ball.y = c.height / 2;
};
//# sourceMappingURL=game.js.map
