import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  BarChart3,
  Settings,
  Zap,
  PlusCircle,
  History as HistoryIcon
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import QRCodeGenerator from './components/QRCodeGenerator';
import Analytics from './components/Analytics';
import History from './components/History';
import VideoCompressor from './components/VideoCompressor';

const Navbar = ({ activeTab, setActiveTab }) => (
  <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl px-8 py-4 glass rounded-3xl flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="p-2 bg-primary-gradient rounded-xl shadow-lg shadow-indigo-500/20">
        <QrCode className="w-6 h-6 text-white" />
      </div>
      <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-primary-gradient">
        SmartQR
      </span>
    </div>

    <div className="flex items-center gap-1 md:gap-4">
      {[
        { id: 'create', icon: PlusCircle, label: 'Create' },
        { id: 'history', icon: HistoryIcon, label: 'History' },
        { id: 'tools', icon: Zap, label: 'Tools' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        { id: 'settings', icon: Settings, label: 'Settings' }
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${activeTab === item.id
            ? 'bg-primary-gradient text-white shadow-lg shadow-indigo-500/30'
            : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            }`}
        >
          <item.icon className="w-5 h-5" />
          <span className="hidden md:block font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

const Hero = () => (
  <section className="pt-40 pb-10 px-4 flex flex-col items-center text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md">
        <Zap className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-purple-200">Quantum Dynamic QR Redirection</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
        Redirect Anything,<br />
        <span className="bg-clip-text text-transparent bg-primary-gradient">Anytime, Anywhere.</span>
      </h1>

      <p className="max-w-2xl text-xl text-text-secondary">
        Experience the next generation of smart QR codes. Dynamic content delivery based on
        time, location, and device intelligence.
      </p>
    </motion.div>
  </section>
);

function App() {
  const [activeTab, setActiveTab] = useState('create');
  const [lastGeneratedId, setLastGeneratedId] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('qr_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('qr_history', JSON.stringify(history));
  }, [history]);

  const handleGenerateSuccess = (id) => {
    // Note: In a real app, you'd fetch the full meta or pass it from Generator
    setHistory(prev => [{ id, url: `https://smart-qr-worker.weldemdhinnahom.workers.dev/qr/${id}`, data: { type: 'dynamic' } }, ...prev]);
    setLastGeneratedId(id);
    setActiveTab('analytics');
  };

  const deleteFromHistory = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast.success('Removed from history');
  };

  const selectFromHistory = (id) => {
    setLastGeneratedId(id);
    setActiveTab('analytics');
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      <Toaster position="bottom-right" />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container mx-auto max-w-7xl px-4">
        <AnimatePresence mode="wait">
          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Hero />
              <QRCodeGenerator onGenerateSuccess={handleGenerateSuccess} />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <Analytics qrId={lastGeneratedId} />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <History
                history={history}
                onSelect={selectFromHistory}
                onDelete={deleteFromHistory}
              />
            </motion.div>
          )}

          {activeTab === 'tools' && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-40"
            >
              <VideoCompressor />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-40 text-center"
            >
              <div className="glass p-20 rounded-[3rem] max-w-2xl mx-auto">
                <Settings className="w-16 h-16 mx-auto mb-6 text-indigo-400 opacity-20" />
                <h2 className="text-3xl font-bold mb-4">Module Under Development</h2>
                <p className="text-text-secondary text-lg">We are preparing something special for this section. Stay tuned.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-20 text-center text-text-secondary text-sm">
        <p>© 2025 SmartQR Labs. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
