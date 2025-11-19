import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: '10:00', latency: 20, load: 30 },
  { name: '10:05', latency: 25, load: 35 },
  { name: '10:10', latency: 30, load: 32 },
  { name: '10:15', latency: 180, load: 90 }, // Spike
  { name: '10:20', latency: 250, load: 95 }, // Peak
  { name: '10:25', latency: 220, load: 85 },
  { name: '10:30', latency: 210, load: 80 },
  { name: '10:35', latency: 230, load: 88 },
  { name: '10:40', latency: 40, load: 40 },
];

export const DashboardVisual: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl">
      <div className="w-full flex justify-between items-center mb-6">
        <h3 className="text-red-400 font-bold text-xl uppercase tracking-widest flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          System Alert: High Latency
        </h3>
        <div className="text-slate-400 text-sm font-mono">Cluster-US-East1</div>
      </div>
      
      <div className="w-full h-64 mb-8">
        <p className="text-slate-400 text-xs uppercase mb-2">Read/Write Latency (ms)</p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '10px' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '10px' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
              itemStyle={{ color: '#ef4444' }}
            />
            <Area type="monotone" dataKey="latency" stroke="#ef4444" fillOpacity={1} fill="url(#colorLatency)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full h-40">
        <p className="text-slate-400 text-xs uppercase mb-2">CPU Utilization (Lane #1)</p>
         <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" hide />
            <YAxis stroke="#94a3b8" style={{ fontSize: '10px' }} />
            <Tooltip 
               contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
            />
            <Line type="step" dataKey="load" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};