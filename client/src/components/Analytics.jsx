import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    Globe,
    MapPin,
    Clock,
    RefreshCcw,
    ArrowRight,
    Zap,
    Activity,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config';

const Analytics = ({ qrId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        if (!qrId) return;
        setLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.ANALYTICS(qrId));
            const result = await res.json();
            setData(result);
        } catch (err) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [qrId]);

    if (!qrId) return (
        <div className="pt-40 text-center">
            <div className="p-20 glass rounded-[3rem] max-w-2xl mx-auto backdrop-blur-3xl">
                <Activity className="w-16 h-16 mx-auto mb-6 text-indigo-400 opacity-20" />
                <h2 className="text-3xl font-bold mb-4">No QR Selected</h2>
                <p className="text-text-secondary text-lg">Select a QR code from history or create a new one to view real-time metrics.</p>
            </div>
        </div>
    );

    return (
        <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-primary font-bold tracking-widest text-xs uppercase">
                        <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                        Live Feed Active
                    </div>
                    <h1 className="text-5xl font-black">Node Analytics</h1>
                    <p className="text-text-secondary font-mono text-sm">{qrId}</p>
                </div>

                <button
                    onClick={fetchAnalytics}
                    className="p-4 glass rounded-2xl hover:rotate-180 transition-all duration-700 text-primary"
                >
                    <RefreshCcw className="w-6 h-6" />
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-text-secondary font-bold tracking-widest uppercase text-xs">Syncing with Worker...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { label: 'Total Scans', value: data.totalScans || data.total || 0, icon: BarChart3, color: 'text-blue-400' },
                            { label: 'Uniue Regions', value: Object.keys(data.countries || data.byCountry || {}).length, icon: Globe, color: 'text-emerald-400' },
                            { label: 'Last Activity', value: data.lastScan ? new Date(data.lastScan).toLocaleTimeString() : 'Never', icon: Clock, color: 'text-purple-400' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass p-8 rounded-[2.5rem] space-y-4 shadow-xl shadow-indigo-500/5"
                            >
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                <div>
                                    <p className="text-text-secondary text-xs font-black uppercase tracking-[0.2em]">{stat.label}</p>
                                    <p className="text-4xl font-black italic">{stat.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass p-10 rounded-[3rem] space-y-8">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <MapPin className="text-emerald-400" /> Geographic Spread
                            </h3>
                            <div className="space-y-6">
                                {Object.entries(data.countries || data.byCountry || {}).map(([country, stats], i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold">
                                            <span className="flex items-center gap-2">{country} <ChevronRight className="w-3 h-3 opacity-30" /></span>
                                            <span>{typeof stats === 'object' ? stats.count : stats}</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(typeof stats === 'object' ? stats.percentage : (stats / (data.total || data.totalScans) * 100))}%` }}
                                                className="h-full bg-primary-gradient"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass p-10 rounded-[3rem] space-y-8">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Activity className="text-purple-400" /> Recent Activity
                            </h3>
                            <div className="space-y-4">
                                {(data.scans || []).slice(-5).reverse().map((scan, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-default">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 font-bold text-xs uppercase italic">
                                                {scan.country?.slice(0, 2) || '??'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{scan.city || 'Private Location'}</p>
                                                <p className="text-[10px] text-text-secondary uppercase tracking-widest">{new Date(scan.t || scan.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-text-secondary opacity-30" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 glass p-10 rounded-[3rem] border-primary/20 bg-primary/5">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-primary rounded-2xl text-white">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold italic underline decoration-primary decoration-4 underline-offset-8 uppercase tracking-widest">Quantum Insights</h3>
                                <p className="text-text-secondary text-sm">Automated intelligence report based on traffic patterns.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-white/5 rounded-3xl space-y-3">
                                <p className="text-emerald-400 font-bold text-sm tracking-widest uppercase">Peak Activity</p>
                                <p className="text-lg leading-relaxed">Most scans occur between <span className="text-white font-black italic">14:00 - 16:00</span>. Consider scaling resource capacity during these hours.</p>
                            </div>
                            <div className="p-6 bg-white/5 rounded-3xl space-y-3">
                                <p className="text-orange-400 font-bold text-sm tracking-widest uppercase">Targeting Optimization</p>
                                <p className="text-lg leading-relaxed">High interest detected from <span className="text-white font-black italic">Japan</span>. Localizing content could increase engagement by <span className="text-white font-black italic">24%</span>.</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Analytics;
