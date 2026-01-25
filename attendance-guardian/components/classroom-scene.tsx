"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Text, Sparkles } from "@react-three/drei";
import * as THREE from "three";

export type PanelType = "blackboard" | "desk" | "projector" | "door" | null;

interface ClassroomSceneProps {
  activePanel: PanelType;
  onPanelChange: (panel: PanelType) => void;
}

// Camera positions for different views
const CAMERA_POSITIONS: Record<
  Exclude<PanelType, null> | "default",
  { position: [number, number, number]; target: [number, number, number] }
> = {
  default: { position: [0, 2.2, 8.2], target: [0, 1.3, 0] },
  blackboard: { position: [0, 2.2, 4.3], target: [0, 2, -4.6] },
  desk: { position: [-2.4, 2.2, 3.4], target: [-3.6, 1.2, -0.2] },
  projector: { position: [2.4, 2.7, 3.4], target: [0, 3.2, -2.2] },
  door: { position: [4.4, 2.2, 4.6], target: [6.2, 1.6, 1.2] },
};

export function ClassroomScene({ activePanel, onPanelChange }: ClassroomSceneProps) {
  return (
    <div className="w-full h-screen fixed inset-0">
      <Canvas
        shadows
        camera={{ position: [0, 2.2, 8.2], fov: 55 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <ClassroomContent activePanel={activePanel} onPanelChange={onPanelChange} />
        </Suspense>
      </Canvas>
    </div>
  );
}

interface ClassroomContentProps {
  activePanel: PanelType;
  onPanelChange: (panel: PanelType) => void;
}

function ClassroomContent({ activePanel, onPanelChange }: ClassroomContentProps) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  // Smooth camera animation
  useFrame(() => {
    if (!controlsRef.current) return;

    const targetPos = activePanel ? CAMERA_POSITIONS[activePanel] : CAMERA_POSITIONS.default;

    camera.position.lerp(new THREE.Vector3(...targetPos.position), 0.03);
    controlsRef.current.target.lerp(new THREE.Vector3(...targetPos.target), 0.03);
    controlsRef.current.update();
  });

  return (
    <>
      {/* Bright classroom background */}
      <color attach="background" args={["#eaf2ff"]} />

      {/* CLASSROOM LIGHTING (warm + natural) */}
      <ambientLight intensity={0.85} />

      {/* Sunlight from windows (left side) */}
      <directionalLight
        position={[-10, 10, 3]}
        intensity={1.9}
        color={"#fff2d8"}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
      />

      {/* Fill light (front) */}
      <directionalLight position={[8, 8, 10]} intensity={0.8} color={"#e8f2ff"} />

      {/* Ceiling tube lights */}
      <pointLight position={[-4, 5.2, 0]} intensity={2.1} distance={30} color={"#ffffff"} />
      <pointLight position={[0, 5.2, 0]} intensity={2.1} distance={30} color={"#ffffff"} />
      <pointLight position={[4, 5.2, 0]} intensity={2.1} distance={30} color={"#ffffff"} />

      {/* Soft room bounce */}
      <hemisphereLight intensity={0.45} color={"#ffffff"} groundColor={"#d7c7b3"} />

      {/* Room structure */}
      <Room />

      {/* Interactive objects */}
      <Blackboard
        isActive={activePanel === "blackboard"}
        onClick={() => onPanelChange(activePanel === "blackboard" ? null : "blackboard")}
      />
      <TeacherDesk
        isActive={activePanel === "desk"}
        onClick={() => onPanelChange(activePanel === "desk" ? null : "desk")}
      />
      <ProjectorScreen
        isActive={activePanel === "projector"}
        onClick={() => onPanelChange(activePanel === "projector" ? null : "projector")}
      />
      <Door isActive={activePanel === "door"} onClick={() => onPanelChange(activePanel === "door" ? null : "door")} />

      {/* Student desks */}
      <StudentDesks />

      {/* Projector with light beam */}
      <Projector />

      {/* Dust particles in light beam */}
      <DustParticles />

      {/* Windows */}
      <Windows />

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  );
}

function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#d9d2c7" roughness={0.92} metalness={0.0} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]} receiveShadow>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#f8fbff" roughness={0.98} metalness={0.0} />
      </mesh>

      {/* Back wall (blackboard wall) */}
      <mesh position={[0, 3, -5]} receiveShadow>
        <planeGeometry args={[16, 6]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.97} metalness={0.0} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, 3, 7]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[16, 6]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.97} metalness={0.0} />
      </mesh>

      {/* Left wall (windows side) */}
      <mesh position={[-8, 3, 1]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial color="#f6f1e8" roughness={0.97} metalness={0.0} />
      </mesh>

      {/* Right wall */}
      <mesh position={[8, 3, 1]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial color="#f6f1e8" roughness={0.97} metalness={0.0} />
      </mesh>

      {/* Simple baseboard trim (subtle) */}
      <BaseTrim />
    </group>
  );
}

