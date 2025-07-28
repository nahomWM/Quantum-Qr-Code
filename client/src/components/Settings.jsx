import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings as SettingsIcon,
    Globe,
    Shield,
    Bell,
    Zap,
    Save,
    RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
    const [config, setConfig] = useState({
        workerUrl: localStorage.getItem('worker_url') || 'https://smart-qr-worker.weldemdhinnahom.workers.dev',
        autoSave: true,
        notifications: true,
        highPerformance: true
    });

    const handleSave = () => {
        localStorage.setItem('worker_url', config.workerUrl);
        toast.success('Settings synchronized successfully');
    };

    const reset = () => {
        const defaultUrl = 'https://smart-qr-worker.weldemdhinnahom.workers.dev';
        setConfig({ ...config, workerUrl: defaultUrl });
        localStorage.setItem('worker_url', defaultUrl);
        toast('Settings restored to default');
    };

    return (
        <div className="max-w-4xl mx-auto pt-32 pb-20 px-4">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-black mb-2">Preferences</h1>
                    <p className="text-text-secondary">Control your quantum environment and API connections.</p>
                </div>
                <SettingsIcon className="w-10 h-10 text-indigo-400 opacity-20" />
            </div>

            <div className="space-y-6">
                {/* API Settings */}
                <div className="glass p-10 rounded-[3rem] space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold">API Configuration</h2>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-text-secondary uppercase tracking-widest px-1">Worker Endpoint URL</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={config.workerUrl}
                                onChange={(e) => setConfig({ ...config, workerUrl: e.target.value })}
                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all font-mono text-sm"
                            />
                            <button
                                onClick={handleSave}
                                className="px-8 bg-primary-gradient rounded-2xl font-bold flex items-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-indigo-500/20"
                            >
                                <Save className="w-5 h-5" /> Save
                            </button>
                        </div>
                        <p className="text-xs text-text-secondary px-1">
                            This URL is used for all file uploads, metadata storage, and analytics tracking.
                        </p>
                    </div>
                </div>

                {/* Behavior Settings */}
                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        { id: 'notifications', title: 'Smart Notifications', desc: 'Real-time alerts for scan activity.', icon: Bell, color: 'text-emerald-400' },
                        { id: 'highPerformance', title: 'Quantum Engine', desc: 'Accelerated processing for large assets.', icon: Zap, color: 'text-purple-400' },
                        { id: 'autoSave', title: 'Local Persistence', desc: 'Sync history across sessions.', icon: Shield, color: 'text-blue-400' }
                    ].map((item) => (
                        <div key={item.id} className="glass p-8 rounded-[2.5rem] flex items-center justify-between">
                            <div className="flex items-center gap-4 text-left">
                                <div className={`p-3 bg-white/5 rounded-2xl ${item.color}`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{item.title}</h3>
                                    <p className="text-xs text-text-secondary">{item.desc}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setConfig({ ...config, [item.id]: !config[item.id] })}
                                className={`w-14 h-8 rounded-full transition-all relative ${config[item.id] ? 'bg-indigo-500' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${config[item.id] ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={reset}
                        className="glass p-8 rounded-[2.5rem] flex items-center gap-4 text-left hover:bg-white/5 transition-all group"
                    >
                        <div className="p-3 bg-white/5 rounded-2xl text-text-secondary group-hover:rotate-180 transition-transform duration-500">
                            <RotateCcw className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold">Reset Defaults</h3>
                            <p className="text-xs text-text-secondary">Wipe all custom configurations.</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
