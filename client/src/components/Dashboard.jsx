import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    Users,
    Globe,
    Zap,
    Activity,
    ArrowUpRight
} from 'lucide-react';
import { API_ENDPOINTS } from '../config';

const Dashboard = ({ history }) => {
    const [stats, setStats] = useState({
        totalScans: 0,
        uniqueQRs: history.length,
        activeRegions: 0,
        growth: '+12%',
        scansByDay: [4, 8, 15, 12, 25, 30, 45] // Mock data for trend
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchGlobalStats = async () => {
            setLoading(true);
            let total = 0;
            const countries = new Set();

            try {
                await Promise.all(history.map(async (item) => {
                    const res = await fetch(API_ENDPOINTS.ANALYTICS(item.id));
                    const data = await res.json();
                    total += data.totalScans || data.total || 0;
                    if (data.byCountry) Object.keys(data.byCountry).forEach(c => countries.add(c));
                    if (data.countries) Object.keys(data.countries).forEach(c => countries.add(c));
                }));

                setStats(prev => ({
                    ...prev,
                    totalScans: total,
                    activeRegions: countries.size,
                    uniqueQRs: history.length
                }));
            } catch (err) {
                console.error('Failed to fetch global stats', err);
            } finally {
                setLoading(false);
            }
        };

        if (history.length > 0) fetchGlobalStats();
    }, [history]);

    return (
        <div className="pt-32 pb-20 space-y-12 max-w-7xl mx-auto px-4">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black mb-3">Project Overview</h1>
                    <p className="text-text-secondary text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        System is operational across {stats.uniqueQRs} active smart-endpoints.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="glass px-6 py-4 rounded-3xl flex items-center gap-4">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="font-bold text-sm tracking-widest uppercase">Live Engine</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Scans', value: stats.totalScans, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Active Regions', value: stats.activeRegions, icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Dynamic Nodes', value: stats.uniqueQRs, icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'Avg Growth', value: stats.growth, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-8 rounded-[2.5rem] space-y-4 hover:scale-[1.02] transition-all cursor-default"
                    >
                        <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl w-fit`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-text-secondary text-xs font-black uppercase tracking-[0.2em]">{stat.label}</p>
                                    <span className="text-[10px] font-bold text-emerald-400">↑ {stat.growth || '8%'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-4xl font-black italic">{stat.value}</span>
                                    <ArrowUpRight className="w-5 h-5 opacity-20" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 glass-hover glass p-10 rounded-[3.5rem] space-y-8"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                            <BarChart3 className="text-primary" /> Traffic Analysis
                        </h3>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold">7D</span>
                            <span className="px-3 py-1 bg-primary text-white rounded-lg text-[10px] font-bold shadow-lg shadow-indigo-500/20">30D</span>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4 px-4">
                        {stats.scansByDay.map((val, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-4">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${val * 2}px` }}
                                    className="w-full max-w-[40px] bg-primary-gradient rounded-xl shadow-lg shadow-indigo-500/10 relative group"
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass px-2 py-1 rounded-lg text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                        {val}
                                    </div>
                                </motion.div>
                                <span className="text-[10px] font-black italic text-text-secondary">DAY {idx + 1}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-10 rounded-[3.5rem] bg-indigo-600/5 border-primary/20 flex flex-col items-center justify-center text-center space-y-6"
                >
                    <div className="p-8 bg-primary/10 rounded-full animate-float">
                        <Zap className="w-12 h-12 text-primary fill-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Quantum Ready</h3>
                    <p className="text-text-secondary leading-relaxed">
                        Your dynamic redirection engine is optimized for high-traffic scenarios. Global latency is currently at <span className="text-white font-bold">42ms</span>.
                    </p>
                    <button className="w-full py-4 bg-primary-gradient rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:scale-[1.02] transition-all">
                        System Diagnostics
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
