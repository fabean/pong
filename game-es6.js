'use strict';
let c, // canvas
    cc, // canvascontext
    winScreen = false,
    ball = {
      'speedX': 10,
      'initSpeed': 10,
      'speedY': 4,
      'x': 50,
      'y': 50,
      'size': 10
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

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const WINNING_SCORE = 5;

window.onload = () => {

  c = document.getElementById('game');
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  
  // reset ball x&y to middle since we now have size of screen.
  ball.x =  c.width/2;
  ball.y =  c.height/2;
  
  cc = c.getContext('2d');

  let fps = 30;
  setInterval(() => {
    moveEverything();
    drawEverything();
  }, 1000/fps);

  c.addEventListener('mousemove',
    function(event) {
      let mousePos = calculateMousePos(event);
      player1.y = mousePos.y - (PADDLE_HEIGHT/2);
  });

  c.addEventListener('mousedown', handleMouseClick);
  
}

let handleMouseClick = (e) => {
  if (winScreen) {
    player1.score = 0;
    player2.score = 0;
    resetBall();
    winScreen = false;
  }
}

let calculateMousePos = (event) => {
  let rect = c.getBoundingClientRect();
  let root = document.documentElement;
  mouse.x = event.clientX - rect.left - root.scrollLeft;
  mouse.y = event.clientY - rect.top - root.scrollTop;

  return {
    x: mouse.x,
    y: mouse.y
  };
}

let ai = () => {
  let player2Center = player2.y + (PADDLE_HEIGHT/2);
    if (Math.sign(ball.speedX) === 1) {
      if (player2Center < ball.y - 35) {
      player2.y += 10;
    } else if (player2Center > ball.y + 35) {
      player2.y -= 10;
    }
  } else {
    if (player2Center < (c.height/2) -20) {
      player2.y += 6;
    } else if (player2Center > (c.height/2) +20 ) {
      player2.y -= 6;
    }
  }
  
}

let moveEverything = () => {
  // ai movement
  ai();

  // ball
  ball.x+=ball.speedX;
  ball.y+=ball.speedY;
  if (ball.x > c.width - PADDLE_WIDTH) {
    // hitting right side
    // added ball.size/2 which should make it so any part of the ball hits the paddle are it reflects back
    if (ball.y > player2.y - ball.size && ball.y < player2.y + PADDLE_HEIGHT + ball.size) {
      ball.speedX = -(ball.speedX*1.2);
      let deltaY = ball.y - (player2.y + PADDLE_HEIGHT / 2);
      ball.speedY = deltaY * .35;
    } else {
      player1.score++;
      resetBall();
    }
  } else if (ball.x <= 0 + PADDLE_WIDTH) {
    // hitting left side
    if (ball.y > player1.y - ball.size && ball.y < player1.y + PADDLE_HEIGHT + ball.size) {
      ball.speedX = -(ball.speedX*1.2);
      
      let deltaY = ball.y - (player1.y + PADDLE_HEIGHT / 2);
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
}

let drawEverything = () => {
  if (winScreen) {
    colorRect(0,0,c.width,c.height,'black');
    
    let message = '';
    if (player1.score === WINNING_SCORE) {
      message = 'Player 1 won!';
    } else {
      message = 'Player 2 won!';
    }
    cc.fillStyle = 'white';
    cc.font = "20px Helvetica";
    let messageTextWidth = cc.measureText(message);
    cc.fillText(message, (c.width/2 - messageTextWidth.width/2), 50);
    let continueTextWidth = cc.measureText('Click to continue');
    cc.fillText('Click to continue', (c.width/2 - continueTextWidth.width/2), 150);
    return;
  }

  // background
  colorRect(0,0,c.width,c.height,'black');

  // ball
  colorCircle(ball.x, ball.y, ball.size, 'white');
 
  // net
  drawNet();

  // left paddle
  colorRect(0,player1.y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

  // right paddle
  colorRect((c.width - PADDLE_WIDTH), player2.y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

  // score
  cc.font = "20px helvetica";
  cc.fillText(player1.score, 100, 50);
  cc.fillText(player2.score, c.width-100, 50);

}

let drawNet = () => {
  for (let i=0; i<c.height; i+=40) {
    colorRect(c.width/2-1, i, 2, 20, 'white');
  }
}

let colorRect = (leftX, topY, width, height, drawColor) => {
  cc.fillStyle = drawColor;
  cc.fillRect(leftX, topY, width, height);
};

let colorCircle = (centerX, centerY, radius, color) => { 
  cc.fillStyle = color;
  cc.beginPath();
  cc.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  cc.fill();
}

let resetBall = () => {

  if (player1.score >= WINNING_SCORE || player2.score >= WINNING_SCORE) {
    winScreen = true;
  } else {
  
  }

  //ball.speedX = -ball.speedX;
  if (Math.sign(ball.speedX) === 1) {
    ball.speedX = ball.initSpeed;
  } else {
    ball.speedX = -ball.initSpeed;
  }
  ball.speedY = 0;
  ball.x = c.width/2;
  ball.y = c.height/2;
}

