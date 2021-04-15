import { Canvas } from 'react-three-fiber'
import Pong from './components/pong';
import './App.css';

function App() {
  return (
    <div className="App">
      <div style={{
        'width': '100%',
        'height': '100vh',
        'background': '#242424'
      }}>
        <Canvas
          //orthographic
          camera={{
            fov: 75,
            position: [0, 0, 10],
            //zoom: 35
          }}
        >
          <ambientLight color={0x404040} intensity={0} />
          <pointLight position={[10, 10, 10]} />
          <Pong />
        </Canvas>
      </div>
    </div >
  );
}

export default App;
