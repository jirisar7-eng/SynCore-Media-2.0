import React, { useState } from 'react';
import { Search, Download, Play, Film, Loader2 } from 'lucide-react';
import { MediaAPI } from '../api/MediaAPI';
import { useDownload } from '../context/DownloadContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

/* ID-START: SYN_MEDIA_ENGINE_EMERGENCY */
export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const { startDownload, endDownload } = useDownload();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsSearching(true);
    try {
      const data = await MediaAPI.searchMedia(query);
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const start_extraction = async () => {
    if (!query) return;
    setIsExtracting(true);
    console.log(`[SYNC CONSOLE] Starting extraction sequence for: ${query}`);
    
    // Simulating deep extraction process
    await new Promise(r => setTimeout(r, 1500));
    
    try {
      const data = await MediaAPI.searchMedia(query);
      setResults(data);
      console.log(`[SYNC CONSOLE] Extraction complete. ${data.length} nodes identified.`);
    } catch (e) {
      console.error("[SYNC CONSOLE] Extraction failure.");
    } finally {
      setIsExtracting(false);
    }
  };

  const initiateDownload = async (id: string) => {
    startDownload();
    console.log(`[SYNC CONSOLE] Initializing download stream for ID: ${id}`);
    try {
      await MediaAPI.startDownload(id);
      alert(`Media extracted and download ready for ID: ${id}`);
    } catch (e) {
      console.error("Download failed");
    } finally {
      setTimeout(endDownload, 3000); 
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 min-h-[calc(100vh-144px)]">
      <header className="mb-20 border-b-2 border-editorial-ink pb-12 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-9xl italic leading-none mb-6 -tracking-wider uppercase">EXTRACTOR</h1>
          <p className="text-[10px] tracking-[0.5em] uppercase opacity-50 font-bold">SYNCORE MEDIA EXTRACTOR / ACTIVE HUB</p>
        </div>
        <div className="pb-2">
          <span className="text-[9px] font-mono opacity-30 uppercase tracking-widest">Engine Status:</span>
          <p className="text-xl font-serif italic text-green-600">Primed & Ready</p>
        </div>
      </header>

      {/* Primary Search Interface */}
      <section className="mb-24 bg-editorial-ink p-16 text-editorial-bg shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-[0.6em] mb-8 opacity-40 font-bold">Signal Source Input</p>
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="flex-1 w-full text-left">
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Vlož URL (YT, FB, TikTok...)"
                className="w-full bg-transparent border-b-2 border-editorial-bg/20 text-4xl font-serif italic py-4 focus:outline-none focus:border-green-500 transition-all placeholder:opacity-20 translate-y-2"
              />
            </div>
            <button 
              onClick={start_extraction}
              disabled={isExtracting || !query}
              className={cn(
                "px-10 py-5 bg-green-500 text-editorial-ink text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-green-400 transition-all disabled:opacity-20 disabled:hover:bg-green-500 flex items-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.3)]",
                isExtracting && "animate-pulse"
              )}
            >
              {isExtracting ? <Loader2 className="w-4 h-4 animate-spin text-editorial-ink" /> : <Play className="w-4 h-4 fill-current text-editorial-ink" />}
              START DOWNLOAD
            </button>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section>
        <div className="flex items-center gap-4 mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Výsledky hledání</span>
          <div className="h-px flex-1 bg-editorial-border"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          <AnimatePresence mode="popLayout">
            {results.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video mb-6 overflow-hidden bg-zinc-200 border border-editorial-border">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-editorial-ink/0 group-hover:bg-editorial-ink/20 transition-all flex items-center justify-center">
                    <button 
                      onClick={() => initiateDownload(item.id)}
                      className="bg-white text-editorial-ink p-4 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                  </div>
                  <span className="absolute bottom-4 right-4 bg-editorial-ink text-editorial-bg text-[9px] px-2 py-1 font-mono">
                    {item.duration}
                  </span>
                </div>
                
                <h3 className="font-serif text-2xl italic mb-2 leading-tight group-hover:text-red-600 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between opacity-40 text-[9px] uppercase tracking-widest font-bold">
                  <span>Stream Source: Synthesis</span>
                  <span>ID: {item.id}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {results.length === 0 && !isSearching && (
            <div className="col-span-full py-20 text-center border border-dashed border-editorial-border">
              <Film className="w-12 h-12 mx-auto mb-4 opacity-10" />
              <p className="text-[10px] uppercase tracking-[0.4em] opacity-30 italic font-serif">
                System awaiting input sequence...
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
/* ID-END: SYN_MEDIA_ENGINE */
