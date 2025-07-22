import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  BarChart3,
  Settings,
  Layout,
  Zap,
  ShieldCheck,
  Globe,
  PlusCircle,
  History
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Temporary components (will move to separate files)
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
        { id: 'history', icon: History, label: 'History' },
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
  <section className="pt-40 pb-20 px-4 flex flex-col items-center text-center">
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

      <p className="max-w-2xl text-xl text-text-secondary mb-12">
        Experience the next generation of smart QR codes. Dynamic content delivery based on
        time, location, and device intelligence.
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        <button className="px-10 py-5 bg-primary-gradient rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all">
          Start Generating
        </button>
        <button className="px-10 py-5 glass rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
          View Demo
        </button>
      </div>
    </motion.div>
  </section>
);

function App() {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="min-h-screen relative">
      {/* Background Orbs */}
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
              {/* Future: QR Generation Grid */}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pt-40"
            >
              <div className="glass p-12 rounded-3xl text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-6 text-indigo-400" />
                <h2 className="text-3xl font-bold mb-4">Analytics Dashboard</h2>
                <p className="text-text-secondary">Scan a QR code to see live movement and usage data.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-20 text-center text-text-secondary text-sm">
        <p>© 2025 SmartQR Labs. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
