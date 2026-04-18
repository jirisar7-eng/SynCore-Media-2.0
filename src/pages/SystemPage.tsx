import React, { useState } from 'react';
import { Settings, Shield, Globe, Terminal } from 'lucide-react';
import axios from 'axios';
import { cn } from '../lib/utils';

/* ID-START: SY-SYSTEM-2.0-CORE */
export default function SystemPage() {
  const [diagnostics, setDiagnostics] = useState<{ [key: string]: 'idle' | 'checking' | 'valid' | 'invalid' }>({
    GitHub: 'idle',
    Vercel: 'idle'
  });
  const [vercelUser, setVercelUser] = useState<string | null>(null);

  const checkConnection = async (type: 'GitHub' | 'Vercel') => {
    setDiagnostics(prev => ({ ...prev, [type]: 'checking' }));
    try {
      if (type === 'GitHub') {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        const owner = import.meta.env.VITE_GITHUB_REPO_OWNER;
        await axios.get(`https://api.github.com/users/${owner}`, {
          headers: { Authorization: `token ${token}` }
        });
      } else {
        const token = import.meta.env.VITE_VERCEL_TOKEN;
        const projectId = import.meta.env.VITE_VERCEL_PROJECT_ID;
        const teamId = import.meta.env.VITE_VERCEL_TEAM_ID;
        
        // Step 1: Basic user check
        const res = await axios.get('https://api.vercel.com/v2/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVercelUser(res.data.user.username);

        // Step 2: Project access check (if projectId exists)
        if (projectId) {
          await axios.get(`https://api.vercel.com/v9/projects/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: teamId ? { teamId } : {}
          });
        }
      }
      setDiagnostics(prev => ({ ...prev, [type]: 'valid' }));
    } catch (e: any) {
      console.error(`${type} Diagnostic Failed:`, e.response?.data || e.message);
      setDiagnostics(prev => ({ ...prev, [type]: 'invalid' }));
      if (type === 'Vercel') setVercelUser('ERROR');
    }
  };

  const configs = [
    { label: 'GitHub Engine', key: 'VITE_GITHUB_TOKEN', icon: Shield, type: 'GitHub' as const },
    { label: 'Vercel Edge', key: 'VITE_VERCEL_TOKEN', icon: Globe, type: 'Vercel' as const },
    { label: 'System Kernel', key: 'NODE_ENV', icon: Terminal, status: 'PROD' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12">
      <header className="mb-16 border-b-2 border-editorial-ink pb-8">
        <h1 className="font-serif text-8xl italic leading-none mb-4">System</h1>
        <p className="text-[10px] tracking-[0.4em] uppercase opacity-50 flex items-center gap-4">
          Core Engine Configuration <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {configs.map((config) => (
          <div key={config.key} className="flex items-center justify-between p-8 bg-white border border-editorial-border group hover:border-editorial-ink transition-all">
            <div className="flex items-center gap-8">
              <config.icon className="w-6 h-6 opacity-30 group-hover:opacity-100 transition-opacity" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-1">{config.label}</h3>
                <div className="flex items-center gap-2">
                  <code className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded opacity-60 font-mono">{config.key}</code>
                  {config.type === 'Vercel' && vercelUser && (
                    <span className={cn(
                      "text-[9px] font-mono px-2 py-0.5 rounded",
                      vercelUser === 'ERROR' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                    )}>
                      {vercelUser === 'ERROR' ? 'AUTH_FAIL' : `@${vercelUser}`}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {config.type ? (
                <button
                  onClick={() => checkConnection(config.type!)}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-6 py-2 border transition-all",
                    diagnostics[config.type] === 'valid' ? "border-green-600 text-green-600" :
                    diagnostics[config.type] === 'invalid' ? "border-red-600 text-red-600" :
                    "border-editorial-border hover:border-editorial-ink"
                  )}
                >
                  {diagnostics[config.type] === 'checking' ? 'Validating...' : 
                   diagnostics[config.type] === 'valid' ? 'Verified' :
                   diagnostics[config.type] === 'invalid' ? 'Failed' : 'Run Diagnostic'}
                </button>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 px-6 py-2 border border-dashed border-editorial-border">
                  {config.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-20 pt-8 border-t border-editorial-border flex justify-between items-end">
        <div className="max-w-xs">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-2">Bypass Cache Strategy</p>
          <p className="text-xs opacity-60 leading-relaxed italic font-serif">
            Force Deploy mode modifies file hashes locally before pushing to ensure GitHub accepts the commit and Vercel triggers a fresh build cycle.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-2">Manifest Integrity</p>
          <code className="text-[8px] opacity-40">SY-CORE-2.0-BLUEPRINT-VERIFIED</code>
        </div>
      </footer>
    </div>
  );
}
/* ID-END: SY-SYSTEM-2.0-CORE */