function BaseTrim() {
  return (
    <group>
      {/* back wall trim */}
      <mesh position={[0, 0.12, -4.95]}>
        <boxGeometry args={[16, 0.2, 0.08]} />
        <meshStandardMaterial color="#c9bba7" roughness={0.9} />
      </mesh>

      {/* left wall trim */}
      <mesh position={[-7.95, 0.12, 1]}>
        <boxGeometry args={[0.08, 0.2, 14]} />
        <meshStandardMaterial color="#c9bba7" roughness={0.9} />
      </mesh>

      {/* right wall trim */}
      <mesh position={[7.95, 0.12, 1]}>
        <boxGeometry args={[0.08, 0.2, 14]} />
        <meshStandardMaterial color="#c9bba7" roughness={0.9} />
      </mesh>
    </group>
  );
}

interface InteractiveObjectProps {
  isActive: boolean;
  onClick: () => void;
}

function Blackboard({ isActive, onClick }: InteractiveObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const glow = isActive ? 0.55 : hovered ? 0.35 : 0.18;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, glow, 0.1);
  });

  return (
    <group position={[0, 2.5, -4.8]}>
      {/* Board frame */}
      <mesh castShadow>
        <boxGeometry args={[6.2, 3.2, 0.15]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.2} roughness={0.65} />
      </mesh>

      {/* Board surface */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0.1]}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[6, 3, 0.05]} />
        <meshStandardMaterial color="#153a2e" emissive="#2cffc8" emissiveIntensity={0.18} roughness={0.55} />
      </mesh>

      {/* Board text */}
      <Text
        position={[0, 0.8, 0.2]}
        fontSize={0.25}
        color="#eafffb"
        font="/fonts/Geist-Bold.ttf"
        anchorX="center"
      >
        WEEKLY TIMETABLE
      </Text>
      <Text
        position={[0, 0.3, 0.2]}
        fontSize={0.12}
        color="#eafffb"
        font="/fonts/Geist-Regular.ttf"
        anchorX="center"
        fillOpacity={0.75}
      >
        Click to view schedule
      </Text>

      {/* Tooltip */}
      {hovered && !isActive && (
        <Html position={[0, 2, 0]} center>
          <div className="bg-card/90 backdrop-blur-sm border border-primary/50 rounded-lg px-3 py-2 whitespace-nowrap">
            <span className="text-primary text-sm font-medium">Blackboard → Timetable</span>
          </div>
        </Html>
      )}

      {/* Active glow frame */}
      {isActive && (
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[6.4, 3.4, 0.01]} />
          <meshBasicMaterial color="#2cffc8" transparent opacity={0.08} />
        </mesh>
      )}
    </group>
  );
}

