import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideId } from '../types';
import { DashboardVisual } from './DashboardVisual';

interface VisualizerProps {
  currentSlideId: SlideId;
}

// Helper for random generation
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

interface DataParticleProps {
  laneIndex: number;
  isHotspot: boolean;
  delay: number;
}

// Particle Component for Slide 0 & 1
const DataParticle: React.FC<DataParticleProps> = ({ 
  laneIndex, 
  isHotspot, 
  delay 
}) => {
  // If hotspot, everything converges to lane 0 (index 0) center y
  // Normal: y is based on laneIndex
  
  // SVG ViewBox is roughly 0 0 100 100
  const laneHeight = 100 / 5;
  const startY = laneIndex * laneHeight + laneHeight / 2;
  const endY = isHotspot ? (0 * laneHeight + laneHeight / 2) : startY;
  
  const color = isHotspot ? "#ef4444" : "#10b981";

  return (
    <motion.circle
      r={1.5}
      fill={color}
      initial={{ cx: -10, cy: startY, opacity: 0 }}
      animate={{ 
        cx: 110, 
        cy: [startY, endY, endY], // Curve towards endY
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: isHotspot ? 2 : 3, // Slower flow for normal, frantic for hotspot? Actually hotspot causes jam, but visually fast rushing looks chaotic
        repeat: Infinity,
        ease: "linear",
        delay: delay,
        times: [0, 0.3, 1]
      }}
    />
  );
};

// Network Node for Slide 3 (Action)
const ResearchNode = ({ x, y, delay, connectToCenter }: { x: number, y: number, delay: number, connectToCenter?: boolean }) => {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      {connectToCenter && (
        <motion.line
          x1={x} y1={y} x2={50} y2={50}
          stroke="#60a5fa"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.8 }}
        />
      )}
      <circle cx={x} cy={y} r={3} fill="#3b82f6" className="drop-shadow-lg" />
      <circle cx={x} cy={y} r={8} stroke="#3b82f6" strokeWidth="0.5" fill="transparent" opacity={0.5} />
    </motion.g>
  );
};

// User Journey Node for Slide 4 & 5
interface UserJourneyNodeProps {
  x: number;
  y: number;
  label: string;
  subLabel: string;
  type: 'vague' | 'missing' | 'blocked' | 'clear' | 'data' | 'fixed';
  delay: number;
}

