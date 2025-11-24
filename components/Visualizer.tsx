import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideId } from '../types';

interface VisualizerProps {
  currentSlideId: SlideId;
  shrinkOnMobile: boolean;
}

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
        cy: [startY, endY, endY],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: isHotspot ? 2 : 3,
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
      <text x={x} y={y - 12} textAnchor="middle" fill="#94a3b8" fontSize="2.5" letterSpacing="0.1em" className="uppercase font-mono" style={{ pointerEvents: 'none' }}>
        {label}
      </text>
       <text x={x} y={y + 15} textAnchor="middle" fill={color} fontSize="2" className="font-mono" style={{ pointerEvents: 'none' }}>
        {subLabel}
      </text>

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
    const yPos = 35; 
    return (
        <g>
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
            <UserJourneyNode x={20} y={yPos} label="Detection" subLabel={resolved ? "Clear Signal" : "Too Vague"} type={resolved ? 'clear' : 'vague'} delay={0} />
            <UserJourneyNode x={50} y={yPos} label="Investigation" subLabel={resolved ? "Metrics Available" : "No Metrics"} type={resolved ? 'data' : 'missing'} delay={1} />
            <UserJourneyNode x={80} y={yPos} label="Fixing" subLabel={resolved ? "Actionable" : "Unavailable"} type={resolved ? 'fixed' : 'blocked'} delay={2} />
        </g>
    )
}

// Artistic "Key Visualizer" for the Title Slide
const KeyVisualizerArt = () => {
  // Generate a composition that mimics the Spanner Key Visualizer spectrogram
  // Colors: Deep Purple, Violet, Magenta, Bright Yellow, White
  const rects = useMemo(() => {
    const r = [];
    const numRows = 25;
    
    // Define a "hot zone" for composition (lower middle)
    const hotZoneStart = 12;
    const hotZoneEnd = 18;

    for (let row = 0; row < numRows; row++) {
      const y = (row / numRows) * 100;
      const height = 100 / numRows;
      
      // Determine "heat" potential of this row based on zone
      let rowHeatProb = 0.1;
      if (row >= hotZoneStart && row <= hotZoneEnd) {
        rowHeatProb = 0.8; // High probability of hot streaks in the zone
      } else if (row > hotZoneEnd && row < hotZoneEnd + 4) {
        rowHeatProb = 0.4; // Falloff
      }

      // Divide row into segments
      const numSegs = Math.floor(Math.random() * 10) + 10;
      let currentX = 0;
      
      for (let i = 0; i < numSegs; i++) {
        const width = Math.random() * 15 + 2;
        if (currentX + width > 100) break;

        // Determine color
        const rand = Math.random();
        let color = "#1e0036"; // Default deep purple (cold)
        let opacity = 0.8;

        if (rand < rowHeatProb) {
            // It's a hot segment, pick varying degrees of heat
            const heatLevel = Math.random();
            if (heatLevel > 0.9) color = "#ffffff"; // White hot
            else if (heatLevel > 0.6) color = "#ffb700"; // Yellow
            else if (heatLevel > 0.3) color = "#d946ef"; // Magenta/Pink
            else color = "#7c3aed"; // Violet
            
            opacity = 1;
        } else {
            // Cold segment
             color = Math.random() > 0.5 ? "#3b0764" : "#1e0036";
             opacity = 0.5;
        }

        r.push({
          id: `${row}-${i}`,
          x: currentX,
          y,
          width,
          height: height * 0.9, // slight gap
          color,
          opacity,
          isHot: color === "#ffffff" || color === "#ffb700"
        });

        currentX += width + 0.2; // gap
      }
    }
    return r;
  }, []);

  return (
    <g>
      {rects.map((rect, i) => (
        <motion.rect
          key={rect.id}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          fill={rect.color}
          opacity={rect.opacity}
          initial={{ opacity: 0, x: rect.x - 10 }}
          animate={{ 
            opacity: rect.isHot ? [rect.opacity, 1, rect.opacity] : rect.opacity,
            x: rect.x
          }}
          transition={{
            opacity: { duration: rect.isHot ? 0.2 : 2, repeat: Infinity, repeatType: "reverse", delay: Math.random() * 2 },
            x: { duration: 1.5, ease: "easeOut", delay: i * 0.005 }
          }}
        />
      ))}
      {/* Overlay subtle grid lines for technical look */}
      <rect x="0" y="0" width="100" height="100" fill="url(#gridPattern)" opacity="0.1" pointerEvents="none"/>
      <defs>
        <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
        </pattern>
      </defs>
    </g>
  );
};

