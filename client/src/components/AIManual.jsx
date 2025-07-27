import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Search,
    MessageSquare,
    ChevronRight,
    Terminal,
    Zap,
    Shield,
    Layers
} from 'lucide-react';

const docs = [
    {
        category: 'Getting Started',
        items: [
            { title: 'What are Dynamic QRs?', content: 'Dynamic QR codes allow you to change the destination URL without changing the QR code itself. SmartQR takes this further by adding logic.', icon: Zap },
            { title: 'Setting up your first code', content: 'Choose between Time or Location based redirection in the Create tab.', icon: BookOpen }
        ]
    },
    {
        category: 'Advanced Logic',
        items: [
            { title: 'Time-Based Redirection', content: 'Set specific time ranges (e.g., 09:00 - 17:00) to serve different files. Ideal for restaurant menus (Breakfast vs Lunch).', icon: Terminal },
            { title: 'Geo-Fencing Logic', content: 'Detect user country and serve localized content automatically.', icon: Layers }
        ]
    },
    {
        category: 'Security & Privacy',
        items: [
            { title: 'Data Encryption', content: 'All files are securely stored on Backblaze B2 with encrypted metadata.', icon: Shield },
            { title: 'Analytics Privacy', content: 'We track regions, not individuals. High-level insights without compromising user trust.', icon: MessageSquare }
        ]
    }
];

const AIManual = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopic, setSelectedTopic] = useState(null);

    const filteredDocs = docs.map(cat => ({
        ...cat,
        items: cat.items.filter(i =>
            i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.items.length > 0);

    return (
        <div className="max-w-6xl mx-auto pt-32 pb-20 px-4">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-black mb-6">AI Knowledge Base</h1>
                <p className="text-text-secondary text-xl max-w-2xl mx-auto">
                    Everything you need to master the art of dynamic redirection.
                </p>
            </div>

            <div className="relative max-w-2xl mx-auto mb-20">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <Search className="text-primary w-6 h-6" />
                </div>
                <input
                    type="text"
                    placeholder="Search for logic, security, or setup guides..."
                    className="w-full bg-white/5 border border-white/10 rounded-full py-6 pl-16 pr-8 text-lg focus:outline-none focus:border-primary transition-all backdrop-blur-xl"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {filteredDocs.map((category, idx) => (
                    <div key={idx} className="space-y-6">
                        <h2 className="text-xs uppercase tracking-[0.3em] font-black text-text-secondary px-4">
                            {category.category}
                        </h2>
                        <div className="space-y-4">
                            {category.items.map((item, i) => (
                                <motion.button
                                    key={i}
                                    layoutId={`${idx}-${i}`}
                                    onClick={() => setSelectedTopic(item)}
                                    className="w-full glass p-6 rounded-3xl text-left hover:bg-white/10 transition-all group border-none"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                            <div className="flex items-center gap-1 text-xs text-text-secondary group-hover:text-primary transition-colors">
                                                Read more <ChevronRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedTopic && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTopic(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div
                            layoutId={selectedTopic.title}
                            className="glass max-w-2xl w-full p-10 md:p-16 rounded-[4rem] relative z-10"
                        >
                            <div className="p-5 bg-primary/10 rounded-[2.5rem] w-fit mb-8">
                                <selectedTopic.icon className="w-12 h-12 text-primary" />
                            </div>
                            <h2 className="text-4xl font-black mb-6">{selectedTopic.title}</h2>
                            <div className="text-text-secondary text-lg leading-relaxed space-y-4 mb-10">
                                <p>{selectedTopic.content}</p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedTopic(null)}
                                className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all"
                            >
                                Close Portal
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIManual;