const UserJourneyNode: React.FC<UserJourneyNodeProps> = ({ x, y, label, subLabel, type, delay }) => {
  const isResolved = type === 'clear' || type === 'data' || type === 'fixed';
  const color = isResolved ? '#10b981' : (type === 'blocked' ? '#ef4444' : '#f59e0b');

  return (
    <motion.g
      initial={{ opacity: 0, translateY: 5 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay, duration: 0.8 }}
    >
      {/* Label */}
      <text x={x} y={y - 12} textAnchor="middle" fill="#94a3b8" fontSize="2.5" letterSpacing="0.1em" className="uppercase font-mono" style={{ pointerEvents: 'none' }}>
        {label}
      </text>
      
      {/* Sublabel */}
       <text x={x} y={y + 15} textAnchor="middle" fill={color} fontSize="2" className="font-mono" style={{ pointerEvents: 'none' }}>
        {subLabel}
      </text>

      {/* Node Visual */}
      {(type === 'vague' || type === 'clear') && (
        <g>
          <motion.circle cx={x} cy={y} r={8} stroke={color} strokeWidth="0.2" fill="transparent" opacity={0.2} />
          {type === 'vague' ? (
            <>
              <motion.circle cx={x} cy={y} r={6} stroke={color} strokeWidth="0.3" fill="transparent" opacity={0.4} 
                 animate={{ r: [6, 7, 6], opacity: [0.4, 0.2, 0.4] }} transition={{ duration: 3, repeat: Infinity }}
              />
              <circle cx={x} cy={y} r={1} fill={color} />
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                 <motion.circle 
                   key={i}
                   cx={x + Math.cos(angle * Math.PI / 180) * 4}
                   cy={y + Math.sin(angle * Math.PI / 180) * 4}
                   r={0.5} fill={color} opacity={0.6}
                   animate={{ 
                     cx: x + Math.cos((angle + 20) * Math.PI / 180) * 5,
                     cy: y + Math.sin((angle + 20) * Math.PI / 180) * 5
                   }}
                   transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", delay: i * 0.1 }}
                 />
              ))}
            </>
          ) : (
             // Clear State
             <g>
                <motion.circle cx={x} cy={y} r={6} stroke={color} strokeWidth="0.5" fill="transparent" 
                   initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
                />
                <motion.circle cx={x} cy={y} r={3} fill={color} opacity={0.3} animate={{ r: [3, 4, 3], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}/>
                <circle cx={x} cy={y} r={1.5} fill={color} />
             </g>
          )}
        </g>
      )}

      {(type === 'missing' || type === 'data') && (
        <g>
          {type === 'missing' ? (
            <>
              <motion.circle 
                cx={x} cy={y} r={6} 
                stroke="#94a3b8" strokeWidth="0.3" strokeDasharray="2 2" fill="transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, ease: "linear", repeat: Infinity }}
              />
              <text x={x} y={y + 2} textAnchor="middle" fill="#94a3b8" fontSize="5" opacity={0.5} className="font-sans">?</text>
            </>
          ) : (
            // Data State
            <g>
              <motion.rect x={x-4} y={y-4} width={2} height={8} fill={color} initial={{ height: 0, y: y+4 }} animate={{ height: 8, y: y-4 }} transition={{ delay: delay+0.2 }} />
              <motion.rect x={x-1} y={y-6} width={2} height={10} fill={color} initial={{ height: 0, y: y+4 }} animate={{ height: 10, y: y-6 }} transition={{ delay: delay+0.3 }} />
              <motion.rect x={x+2} y={y-2} width={2} height={6} fill={color} initial={{ height: 0, y: y+4 }} animate={{ height: 6, y: y-2 }} transition={{ delay: delay+0.4 }} />
            </g>
          )}
        </g>
      )}

      {(type === 'blocked' || type === 'fixed') && (
        <g>
           <motion.path
             d={`M${x} ${y-6} L${x+5.2} ${y-3} L${x+5.2} ${y+3} L${x} ${y+6} L${x-5.2} ${y+3} L${x-5.2} ${y-3} Z`}
             stroke={color} strokeWidth="0.3" fill="transparent" opacity={0.5}
           />
           {type === 'blocked' ? (
              <motion.path 
                d={`M${x-2} ${y-2} L${x+2} ${y+2} M${x+2} ${y-2} L${x-2} ${y+2}`}
                stroke={color} strokeWidth="0.5"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: delay + 0.5, duration: 0.5 }}
              />
           ) : (
              // Fixed State
              <motion.path 
                d={`M${x-3} ${y} L${x-1} ${y+2} L${x+3} ${y-3}`}
                stroke={color} strokeWidth="0.8" fill="transparent" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: delay + 0.5, duration: 0.5 }}
              />
           )}
        </g>
      )}
    </motion.g>
  )
}

const UserJourneyVisual = ({ resolved = false }: { resolved?: boolean }) => {
    // Lifted to y=35 to avoid text overlap
    const yPos = 35; 

    return (
        <g>
            {/* Path Lines */}
            <motion.path 
                d={`M28 ${yPos} L42 ${yPos}`}
                stroke={resolved ? "#10b981" : "#334155"} strokeWidth="0.5" strokeDasharray={resolved ? "0" : "2 2"}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
            />
            <motion.path 
                d={`M58 ${yPos} L72 ${yPos}`}
                stroke={resolved ? "#10b981" : "#334155"} strokeWidth="0.5" strokeDasharray={resolved ? "0" : "2 2"}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.5, duration: 0.5 }}
            />

            <UserJourneyNode 
              x={20} y={yPos} 
              label="Detection" 
              subLabel={resolved ? "Clear Signal" : "Too Vague"} 
              type={resolved ? 'clear' : 'vague'} 
              delay={0} 
            />
            <UserJourneyNode 
              x={50} y={yPos} 
              label="Investigation" 
              subLabel={resolved ? "Metrics Available" : "No Metrics"} 
              type={resolved ? 'data' : 'missing'} 
              delay={1} 
            />
            <UserJourneyNode 
              x={80} y={yPos} 
              label="Fixing" 
              subLabel={resolved ? "Actionable" : "Unavailable"} 
              type={resolved ? 'fixed' : 'blocked'} 
              delay={2} 
            />
        </g>
    )
}

