import React, { useRef, useEffect } from 'react';

const Canvas = (
  props: JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLCanvasElement> &
    React.CanvasHTMLAttributes<HTMLCanvasElement>
) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Canvas Init
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Game Variables
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 1;
    let dy = -1;
    const ballRadius = 10;
    const paddleHeight = 20;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;
    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;
    let score = 0;

    type BrickCoords = {
      y: number;
      x: number;
      status: number;
    };

    const bricks: BrickCoords[][] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    function DrawCircle() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();
    }
    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(
        paddleX,
        canvas.height - paddleHeight,
        paddleWidth,
        paddleHeight
      );
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();
    }

    function drawBricks() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }

    function drawScore() {
      ctx.font = '16px Inter';
      ctx.fillStyle = '#0095DD';
      ctx.fillText(`Score: ${score}`, 8, 20);
    }

    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              x > b.x &&
              x < b.x + brickWidth &&
              y > b.y &&
              y < b.y + brickHeight
            ) {
              dy = -dy;
              b.status = 0;
              score++;
              if (score === brickRowCount * brickColumnCount) {
                const WinMessage = 'YOU WIN, CONGRATULATIONS!';
                alert(WinMessage);
                document.location.reload();
                clearInterval(interval); // Needed for Chrome to end game
              }
            }
          }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      DrawCircle();
      drawBricks();
      drawScore();
      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
        } else {
          const GameOverMessage = 'GAME OVER';
          alert(GameOverMessage);
          document.location.reload();
          clearInterval(interval);
        }
      }

      if (rightPressed) {
        paddleX += 2;
        if (paddleX + paddleWidth > canvas.width) {
          paddleX = canvas.width - paddleWidth;
        }
      } else if (leftPressed) {
        paddleX -= 2;
        if (paddleX < 0) {
          paddleX = 0;
        }
      }
      drawPaddle();
      collisionDetection();
      x += dx;
      y += dy;
    }
    function keyDownHandler(e) {
      if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true;
      } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true;
      }
    }

    function keyUpHandler(e) {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
      }
    }

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    const interval = setInterval(draw, 5);
  }, []);

  return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
