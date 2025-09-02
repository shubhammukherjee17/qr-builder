'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { Mesh } from 'three'
import * as THREE from 'three'

function FloatingIcon({ position, color, index }: { 
  position: [number, number, number]
  icon: string
  color: string
  index: number
}) {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.rotation.y = time * 0.5 + index
      meshRef.current.rotation.x = Math.sin(time + index) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={0.5}>
        <boxGeometry args={[1, 1, 0.2]} />
        <meshPhysicalMaterial 
          color={color}
          metalness={0.3}
          roughness={0.4}
          transmission={0.1}
          transparent
          opacity={0.8}
        />
        {/* Simple icon representation without text */}
      </mesh>
    </Float>
  )
}

function FloatingCard({ position, index }: { position: [number, number, number]; index: number }) {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.rotation.y = Math.sin(time * 0.3 + index) * 0.3
      meshRef.current.position.y = position[1] + Math.sin(time + index) * 0.5
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={[2, 1.2, 0.1]}>
        <boxGeometry />
        <meshPhysicalMaterial 
          color="#f8fafc"
          metalness={0.1}
          roughness={0.1}
          transmission={0.05}
          transparent
          opacity={0.6}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  )
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null)
  
  // Create particle positions
  const particles = new Float32Array(100 * 3)
  for (let i = 0; i < 100; i++) {
    particles[i * 3] = (Math.random() - 0.5) * 20
    particles[i * 3 + 1] = (Math.random() - 0.5) * 10
    particles[i * 3 + 2] = (Math.random() - 0.5) * 20
  }
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={100}
          array={particles}
          itemSize={3}
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05}
        color="#3b82f6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export default function Floating3DElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        
        <ParticleField />
        
        {/* Floating tech icons */}
        <FloatingIcon position={[-6, 3, -2]} icon="📱" color="#3b82f6" index={0} />
        <FloatingIcon position={[6, -2, -1]} icon="🔗" color="#10b981" index={1} />
        <FloatingIcon position={[-4, -3, -3]} icon="📧" color="#f59e0b" index={2} />
        <FloatingIcon position={[5, 4, -2]} icon="📞" color="#ef4444" index={3} />
        <FloatingIcon position={[0, 5, -4]} icon="💬" color="#8b5cf6" index={4} />
        <FloatingIcon position={[-7, 0, -1]} icon="📶" color="#06b6d4" index={5} />
        
        {/* Floating cards */}
        <FloatingCard position={[-3, 1, -5]} index={0} />
        <FloatingCard position={[4, -1, -4]} index={1} />
        <FloatingCard position={[1, 3, -6]} index={2} />
        <FloatingCard position={[-5, -2, -3]} index={3} />
      </Canvas>
    </div>
  )
}
