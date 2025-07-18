import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface GlobeProps {
  zenithLine: Array<{ lat: number; lng: number }>;
  subsolarPoint: { lat: number; lng: number };
  date: Date;
}

// Convert latitude/longitude to 3D coordinates
function latLngToVector3(lat: number, lng: number, radius: number = 1): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

function EarthGlobe({ zenithLine, subsolarPoint }: GlobeProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  
  // Convert zenith line to 3D coordinates
  const zenithLinePoints = useMemo(() => {
    return zenithLine.map(point => latLngToVector3(point.lat, point.lng, 1.01));
  }, [zenithLine]);
  
  // Convert subsolar point to 3D coordinates
  const subsolarPointPosition = useMemo(() => {
    return latLngToVector3(subsolarPoint.lat, subsolarPoint.lng, 1.05);
  }, [subsolarPoint]);
  
  // Rotate the Earth
  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });
  
  return (
    <group>
      {/* Earth Sphere */}
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#4a90e2"
          transparent
          opacity={0.8}
        />
      </Sphere>
      
      {/* Wireframe to show continents outline */}
      <Sphere args={[1.001, 32, 32]}>
        <meshBasicMaterial
          color="#2d5aa0"
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>
      
      {/* Zenith Line */}
      <Line
        points={zenithLinePoints}
        color="red"
        lineWidth={3}
      />
      
      {/* Subsolar Point */}
      <mesh position={subsolarPointPosition}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="yellow" />
      </mesh>
      
      {/* Sun indicator */}
      <mesh position={[3, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="orange" />
      </mesh>
    </group>
  );
}

function GridHelper() {
  const points = useMemo(() => {
    const gridPoints: THREE.Vector3[] = [];
    
    // Latitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
      for (let lng = -180; lng < 180; lng += 2) {
        gridPoints.push(latLngToVector3(lat, lng, 1.002));
      }
    }
    
    // Longitude lines
    for (let lng = -180; lng <= 180; lng += 30) {
      for (let lat = -90; lat <= 90; lat += 2) {
        gridPoints.push(latLngToVector3(lat, lng, 1.002));
      }
    }
    
    return gridPoints;
  }, []);
  
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.002} color="#888888" />
    </points>
  );
}

export default function Globe({ zenithLine, subsolarPoint, date }: GlobeProps) {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas camera={{ position: [2, 1, 2], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <EarthGlobe zenithLine={zenithLine} subsolarPoint={subsolarPoint} date={date} />
        <GridHelper />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}
