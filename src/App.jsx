import { ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";

function App() {
  return (
    <>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <color attach="background" args={["#ececec"]} />
        <ScrollControls pages={40} damping={0.5}>
          <Experience />
        </ScrollControls>
      </Canvas>
    </>
  );
}

export default App;
