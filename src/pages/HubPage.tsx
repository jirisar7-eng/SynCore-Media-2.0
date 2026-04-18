import React, { useState, useEffect } from 'react';
import { Box, Activity, Cpu, Globe, AlertTriangle } from 'lucide-react';
import { VercelAPI } from '../api/VercelAPI';
import { cn } from '../lib/utils';

/* ID-START: SY-HUB-2.6-EMERGENCY */
export default function HubPage() {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagId, setDiagId] = useState<string>('');

  useEffect(() => {
    async function fetchVercel() {
      const pid = import.meta.env.VITE_VERCEL_PROJECT_ID || 'MISSING';
      setDiagId(pid);
      try {
        setLoading(true);
        setError(null);
        const data = await VercelAPI.getDeployments();
        setDeployments(data.slice(0, 3));
      } catch (e: any) {
        console.error("Vercel fetch failed for HubPage");
        const status = e.response?.status;
        const msg = e.response?.data?.error?.message || e.message;
        setError(`CRITICAL ERROR [${status || 'NET'}]: ${msg}`);
      } finally {
        setLoading(false);
      }
    }
    fetchVercel();
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 bg-editorial-bg z-[100] flex items-center justify-center p-20 overflow-hidden">
        <div className="max-w-4xl w-full border-l-8 border-red-600 pl-12">
          <h2 className="text-[10px] uppercase tracking-[1em] font-bold text-red-600 mb-8">System Access Forbidden</h2>
          <h1 className="font-serif text-6xl italic leading-tight text-editorial-ink mb-12">
            Failed to establish secure link with Vercel Edge.
          </h1>
          <div className="space-y-6 border-t border-editorial-border pt-12">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest opacity-40">Diagnostic Trace</span>
              <span className="text-sm font-mono text-red-600 font-bold">{error}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest opacity-40">Active Project ID</span>
              <span className="text-sm font-mono bg-zinc-100 px-3 py-1 font-bold">{diagId}</span>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-16 px-12 py-5 bg-red-600 text-white text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-editorial-ink transition-all"
          >
            Retry Synchronization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12">
      <header className="mb-16 border-b-2 border-editorial-ink pb-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-serif text-8xl italic leading-none mb-4">The Hub</h1>
            <p className="text-[10px] tracking-[0.4em] uppercase opacity-50">Master Command Center / Genesis 2.0</p>
          </div>
          <div className="text-right pb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Node Status</span>
            <p className="text-xl font-serif italic">Operational</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: System Pulse */}
        <div className="lg:col-span-2 space-y-12">
          <section className="bg-editorial-pane p-10 border border-editorial-border">
            <div className="flex items-center gap-4 mb-8">
              <Activity className="w-6 h-6" />
              <h2 className="font-serif text-4xl italic">System Pulse</h2>
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Infrastructure', value: 'Serverless', detail: 'Vercel Edge' },
                { label: 'Storage Engine', value: 'Git-Sourced', detail: 'SynCore-Media-2.0' },
                { label: 'Deployment State', value: 'Ready', detail: 'Awaiting Genesis' },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-end border-b border-editorial-border pb-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest opacity-40 font-bold mb-1">{stat.label}</p>
                    <p className="text-2xl font-serif italic">{stat.value}</p>
                  </div>
                  <span className="text-[10px] opacity-40 font-mono italic">{stat.detail}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Vercel Deployments */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] uppercase tracking-widest font-bold">Recent Deployments</span>
              <div className="h-px flex-1 bg-editorial-border mx-6"></div>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-20 bg-zinc-100 border border-editorial-border"></div>)}
                </div>
              ) : error ? (
                <div className="p-10 border border-red-600 bg-red-50 text-red-600">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Systémová Výstraha</span>
                  </div>
                  <p className="text-sm font-serif italic">{error}</p>
                </div>
              ) : deployments.length > 0 ? (
                deployments.map((dep) => (
                  <div key={dep.uid} className="flex items-center justify-between p-6 bg-white border border-editorial-border hover:border-editorial-ink transition-all">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest mb-1">{dep.name}</h3>
                      <p className="text-[10px] opacity-50 font-mono">{dep.url}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-widest px-3 py-1 border rounded-full",
                        dep.state === 'READY' ? "border-green-600 text-green-600" : "border-amber-600 text-amber-600"
                      )}>
                        {dep.state}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 border border-dashed border-editorial-border text-center opacity-30 text-[10px] uppercase tracking-[0.4em]">
                  No active deployments found.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Node Details */}
        <div className="space-y-6">
          {[
            { label: 'Compute', value: 'Alpha-01', status: 'Online', icon: Cpu },
            { label: 'Network', value: 'SynCore-Mesh', status: 'Standby', icon: Globe },
          ].map((node) => (
            <div key={node.label} className="border border-editorial-ink p-8 flex flex-col justify-between aspect-square">
              <node.icon className="w-8 h-8 mb-4 stroke-1" />
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-2">{node.label}</p>
                <p className="text-3xl font-serif italic mb-4">{node.value}</p>
                <div className="flex items-center gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full", node.status === 'Online' ? 'bg-green-500' : 'bg-amber-500')}></div>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">{node.status}</span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="p-8 bg-editorial-ink text-editorial-bg">
            <span className="text-[10px] uppercase tracking-widest font-bold block mb-4">Core Revision</span>
            <p className="text-4xl font-serif italic mb-2 tracking-tighter">Genesis 2.2</p>
            <p className="text-[9px] opacity-50 font-mono tracking-widest uppercase">Verified Deployment Protocol</p>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ID-END: SY-HUB-2.0-CORE */
