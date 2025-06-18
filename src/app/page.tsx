'use client';

import ColorIndicator from '@/components/color-indicator';
import ShootingStar from '@/components/shooting-star';
import useOrientation from '@/hook/useOrientation';
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

const transactionInterval = 100;

export default function HomePage() {
  const txQueue = useRef<Transaction[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const { isLandscape } = useOrientation();

  // Listen for new transactions from the server
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

  // Process transactions and create shooting stars
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (txQueue.current.length === 0) return;

      // Get the next transaction from the queue
      const nextTx = txQueue.current.shift();
      if (!nextTx) return;

      // Create a shooting star for the transaction
      setShootingStars((prev) => [...prev, { 
        id: nextTx.hash, 
        size: 75,
        color: txColors[nextTx.type],
        x: -4, 
        y: (Math.random() - 0.5) * 3
      }]);
    }, transactionInterval);

    return () => clearInterval(intervalId);
  }, []);

  // Clear shooting stars when orientation changes
  useEffect(() => {
    setShootingStars([]);
  }, [isLandscape])

  return isLandscape ? (
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
  ) : (
    <div 
      className="h-screen flex items-center justify-center text-white bg-black font-sans"
    >
      <p>Please rotate your device.</p>
    </div>
  );
}