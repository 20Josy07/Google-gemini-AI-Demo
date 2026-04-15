/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION } from '@/src/constants';
import { Trophy, RotateCcw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const speedRef = useRef(150);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (subtle glitch)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food (Magenta Glitch)
    ctx.fillStyle = '#FF00FF';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FF00FF';
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );
    ctx.shadowBlur = 0;

    // Snake (Cyan Glitch)
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#FFFFFF' : '#00FFFF';
      ctx.shadowBlur = isHead ? 15 : 0;
      ctx.shadowColor = '#00FFFF';
      
      const padding = 1;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
      
      // Random glitch offset for head
      if (isHead && Math.random() > 0.9) {
        ctx.fillStyle = '#FF00FF';
        ctx.fillRect(
          segment.x * cellSize - 2,
          segment.y * cellSize,
          2,
          cellSize
        );
      }
      ctx.shadowBlur = 0;
    });
  }, [snake, food]);

  const gameLoop = useCallback((timestamp: number) => {
    if (timestamp - lastUpdateTimeRef.current > speedRef.current) {
      moveSnake();
      lastUpdateTimeRef.current = timestamp;
    }
    draw();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [moveSnake, draw]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameLoop]);

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full font-mono">
      {/* Score Board */}
      <div className="flex justify-between w-full px-4 py-2 bg-black border border-[#00FFFF] shadow-[4px_4px_0px_#FF00FF]">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[2px] text-[#00FFFF]">CURR_VAL</span>
          <span className="text-2xl font-bold text-[#FF00FF] glitch-text" data-text={score.toString().padStart(6, '0')}>
            {score.toString().padStart(6, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-[2px] text-[#00FFFF]">MAX_VAL</span>
          <span className="text-2xl font-bold text-[#00FFFF]">
            {highScore.toString().padStart(6, '0')}
          </span>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative flex-1 w-full bg-black border-2 border-[#00FFFF] overflow-hidden shadow-[inset_0_0_20px_#00FFFF]">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-full cursor-none"
        />

        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10"
            >
              {isGameOver ? (
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black text-[#FF00FF] tracking-tighter uppercase italic glitch-text" data-text="CORE_FAILURE">CORE_FAILURE</h2>
                  <p className="text-[#00FFFF] font-mono text-xs uppercase tracking-widest">DUMP: {score}_UNITS_LOST</p>
                  <Button 
                    onClick={resetGame}
                    className="bg-black border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black font-bold px-8 py-2 shadow-[4px_4px_0px_#FF00FF]"
                  >
                    [REBOOT]
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <h2 className="text-3xl font-bold text-[#00FFFF] tracking-tight uppercase glitch-text" data-text="SYSTEM_IDLE">SYSTEM_IDLE</h2>
                  <Button 
                    onClick={() => setIsPaused(false)}
                    className="bg-black border-2 border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black font-bold px-10 py-4 shadow-[4px_4px_0px_#00FFFF] group"
                  >
                    [RESUME_PROCESS]
                  </Button>
                  <p className="text-[#00FFFF]/40 text-[8px] font-mono uppercase tracking-widest">REQ: SPACE_OR_CLICK_TO_CONTINUE</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
