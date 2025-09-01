'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Float, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { Mesh, Group } from 'three'
import * as THREE from 'three'

function QRCube() {
  const groupRef = useRef<Group>(null)
  const cubeRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.3
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.2
    }
    
    if (cubeRef.current) {
      cubeRef.current.rotation.x = Math.sin(time * 0.5) * 0.1
      cubeRef.current.rotation.z = Math.cos(time * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main holographic cube */}
      <mesh ref={cubeRef} castShadow receiveShadow>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshPhysicalMaterial 
          color="#0ea5e9"
          metalness={0.9}
          roughness={0.1}
          transmission={0.3}
          thickness={0.5}
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0}
        />
        
        {/* Enhanced QR pattern on multiple faces */}
        {/* Front face */}
        <QRFace position={[0, 0, 1.26]} rotation={[0, 0, 0]} />
        {/* Right face */}
        <QRFace position={[1.26, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        {/* Top face */}
        <QRFace position={[0, 1.26, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      </mesh>
      
      {/* Glowing wireframe overlay */}
      <mesh>
        <boxGeometry args={[2.52, 2.52, 2.52]} />
        <meshBasicMaterial 
          color="#38bdf8" 
          wireframe 
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Energy particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <EnergyParticle key={i} index={i} />
      ))}
    </group>
  )
}

function QRFace({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* QR background */}
      <mesh>
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.9} />
      </mesh>
      
      {/* QR pattern - corner squares */}
      <mesh position={[-0.7, 0.7, 0.01]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.7, 0.7, 0.01]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.7, -0.7, 0.01]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Central pattern */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Random dots */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = (Math.sin(i * 2.5) * 0.8)
        const y = (Math.cos(i * 3.7) * 0.8)
        return (
          <mesh key={i} position={[x, y, 0.01]}>
            <planeGeometry args={[0.15, 0.15]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        )
      })}
    </group>
  )
}

function EnergyParticle({ index }: { index: number }) {
  const particleRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (particleRef.current) {
      const time = state.clock.elapsedTime
      const radius = 4 + Math.sin(time + index) * 0.5
      const speed = 0.5 + index * 0.1
      
      particleRef.current.position.x = Math.cos(time * speed + index * 0.5) * radius
      particleRef.current.position.y = Math.sin(time * speed * 0.7 + index) * 2
      particleRef.current.position.z = Math.sin(time * speed + index * 0.8) * radius
      
      particleRef.current.rotation.x = time + index
      particleRef.current.rotation.y = time * 0.7 + index
    }
  })

  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={1}>
      <mesh ref={particleRef} scale={0.1}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial 
          color={`hsl(${200 + index * 20}, 80%, 70%)`}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  )
}

function BackgroundSphere() {
  return (
    <Sphere args={[15, 32, 32]} position={[0, 0, -10]}>
      <MeshDistortMaterial
        color="#0f172a"
        transparent
        opacity={0.3}
        distort={0.3}
        speed={2}
      />
    </Sphere>
  )
}

export default function QRCube3D() {
  return (
    <div className="w-full h-96 relative overflow-hidden">
      <Canvas
        camera={{ position: [6, 4, 6], fov: 50 }}
        shadows
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Enhanced lighting */}
        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#0ea5e9" />
        <spotLight 
          position={[0, 15, 0]} 
          angle={0.3} 
          penumbra={1} 
          intensity={2}
          color="#38bdf8"
          castShadow
        />
        
        {/* Environment for better reflections */}
        <Environment preset="city" />
        
        <BackgroundSphere />
        <QRCube />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}