// New Visual for the Observability Slide
const ObservabilityVisual = () => {
  const words = ["MANAGED", "DATABASE", "OBSERVABILITY"];
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center md:items-end md:pr-32 relative">
      {/* Abstract Background Graphic: Concentric pulsing rings suggesting a lens/eye */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 md:translate-x-[20%] transition-transform duration-1000">
        <defs>
           <radialGradient id="lensGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
           </radialGradient>
        </defs>
        <circle cx="50%" cy="50%" r="30%" fill="url(#lensGrad)" />
        {[1, 2, 3].map(i => (
          <motion.circle 
            key={i}
            cx="50%" cy="50%" r={`${15 * i}%`}
            stroke="#06b6d4" strokeWidth="0.5" fill="none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.1, opacity: [0, 0.3, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 1.2, ease: "easeInOut" }}
          />
        ))}
        {/* Data stream lines */}
         <motion.path 
           d="M0 50 H100" stroke="#06b6d4" strokeWidth="0.2" strokeDasharray="5 5"
           initial={{ opacity: 0 }} animate={{ opacity: 0.2 }}
         />
      </svg>

      {/* Floating Text */}
      <div className="z-10 flex flex-col items-center gap-2 md:gap-6 md:items-end">
        {words.map((word, i) => (
          <motion.h1
            key={word}
            className="text-4xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-200 to-cyan-600 filter drop-shadow-lg"
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              filter: 'blur(0px)',
              transition: { 
                duration: 0.8, 
                delay: i * 0.6,
                ease: "easeOut" 
              } 
            }}
            whileInView={{
               y: [0, -10, 0],
               transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1 + (i * 0.5) // Offset the float
               }
            }}
          >
            {word}
          </motion.h1>
        ))}
      </div>
    </div>
  );
};

// Timeline Visual for Methodology and Implementation Slides
interface TimelineEvent {
  title: string;
  date: string;
  desc: string;
}