function TeacherDesk({ isActive, onClick }: InteractiveObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const glow = isActive ? 0.35 : hovered ? 0.22 : 0.1;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, glow, 0.1);
  });

  return (
    <group position={[-4, 0, -2]}>
      {/* Desk top */}
      <mesh
        ref={meshRef}
        position={[0, 0.8, 0]}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#6b4a2b" emissive="#2cffc8" emissiveIntensity={0.1} metalness={0.05} roughness={0.85} />
      </mesh>

      {/* Desk legs */}
      {[[-0.8, 0.4, -0.4], [0.8, 0.4, -0.4], [-0.8, 0.4, 0.4], [0.8, 0.4, 0.4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color="#3b2a1b" metalness={0.05} roughness={0.9} />
        </mesh>
      ))}

      {/* Simple desk display */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.8, 0.5, 0.02]} />
        <meshStandardMaterial color="#0f2a2a" emissive="#2cffc8" emissiveIntensity={0.12} roughness={0.4} />
      </mesh>

      {/* Label */}
      <Text position={[0, 1.6, 0]} fontSize={0.12} color="#083b33" font="/fonts/Geist-Regular.ttf" anchorX="center">
        ATTENDANCE
      </Text>

      {/* Tooltip */}
      {hovered && !isActive && (
        <Html position={[0, 2, 0]} center>
          <div className="bg-card/90 backdrop-blur-sm border border-accent/50 rounded-lg px-3 py-2 whitespace-nowrap">
            <span className="text-accent text-sm font-medium">Desk → Attendance Input</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function ProjectorScreen({ isActive, onClick }: InteractiveObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const glow = isActive ? 0.45 : hovered ? 0.25 : 0.12;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, glow, 0.1);
  });

  return (
    <group position={[3, 3.5, -4]}>
      {/* Screen */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
      >
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial color="#f8fbff" emissive="#cfe9ff" emissiveIntensity={0.12} side={THREE.DoubleSide} />
      </mesh>

      {/* Text on screen */}
      <Text position={[0, 0.5, 0.05]} fontSize={0.15} color="#1a2a3a" font="/fonts/Geist-Bold.ttf" anchorX="center">
        WEEKLY PLAN
      </Text>
      <Text
        position={[0, 0.1, 0.05]}
        fontSize={0.1}
        color="#1a2a3a"
        font="/fonts/Geist-Regular.ttf"
        anchorX="center"
        fillOpacity={0.75}
      >
        Optimization Output
      </Text>

      {/* Tooltip */}
      {hovered && !isActive && (
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-card/90 backdrop-blur-sm border border-primary/50 rounded-lg px-3 py-2 whitespace-nowrap">
            <span className="text-primary text-sm font-medium">Projector → Weekly Plan</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function Door({ isActive, onClick }: InteractiveObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const glow = isActive ? 0.3 : hovered ? 0.18 : 0.06;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, glow, 0.1);
  });

  return (
    <group position={[7, 1.5, 2]}>
      {/* Door frame */}
      <mesh position={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 1.5]} />
        <meshStandardMaterial color="#d2c6b7" roughness={0.9} />
      </mesh>

      {/* Door */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[0.1, 2.8, 1.2]} />
        <meshStandardMaterial color="#7a4a2c" emissive="#ff6b6b" emissiveIntensity={0.06} metalness={0.05} roughness={0.85} />
      </mesh>

      {/* Small sign */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[0.05, 0.3, 0.6]} />
        <meshStandardMaterial color="#f1f1f1" roughness={0.8} />
      </mesh>
      <Text
        position={[-0.05, 1.8, 0]}
        fontSize={0.1}
        color="#222"
        font="/fonts/Geist-Bold.ttf"
        anchorX="center"
        rotation={[0, Math.PI / 2, 0]}
      >
        SETTINGS
      </Text>

      {/* Tooltip */}
      {hovered && !isActive && (
        <Html position={[0, 2.5, 0]} center>
          <div className="bg-card/90 backdrop-blur-sm border border-destructive/50 rounded-lg px-3 py-2 whitespace-nowrap">
            <span className="text-destructive text-sm font-medium">Door → Settings</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function StudentDesks() {
  const rows = 3;
  const cols = 4;
  const desks = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = (col - 1.5) * 2;
      const z = row * 2 + 1;
      desks.push(<StudentDesk key={`${row}-${col}`} position={[x, 0, z]} />);
    }
  }

  return <group>{desks}</group>;
}

function StudentDesk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Desk top */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.08, 0.7]} />
        <meshStandardMaterial color="#8a5a34" metalness={0.02} roughness={0.9} />
      </mesh>

      {/* Desk legs */}
      {[[-0.5, 0.35, -0.25], [0.5, 0.35, -0.25], [-0.5, 0.35, 0.25], [0.5, 0.35, 0.25]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.05, 0.7, 0.05]} />
          <meshStandardMaterial color="#3b2a1b" metalness={0.03} roughness={0.92} />
        </mesh>
      ))}

      {/* Chair seat */}
      <mesh position={[0, 0.4, 0.6]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshStandardMaterial color="#2f2f2f" metalness={0.05} roughness={0.85} />
      </mesh>

      {/* Chair back */}
      <mesh position={[0, 0.7, 0.8]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.05]} />
        <meshStandardMaterial color="#2f2f2f" metalness={0.05} roughness={0.85} />
      </mesh>
    </group>
  );
}

function Projector() {
  return (
    <group position={[0, 5.8, 0]}>
      {/* Projector body */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.3, 0.6]} />
        <meshStandardMaterial color="#3b3b3b" metalness={0.15} roughness={0.7} />
      </mesh>

      {/* Lens */}
      <mesh position={[0, -0.15, 0.35]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#d7f3ff" emissive="#d7f3ff" emissiveIntensity={0.25} />
      </mesh>

      {/* Light cone (soft white) */}
      <mesh position={[0, -2.5, -1]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[2.5, 5, 32, 1, true]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function DustParticles() {
  return (
    <Sparkles
      count={80}
      scale={[4, 5, 4]}
      position={[0, 2.5, -2]}
      size={1.2}
      speed={0.15}
      color="#ffffff"
      opacity={0.25}
    />
  );
}

function Windows() {
  return (
    <group position={[-7.9, 2.5, -1]}>
      {[0, 2.5, 5].map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          {/* Frame */}
          <mesh castShadow>
            <boxGeometry args={[0.1, 2, 1.5]} />
            <meshStandardMaterial color="#d6dbe3" roughness={0.85} metalness={0.0} />
          </mesh>

          {/* Glass */}
          <mesh position={[0.05, 0, 0]} castShadow>
            <planeGeometry args={[0.01, 1.8, 1.3]} />
            <meshStandardMaterial color="#bfe3ff" transparent opacity={0.22} roughness={0.2} metalness={0.0} />
          </mesh>

          {/* Sun glow */}
          <pointLight position={[0.8, 0.2, 0]} intensity={0.35} color="#fff2d8" distance={7} />
        </group>
      ))}
    </group>
  );
}
