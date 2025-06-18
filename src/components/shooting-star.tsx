'use client';

import { fragment, vertex } from '@/lib/shaders';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Props { 
  size?: number;
  color?: THREE.ColorRepresentation;
  x: number; 
  y: number;
}

export default function ShootingStar({ 
  size = 75, 
  color = 0xf1f5f9, 
  x, 
  y 
}: Props) {
  const meshRef = useRef<THREE.Points>(null);
  const { gl } = useThree();

  const [material] = useState(() => {
    return new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      uniforms: {
        uSize: { value: size * gl.getPixelRatio() },
        uTime: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });
  });

  const [geometry] = useState(() => {
    const starColor = new THREE.Color(color);
    return generateShootingStarGeometry(starColor);
  });

  useEffect(() => {
    if (!meshRef.current) return; 
    meshRef.current.position.set(x, y, 0);
  }, [x, y]);

  useFrame((_, delta) => {
    if (material.uniforms.uTime) material.uniforms.uTime.value += delta;
    if (!meshRef.current) return;
    meshRef.current.position.x += 0.05;
    meshRef.current.position.y += 0.01;
  });

  return <points ref={meshRef} args={[geometry, material]} />;
}

const SHOOTING_STAR_COUNT = 100;

function generateShootingStarGeometry(color: THREE.Color) {
  const positions = new Float32Array(SHOOTING_STAR_COUNT * 3);
  const colors = new Float32Array(SHOOTING_STAR_COUNT * 3);
  const scales = new Float32Array(SHOOTING_STAR_COUNT);

  for (let i = 0; i < SHOOTING_STAR_COUNT; i++) {
    const i3 = i * 3;

    positions[i3] = (Math.random() - 0.5) * 0.01;
    positions[i3 + 1] = (Math.random() - 0.5) * 0.01;
    positions[i3 + 2] = (Math.random() - 0.5) * 0.01;

    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    scales[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

  return geometry;
}