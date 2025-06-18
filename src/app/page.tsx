'use client';

import ColorIndicator from '@/components/color-indicator';
import ShootingStar from '@/components/shooting-star';
import { txColors } from '@/lib/tx-colors';
import { Transaction } from '@/types';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ShootingStar { 
  id: string;
  size: number;
  color: THREE.ColorRepresentation;
  x: number; 
  y: number;
}

const TRANSACTION_INTERVAL = 100;

export default function HomePage() {
  const txQueue = useRef<Transaction[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/transactions');

    eventSource.onmessage = (event) => {
      try {
        const newTxs = JSON.parse(event.data);
        txQueue.current.push(...newTxs);
      } catch (err) {
        console.error('Invalid tx data:', event.data);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (txQueue.current.length > 0) {
        const next = txQueue.current.shift();
        if (!next) return;

        const shootingStarProps: ShootingStar = { 
          id: next.hash, 
          size: 75,
          color: txColors[next.type],
          x: -4, 
          y: (Math.random() - 0.5) * 3
        }

        setShootingStars((prev) => [...prev, shootingStarProps]);
      }
    }, TRANSACTION_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Canvas className='!h-screen bg-black'>
        {shootingStars.map((star) => (
          <ShootingStar 
            key={star.id}
            size={star.size}
            color={star.color}
            x={star.x} 
            y={star.y} 
          />
        ))}
      </Canvas>

      <ColorIndicator />
    </>
  );
}