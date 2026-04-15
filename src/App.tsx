/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';
import { Music, Gamepad2, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050005] text-[#00FFFF] font-sans selection:bg-[#FF00FF] selection:text-white overflow-hidden flex flex-col relative">
      <div className="crt-overlay" />
      
      <main className="flex-1 w-full max-w-[1024px] h-[768px] mx-auto p-4 grid grid-cols-[280px_1fr] gap-4 relative z-10">
        
        {/* Sidebar: AUDIO_PROCESSOR */}
        <aside className="flex flex-col gap-4 bg-black border-2 border-[#00FFFF] p-4 shadow-[5px_5px_0px_#FF00FF] overflow-hidden screen-tear">
          <div className="border-b-2 border-[#00FFFF] pb-2 mb-2">
            <h2 className="text-xs font-mono tracking-[0.2em] uppercase glitch-text" data-text="AUDIO_PROCESSOR_v0.9">AUDIO_PROCESSOR_v0.9</h2>
          </div>
          <MusicPlayer />
        </aside>

        {/* Main Content: LOGIC_CORE */}
        <div className="flex flex-col gap-4 overflow-hidden">
          <header className="bg-black border-2 border-[#00FFFF] p-2 shadow-[5px_5px_0px_#FF00FF]">
            <h1 className="text-2xl font-mono tracking-tighter uppercase italic glitch-text" data-text="SNAKE_PROTOCOL_INIT">
              SNAKE_PROTOCOL_INIT
            </h1>
          </header>
          
          <div className="flex-1 bg-black border-2 border-[#00FFFF] p-4 shadow-[5px_5px_0px_#FF00FF] relative overflow-hidden">
            <SnakeGame />
          </div>

          <footer className="bg-black border-2 border-[#00FFFF] p-2 text-[10px] font-mono text-[#FF00FF] text-center tracking-[2px] uppercase shadow-[5px_5px_0px_#00FFFF]">
            [INPUT_REQ]: W/A/S/D_OR_ARROWS // [STATUS]: SYNC_ACTIVE // [SYS]: 0xDEADBEEF
          </footer>
        </div>

      </main>

      {/* Decorative Glitch Elements */}
      <div className="absolute top-4 right-4 text-[8px] font-mono opacity-30 pointer-events-none">
        ERR_NULL_PTR_EXCEPTION<br />
        STACK_OVERFLOW_DETECTED<br />
        REBOOTING_SYSTEM...
      </div>
    </div>
  );
}
