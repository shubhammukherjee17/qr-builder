'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Mesh } from 'three'

function AnimatedCube() {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.3
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3
    }
  })

  return (
    <group>
      {/* Main QR Cube */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          roughness={0.2}
          metalness={0.8}
        />
        
        {/* QR Pattern on faces */}
        <mesh position={[0, 0, 1.01]}>
          <planeGeometry args={[1.8, 1.8]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[0, 0, 1.02]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.6, 0.6, 1.02]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.6, 0.6, 1.02]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.6, -0.6, 1.02]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.6, -0.6, 1.02]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </mesh>
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}
    </group>
  )
}

function FloatingParticle({ index }: { index: number }) {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.position.y = Math.sin(time + index) * 2
      meshRef.current.position.x = Math.cos(time * 0.5 + index) * 4
      meshRef.current.position.z = Math.sin(time * 0.3 + index) * 2
      meshRef.current.rotation.x = time + index
      meshRef.current.rotation.z = time * 0.5 + index
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial 
        color={`hsl(${220 + index * 10}, 70%, 60%)`}
        emissive={`hsl(${220 + index * 10}, 30%, 20%)`}
      />
    </mesh>
  )
}

export default function QRCube3D() {
  return (
    <div className="w-full h-96 relative">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <AnimatedCube />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Overlay text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white z-10">
          <h3 className="text-2xl font-bold mb-2 text-shadow-lg">Interactive QR Creator</h3>
          <p className="text-blue-200 text-shadow">Generate • Customize • Download</p>
        </div>
      </div>
    </div>
  )
}
