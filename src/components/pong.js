// import ReactDOM from 'react-dom'
import React, { useState, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import Paddle from './paddle';
import Ball from './ball';
import GUI from './gui';
import * as THREE from 'three';

function Pong(props) {
  const { viewport } = useThree();

  // GUI
  const [score, setScore] = useState({ left: 0, right: 0});
  const guiHeader = useRef();
  const guiScore = useRef();

  // Paddles
  const paddleLeft = useRef();
  const paddleRight = useRef();
  const paddleSize = {
    width: 1,
    height: 5,
    depth: 1
  }
  const hitAngleModifier = 2;

  // Ball
  const ball = useRef();
  const ballSize = {
    radius: 0.5,
    segments: 8,
  };
  const [isBallMovingRight, setIsBallMovingRight] = useState(true);
  const [isUserPlaying, setIsUserPlaying] = useState(true);

  useFrame(({ mouse }) => {
    const ballPosition = ball.current.getPosition();
    handleBallAndPaddleCollision(ballPosition);
    handleBallHitWall(ballPosition);
    checkIfScored(ballPosition);

    MoveAIPaddle(ballPosition);

    if (isUserPlaying) {
      const mousePosY = (mouse.y * viewport.height) / 2
      paddleRight.current.setYPosition(mousePosY);
    }
  })

  const handleBallAndPaddleCollision = (ballPosition) => {
    const paddleRightPosition = paddleRight.current.getPosition();
    const paddleLeftPosition = paddleLeft.current.getPosition();
    const ballHitbox = new THREE.Sphere(ballPosition, ballSize.radius);
    const paddleRightHitbox = getPaddleHitBox(paddleRightPosition);
    const paddleLeftHitbox = getPaddleHitBox(paddleLeftPosition);

    // Check for Ball & Paddle collision
    if (paddleRightHitbox.intersectsSphere(ballHitbox)) {
      const newAngle = getHitAngle(paddleRightPosition, ballPosition);
      ball.current.setBallAngle(newAngle);
      setIsBallMovingRight(false);
    } else if (paddleLeftHitbox.intersectsSphere(ballHitbox)) {
      const newAngle = getHitAngle(paddleLeftPosition, ballPosition);
      ball.current.setBallAngle(newAngle);
      setIsBallMovingRight(true);
    }
  }

  const handleBallHitWall = (ballPosition) => {
    // Check if Ball hit Ceiling/Floor and invert angle
    if (ballPosition.y + ballSize.radius >= viewport.height / 2) {
      ball.current.invertCurrentAngle();
    } else if (ballPosition.y - ballSize.radius <= -(viewport.height / 2)) {
      ball.current.invertCurrentAngle();
    }
  }

  const checkIfScored = (ballPosition) => {
    // Check if Ball is scored
    if (ballPosition.x + ballSize.radius >= viewport.width / 2) {
      setScore({
        ...score,
        left: score.left + 1
      });
      ball.current.setBallMoving(false);
      ball.current.setPosition(new THREE.Vector3(0, 0, 0));
      setTimeout(() => {
        newServe();
      }, 2000);
    } else if (ballPosition.x - ballSize.radius <= -(viewport.width / 2)) {
      setScore({
        ...score,
        right: score.right + 1
      });
      ball.current.setBallMoving(false);
      ball.current.setPosition(new THREE.Vector3(0, 0, 0));
      setTimeout(() => {
        newServe();
      }, 2000);
    }
  }

  const newServe = () => {
    ball.current.setBallAngle(0);
    setIsBallMovingRight(true);
    ball.current.setBallMoving(true);
  }

  const getHitAngle = (paddlePosition, ballPosition) => {
    let angle = ballPosition.angleTo(paddlePosition) / hitAngleModifier;
    if (paddlePosition.y > ballPosition.y) {
      angle = -Math.abs(angle);
    }

    return angle;
  }

  const getPaddleHitBox = (position) => {
    const minX = position.x - paddleSize.width / 2;
    const minY = position.y - paddleSize.height / 2;
    const minZ = position.z - paddleSize.depth / 2;
    const maxX = position.x + paddleSize.width / 2;
    const maxY = position.y + paddleSize.height / 2;
    const maxZ = position.z + paddleSize.depth / 2;

    const minVector3 = new THREE.Vector3(minX, minY, minZ);
    const maxVector3 = new THREE.Vector3(maxX, maxY, maxZ);

    return new THREE.Box3(minVector3, maxVector3);
  }

  const MoveAIPaddle = (ballPosition) => {
    paddleLeft.current.setYPosition(ballPosition.y);
  }

  return (
    <React.Fragment>
      <Paddle
        position={[-10, 0, 0]}
        ref={paddleLeft}
        size={paddleSize}
      />
      <Paddle
        position={[10, 0, 0]}
        ref={paddleRight}
        size={paddleSize}
        color="#ffffff"
      />
      <Ball
        position={[0, 0, 0]}
        ref={ball}
        isBallMovingRight={isBallMovingRight}
        size={ballSize}
      />
      <GUI
        position={[-0.1, (viewport.height / 2) - 0.8, 0]}
        ref={guiHeader}
        text={'Score'}
      />
      <GUI
        position={[0, (viewport.height / 2) - 1.8, 0]}
        ref={guiScore}
        text={score.left + "  |  " + score.right}
      />
    </React.Fragment>
  )
}

export default Pong;