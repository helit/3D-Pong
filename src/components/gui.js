import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import RobotoFont from '../assets/roboto.json';
import * as THREE from 'three';

// load in font
const font = new THREE.FontLoader().parse(RobotoFont);

// configure font mesh
const textOptions = {
  font,
  size: 0.6,
  textAlign: 'center',
  height: 0,
};

function GUI(props, ref) {
  const mesh = useRef()

  useImperativeHandle(ref, () => ({
  }));

  return (
    <mesh
      {...props}
      ref={mesh}
    >
      <textGeometry attach="geometry" args={[props.text, textOptions]} />
    </mesh>
  )
}

export default forwardRef(GUI);