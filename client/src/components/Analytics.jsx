import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Globe,
    MapPin,
    Activity,
    Users,
    Search,
    RefreshCw,
    ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const Analytics = ({ qrId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await fetch(`https://smart-qr-worker.weldemdhinnahom.workers.dev/analytics/${qrId}`);
            const result = await res.json();
            setData(result);
        } catch (err) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (qrId) fetchAnalytics();
    }, [qrId]);

    if (!qrId) return (
        <div className="pt-40 text-center">
            <Search className="w-16 h-16 mx-auto mb-6 text-indigo-400 opacity-20" />
            <h2 className="text-3xl font-bold mb-4 opacity-50">No QR Selected</h2>
            <p className="text-text-secondary">Please generate or select a QR code to view its performance.</p>
        </div>
    );

    return (
        <div className="pt-32 pb-20 space-y-8">
            <div className="flex items-center justify-between mb-8 px-4">
                <div>
                    <h1 className="text-4xl font-black mb-2">Real-time Analytics</h1>
                    <p className="text-text-secondary flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Live tracking for ID: <span className="text-primary font-mono">{qrId}</span>
                    </p>
                </div>
                <button
                    onClick={fetchAnalytics}
                    className="p-4 glass rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3 font-bold"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {loading && !data ? (
                <div className="h-96 flex flex-col items-center justify-center gap-6">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-indigo-300 font-bold tracking-widest uppercase text-sm">Synchronizing Data...</p>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Total Scans', value: data?.total || 0, icon: Users, color: 'text-blue-400' },
                            { label: 'Unique Regions', value: Object.keys(data?.byCountry || {}).length, icon: Globe, color: 'text-purple-400' },
                            { label: 'Last Activity', value: data?.lastScan ? new Date(data.lastScan).toLocaleTimeString() : 'N/A', icon: Activity, color: 'text-emerald-400' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass p-8 rounded-[2rem] flex items-center gap-6"
                            >
                                <div className={`p-4 bg-white/5 rounded-2xl ${stat.color}`}>
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-text-secondary text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-3xl font-black mt-1">{stat.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Countries Breakdown */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass p-10 rounded-[3rem] space-y-8"
                        >
                            <h3 className="text-2xl font-bold items-center flex gap-3">
                                <Globe className="text-primary" /> Traffic By Country
                            </h3>
                            <div className="space-y-6">
                                {(data?.byCountry && Object.entries(data.byCountry).length > 0) ? (
                                    Object.entries(data.byCountry).map(([country, count], idx) => (
                                        <div key={idx} className="space-y-2">
                                            <div className="flex justify-between text-sm font-bold">
                                                <span>{country}</span>
                                                <span className="text-primary">{count} Scans</span>
                                            </div>
                                            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(count / data.total) * 100}%` }}
                                                    className="h-full bg-primary-gradient rounded-full"
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-text-secondary py-10 text-center italic">No country data available yet.</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Recent Scans */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass p-10 rounded-[3rem] space-y-8"
                        >
                            <h3 className="text-2xl font-bold items-center flex gap-3">
                                <Activity className="text-emerald-400" /> Recent Activity
                            </h3>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
                                {(data?.scans && data.scans.length > 0) ? (
                                    data.scans.slice().reverse().map((scan, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 glass-hover glass rounded-2xl transition-all border-none bg-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                    <MapPin className="w-5 h-5 text-emerald-400" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{scan.c}, {scan.ci}</p>
                                                    <p className="text-xs text-text-secondary">{new Date(scan.t).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-[10px] uppercase font-black text-text-secondary px-2 py-1 bg-white/5 rounded-md">
                                                {scan.ua.split(' ')[0]}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-text-secondary py-10 text-center italic">Awaiting first scan...</p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Analytics;
