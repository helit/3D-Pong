import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from 'react-three-fiber';

function Ball(props, ref) {
  const mesh = useRef();
  const ballSpeed = 0.3;
  const [currentBallAngle, setCurrentBallAngle] = useState(0);
  const [isBallMoving, setIsBallMoving] = useState(true);

  useImperativeHandle(ref, () => ({
    getPosition() {
      return mesh.current.position;
    },
    setPosition(position) {
      mesh.current.position.x = position.x;
      mesh.current.position.y = position.y;
      mesh.current.position.z = position.z;
    },
    setBallAngle(angle) {
      setCurrentBallAngle(angle);
    },
    setBallMoving(isMoving) {
      setIsBallMoving(isMoving);
    },
    invertCurrentAngle() {
      if (currentBallAngle > 0) {
        setCurrentBallAngle(-Math.abs(currentBallAngle));
      } else {
        setCurrentBallAngle(Math.abs(currentBallAngle));
      }
    }
  }));

  useFrame(() => {
    animateBall();
  })

  const animateBall = () => {
    if (!isBallMoving) {
      return;
    }

    if (props.isBallMovingRight) {
      mesh.current.position.x += ballSpeed;
    } else {
      mesh.current.position.x -= ballSpeed;
    }

    mesh.current.position.y += currentBallAngle;
  }

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={[1, 1, 1]}>
      <sphereBufferGeometry args={[
        props.size.radius,
        props.size.segments,
        props.size.segments
      ]} />
      <meshToonMaterial color={'#FFDB5C'} />
    </mesh>
  )
}

export default forwardRef(Ball);