const HotspotInsightsVisual = () => {
  // Create a large grid that covers the entire 100x100 viewbox
  const rows = 20;
  const cols = 25;
  const cellW = 105 / cols;
  const cellH = 105 / rows;

  return (
    <g transform="translate(-2, -2)"> 
      {Array.from({ length: rows }).map((_, row) => (
        Array.from({ length: cols }).map((_, col) => {
          // Create a hotspot area roughly in the center-right, 
          // representing a "shard" or specific key range that is hot
          const isHotrow = row >= 4 && row <= 16;
          const isHotcol = col >= 14 && col <= 18;
          const isHot = isHotrow && isHotcol;
          
          // Edge fade logic
          const isEdge = row === 0 || row === rows - 1 || col === 0 || col === cols - 1;
          
          return (
            <motion.rect
                key={`${row}-${col}`}
                x={col * cellW}
                y={row * cellH}
                width={cellW - 0.2}
                height={cellH - 0.2}
                fill={isHot ? "#ef4444" : "#1e293b"} 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                    opacity: isEdge ? 0.1 : (isHot ? [0.8, 1, 0.8] : [0.2, 0.4, 0.2]),
                    scale: isHot ? [0.95, 1.05, 0.95] : 1
                }}
                transition={{ 
                    duration: 2 + Math.random(), 
                    repeat: Infinity, 
                    delay: (col + row) * 0.05 // Wave effect entrance
                }}
                rx="0.5"
            />
          );
        })
      ))}
      
      {/* Optional: A subtle scanning line to suggest real-time monitoring */}
      <motion.line
         x1="0" y1="0" x2="100" y2="0"
         stroke="#f59e0b" strokeWidth="0.2" strokeOpacity="0.5"
         animate={{ y1: [0, 100], y2: [0, 100] }}
         transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
    </g>
  );
};


export const Visualizer: React.FC<VisualizerProps> = ({ currentSlideId }) => {
  const [particles, setParticles] = useState<any[]>([]);

  // Generate particles for Premise/Hotspot slides
  useEffect(() => {
    const count = 40;
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        laneIndex: i % 5,
        delay: Math.random() * 3
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-slate-900 to-black z-0">
      {/* Background Grid Subtle - Only show on slides that don't have the full screen heatmap */}
      {currentSlideId !== SlideId.SOLUTION && (
        <div className="absolute inset-0 opacity-20" 
          style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>
      )}

      <div className="w-full h-full relative flex items-center justify-center">
        
        {/* Render Chart for Catalyst Slide */}
        <AnimatePresence mode="wait">
            {currentSlideId === SlideId.CATALYST && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl h-3/4 p-4 z-10"
              >
                <DashboardVisual />
              </motion.div>
            )}
        </AnimatePresence>

        {/* SVG Overlay for Abstract Visuals */}
        {currentSlideId !== SlideId.CATALYST && (
          <motion.svg 
            viewBox="0 0 100 100" 
            className="w-full h-full max-w-5xl max-h-screen absolute opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Slide 0: Premise (Green Flow) */}
            {currentSlideId === SlideId.PREMISE && (
              <g>
                {[10, 30, 50, 70, 90].map((y, i) => (
                   <line key={i} x1="0" y1={y} x2="100" y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                ))}
                {particles.map(p => (
                  <DataParticle key={p.id} laneIndex={p.laneIndex} isHotspot={false} delay={p.delay} />
                ))}
              </g>
            )}

            {/* Slide 1: Hotspot (Red Convergence) */}
            {currentSlideId === SlideId.HOTSPOT && (
              <g>
                 {[10, 30, 50, 70, 90].map((y, i) => (
                   <line key={i} x1="0" y1={y} x2="100" y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                ))}
                {/* Highlight Lane 1 */}
                <rect x="0" y="0" width="100" height="20" fill="#ef4444" fillOpacity="0.1" />
                
                {particles.map(p => (
                  <DataParticle key={p.id} laneIndex={p.laneIndex} isHotspot={true} delay={p.delay} />
                ))}
                {/* Warning Icon Pulse */}
                <motion.circle cx="50" cy="10" r="5" fill="#ef4444" opacity="0.5"
                   animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.6, 0.2] }}
                   transition={{ duration: 1, repeat: Infinity }}
                />
              </g>
            )}

            {/* Slide 3: Action (Network Graph) */}
            {currentSlideId === SlideId.ACTION && (
              <g>
                {/* Central Researcher */}
                <motion.circle cx="50" cy="50" r="5" fill="#fff" 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}
                />
                {/* Connected Users */}
                <ResearchNode x={20} y={20} delay={0.2} connectToCenter />
                <ResearchNode x={80} y={20} delay={0.4} connectToCenter />
                <ResearchNode x={20} y={80} delay={0.6} connectToCenter />
                <ResearchNode x={80} y={80} delay={0.8} connectToCenter />
                <ResearchNode x={50} y={15} delay={1.0} connectToCenter />
              </g>
            )}

            {/* Slide 4: Impact (User Journey Gaps) */}
            {currentSlideId === SlideId.IMPACT && (
               <UserJourneyVisual resolved={false} />
            )}

            {/* Slide 5: Solution (Full Screen Heatmap) */}
            {currentSlideId === SlideId.SOLUTION && (
               <HotspotInsightsVisual />
            )}

          </motion.svg>
        )}
      </div>
    </div>
  );
};