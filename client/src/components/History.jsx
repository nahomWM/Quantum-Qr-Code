import React from 'react';
import { motion } from 'framer-motion';
import {
    History as HistoryIcon,
    ExternalLink,
    Trash2,
    BarChart3,
    Calendar,
    Clock,
    MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

const History = ({ history, onSelect, onDelete }) => {
    if (history.length === 0) return (
        <div className="pt-40 text-center">
            <div className="p-10 glass rounded-[3rem] max-w-xl mx-auto border-dashed border-2">
                <HistoryIcon className="w-20 h-20 mx-auto mb-6 text-indigo-400 opacity-20" />
                <h2 className="text-3xl font-bold mb-4">No History Yet</h2>
                <p className="text-text-secondary text-lg">Your generated QR codes will appear here for quick access and analytics.</p>
            </div>
        </div>
    );

    return (
        <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-4xl font-black">Generation History</h1>
                <span className="px-4 py-2 glass rounded-xl text-sm font-bold text-primary bg-primary/5">
                    {history.length} Items
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group glass p-6 rounded-[2.5rem] flex flex-col hover:scale-[1.02] transition-all"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className={`p-4 rounded-2xl bg-white/5 ${item.data.type === 'time' ? 'text-blue-400' : 'text-emerald-400'}`}>
                                {item.data.type === 'time' ? <Clock className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onSelect(item.id)}
                                    className="p-3 glass rounded-xl hover:bg-white/10 text-indigo-400"
                                    title="View Analytics"
                                >
                                    <BarChart3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="p-3 glass rounded-xl hover:bg-red-500/10 text-red-400"
                                    title="Delete"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-2 truncate pr-4 text-white">
                            {item.id.substring(0, 12)}...
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-text-secondary font-bold mb-6">
                            <Calendar className="w-3.4 h-3.4" />
                            {new Date().toLocaleDateString()} {/* Replace with item.createdAt if stored */}
                            <span className="w-1 h-1 bg-white/10 rounded-full" />
                            <span className="uppercase tracking-widest">{item.data.type} Redirection</span>
                        </div>

                        <div className="mt-auto space-y-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono text-[10px] truncate text-indigo-300">
                                {item.url}
                            </div>
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all"
                            >
                                Open Dynamic Link <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default History;