const TimelineVisual = ({ events, themeColor }: { events: TimelineEvent[], themeColor: 'indigo' | 'emerald' }) => {
  // Theme config
  const colors = {
    indigo: {
      line: 'bg-indigo-500',
      shadow: 'shadow-[0_0_20px_rgba(99,102,241,0.5)]',
      border: 'border-indigo-500',
      bg: 'bg-indigo-400',
      badge: 'bg-indigo-900/50 text-indigo-300 border-indigo-500/30',
      fill: 'bg-indigo-200',
      gradient: 'from-indigo-500'
    },
    emerald: {
      line: 'bg-emerald-500',
      shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
      border: 'border-emerald-500',
      bg: 'bg-emerald-400',
      badge: 'bg-emerald-900/50 text-emerald-300 border-emerald-500/30',
      fill: 'bg-emerald-200',
      gradient: 'from-emerald-500'
    }
  };
  
  const t = colors[themeColor];

  return (
    // Centered layout for timeline, full screen
    <div className="w-full h-full flex items-center justify-center p-6 md:p-12 overflow-y-auto md:overflow-hidden">
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full max-w-7xl gap-8 md:gap-4 min-h-[80vh] md:min-h-0 pt-12 md:pt-0">
        
        {/* Horizontal Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
           <motion.div 
             className={`h-full ${t.line} ${t.shadow}`}
             initial={{ width: 0 }}
             animate={{ width: "100%" }}
             transition={{ duration: 4, ease: "easeInOut" }}
           />
        </div>

         {/* Vertical Line (Mobile) */}
        <div className="md:hidden absolute left-4 top-0 h-full w-1 bg-slate-800 rounded-full overflow-hidden">
           <motion.div 
             className={`w-full ${t.line}`}
             initial={{ height: 0 }}
             animate={{ height: "100%" }}
             transition={{ duration: 4, ease: "easeInOut" }}
           />
        </div>

        {events.map((event, index) => (
          <div key={index} className="relative z-10 flex md:flex-col items-start md:items-center flex-1 gap-4 md:gap-0 h-full justify-center">
            
            {/* Node */}
            <motion.div 
              className={`relative w-10 h-10 md:w-6 md:h-6 rounded-full bg-slate-950 border-2 md:border-4 ${t.border} flex items-center justify-center shrink-0 shadow-xl z-20`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + (index * 0.6), type: "spring", stiffness: 200 }}
            >
               <motion.div 
                 className={`absolute inset-0 rounded-full ${t.bg} opacity-40`}
                 animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                 transition={{ duration: 2, repeat: Infinity }}
               />
               <div className={`w-2 h-2 ${t.fill} rounded-full hidden md:block shadow-inner`} />
            </motion.div>

            {/* Content Card */}
            <motion.div
              className={`
                flex-1 md:absolute bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl w-full md:w-56 shadow-2xl
                ${index % 2 === 0 ? 'md:-top-44' : 'md:top-16'} 
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (index * 0.6) }}
            >
               <div className="flex items-center justify-between mb-2">
                  {event.date && (
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${t.badge}`}>
                        {event.date}
                     </span>
                  )}
                  {!event.date && <span className="w-2 h-2"></span>} {/* Spacer */}
               </div>
               <h3 className="text-white font-bold text-sm md:text-base mb-1 leading-tight">{event.title}</h3>
               <p className="text-slate-400 text-xs leading-relaxed">{event.desc}</p>
               
               {/* Connector line for desktop cards */}
               <motion.div 
                 className={`
                   hidden md:block absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b ${t.gradient} to-transparent opacity-50
                   ${index % 2 === 0 ? '-bottom-12 h-12' : '-top-12 h-12'}
                 `} 
                 initial={{ scaleY: 0 }}
                 animate={{ scaleY: 1 }}
                 style={{ originY: index % 2 === 0 ? 0 : 1 }}
                 transition={{ delay: 1 + (index * 0.6), duration: 0.4 }}
               />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};


export const Visualizer: React.FC<VisualizerProps> = ({ currentSlideId, shrinkOnMobile }) => {
  const [particles, setParticles] = useState<any[]>([]);

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

  // Dark Purple background for Title slide to match Key Visualizer aesthetic
  const bgClass = currentSlideId === SlideId.TITLE 
    ? 'bg-[#0B0014]' 
    : 'bg-gradient-to-br from-slate-900 to-black';

  // Force disable shrinkOnMobile for timeline slides so they use full height
  const effectiveShrinkOnMobile = (currentSlideId === SlideId.METHODOLOGY || currentSlideId === SlideId.IMPLEMENTATION) ? false : shrinkOnMobile;

  // Define timeline data
  const methodologyEvents = [
    { 
      title: "Identifying the problem", 
      date: "Nov 2022",
      desc: "Uptick in customer tickets where the root cause was hotspotting. Users faced prod issues without ability to troubleshoot." 
    },
    { 
      title: "Literature Review", 
      date: "Nov 2022",
      desc: "Reviewing past work showed little existing research, relying mostly on anecdotal stories from engineers." 
    },
    { 
      title: "Research Goal", 
      date: "",
      desc: "Understand key user needs and evaluate whether improving current tools would solve the core problem." 
    },
    { 
      title: "Collecting Data", 
      date: "Jan 2023",
      desc: "Purposive sampling of users across 3 databases. Conducted 1.5hr interviews and usability testing." 
    },
    { 
      title: "Analysis", 
      date: "",
      desc: "Structured thematic analysis of interview data to identify patterns in the troubleshooting journey." 
    },
    { 
      title: "Reporting", 
      date: "Apr 2023",
      desc: "Findings: The journey is broken. No deterministic metrics to detect issues, and tools don't pinpoint root causes." 
    },
  ];

  const implementationEvents = [
    {
      title: "Metric Development",
      date: "Jun 2023",
      desc: "Spanner engineering start work on a “deterministic” metric to confirm hotspotting using the research rubric."
    },
    {
      title: "Cross-functional Review",
      date: "Aug 2023",
      desc: "Designs presented at “Topic de Jour”. Feedback highlighted a gap in explaining the complex engineering solution to lay audiences."
    },
    {
      title: "Bridging the Gap",
      date: "Sep 2023",
      desc: "Sessions with Engineering to translate the solution for non-technical stakeholders, improving collaboration."
    },
    {
      title: "Expansion & Testing",
      date: "Sep 2023+",
      desc: "Collaborating with Bigtable and Firestore teams. Concept testing with actual users scheduled for next year."
    }
  ];

  const noGridSlides = [
    SlideId.TITLE,
    SlideId.OBSERVABILITY,
    SlideId.METHODOLOGY,
    SlideId.IMPLEMENTATION,
  ];

  return (
    <div className={`absolute top-0 left-0 w-full overflow-hidden z-0 transition-[height,background-color] duration-1000 ease-in-out ${effectiveShrinkOnMobile ? 'h-[45%] md:h-full' : 'h-full'} ${bgClass}`}>
      {/* Background Grid */}
      {!noGridSlides.includes(currentSlideId) && (
        <div className="absolute inset-0 opacity-20" 
          style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>
      )}

      {/* Container for visuals */}
      <div className={`w-full h-full relative flex items-center ${currentSlideId === SlideId.METHODOLOGY || currentSlideId === SlideId.IMPLEMENTATION ? 'md:justify-center' : 'md:justify-end md:pr-12'} justify-center`}>
        <AnimatePresence mode="wait">
            
            {/* New Observability Visual */}
            {currentSlideId === SlideId.OBSERVABILITY && (
              <motion.div
                key="observability"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 w-full h-full z-10"
              >
                <ObservabilityVisual />
              </motion.div>
            )}

             {/* Timeline Visual: Methodology */}
             {currentSlideId === SlideId.METHODOLOGY && (
              <motion.div
                key="timeline-methodology"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full z-10"
              >
                <TimelineVisual events={methodologyEvents} themeColor="indigo" />
              </motion.div>
            )}

            {/* Timeline Visual: Implementation */}
             {currentSlideId === SlideId.IMPLEMENTATION && (
              <motion.div
                key="timeline-implementation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full z-10"
              >
                <TimelineVisual events={implementationEvents} themeColor="emerald" />
              </motion.div>
            )}
        </AnimatePresence>

        {[
          SlideId.TITLE,
          SlideId.PREMISE,
          SlideId.HOTSPOT,
          SlideId.ACTION,
          SlideId.IMPACT,
          SlideId.SOLUTION // Now defaults to SVG container
        ].includes(currentSlideId) && currentSlideId !== SlideId.OBSERVABILITY && currentSlideId !== SlideId.METHODOLOGY && currentSlideId !== SlideId.IMPLEMENTATION && currentSlideId !== SlideId.EXISTING_TOOLS && (
          <motion.svg 
            viewBox="0 0 125 100" 
            className="w-full h-full max-w-5xl max-h-screen absolute opacity-80 transition-transform duration-500 md:translate-x-[25%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {currentSlideId === SlideId.TITLE && (
              <KeyVisualizerArt />
            )}

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

            {currentSlideId === SlideId.HOTSPOT && (
              <g>
                 {[10, 30, 50, 70, 90].map((y, i) => (
                   <line key={i} x1="0" y1={y} x2="100" y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                ))}
                <rect x="0" y="0" width="100" height="20" fill="#ef4444" fillOpacity="0.1" />
                {particles.map(p => (
                  <DataParticle key={p.id} laneIndex={p.laneIndex} isHotspot={true} delay={p.delay} />
                ))}
                <motion.circle cx="50" cy="10" r="5" fill="#ef4444" opacity="0.5"
                   animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.6, 0.2] }}
                   transition={{ duration: 1, repeat: Infinity }}
                />
              </g>
            )}

            {currentSlideId === SlideId.ACTION && (
              <g>
                <motion.circle cx="50" cy="50" r="5" fill="#fff" 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}
                />
                <ResearchNode x={20} y={20} delay={0.2} connectToCenter />
                <ResearchNode x={80} y={20} delay={0.4} connectToCenter />
                <ResearchNode x={20} y={80} delay={0.6} connectToCenter />
                <ResearchNode x={80} y={80} delay={0.8} connectToCenter />
                <ResearchNode x={50} y={15} delay={1.0} connectToCenter />
              </g>
            )}

            {currentSlideId === SlideId.IMPACT && (
               <UserJourneyVisual resolved={false} />
            )}
             
            {currentSlideId === SlideId.SOLUTION && (
               <UserJourneyVisual resolved={true} />
            )}
          </motion.svg>
        )}
      </div>
    </div>
  );
};