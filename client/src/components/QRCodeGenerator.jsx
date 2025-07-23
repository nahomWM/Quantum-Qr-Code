import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    MapPin,
    ChevronRight,
    ChevronLeft,
    Upload,
    File,
    X,
    Plus,
    Send
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

const steps = ['Select Type', 'Upload Content', 'Set Rules', 'Generate'];

const QRCodeGenerator = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [type, setType] = useState(null); // 'time' or 'location'
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = (acceptedFiles) => {
        setFiles(prev => [...prev, ...acceptedFiles.map(file => Object.assign(file, {
            id: Math.random().toString(36).substr(2, 9)
        }))]);
        toast.success('Files added successfully');
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className="max-w-4xl mx-auto py-20 px-4">
            {/* Stepper */}
            <div className="flex items-center justify-between mb-16 relative px-4">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 -z-10" />
                {steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${idx <= currentStep ? 'bg-primary-gradient text-white scale-110 shadow-lg shadow-indigo-500/20' : 'bg-gray-800 text-text-secondary'
                            }`}>
                            {idx + 1}
                        </div>
                        <span className={`text-sm font-medium ${idx <= currentStep ? 'text-white' : 'text-text-secondary'}`}>{step}</span>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="glass p-8 md:p-12 rounded-[2rem] min-h-[500px] flex flex-col">
                <AnimatePresence mode="wait">
                    {currentStep === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center">
                                <h2 className="text-4xl font-bold mb-4">Choose Intelligence Type</h2>
                                <p className="text-text-secondary text-lg">Select how your dynamic QR code will behave.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 pt-8">
                                {[
                                    { id: 'time', icon: Clock, title: 'Time-Based', desc: 'Deliver different content based on the time of day.', color: 'from-blue-500 to-indigo-600' },
                                    { id: 'location', icon: MapPin, title: 'Location-Based', desc: 'Redirect users based on their geographic location.', color: 'from-emerald-500 to-teal-600' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => { setType(item.id); nextStep(); }}
                                        className={`group relative p-8 glass rounded-3xl text-left transition-all duration-500 hover:scale-[1.02] ${type === item.id ? 'border-primary shadow-2xl shadow-indigo-500/10' : ''
                                            }`}
                                    >
                                        <div className={`p-4 bg-gradient-to-br ${item.color} rounded-2xl w-fit mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                                            <item.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                        <p className="text-text-secondary leading-relaxed">{item.desc}</p>
                                        {type === item.id && (
                                            <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 h-full flex flex-col"
                        >
                            <div className="text-center">
                                <h2 className="text-4xl font-bold mb-4">Upload Content</h2>
                                <p className="text-text-secondary text-lg">Add the files you want your QR code to serve.</p>
                            </div>

                            <div
                                {...getRootProps()}
                                className={`flex-1 min-h-[250px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer ${isDragActive ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <div className="p-6 bg-white/5 rounded-full border border-white/10">
                                    <Upload className="w-10 h-10 text-primary" />
                                </div>
                                <div className="text-center px-6">
                                    <p className="text-xl font-bold mb-1">Drag & drop files here</p>
                                    <p className="text-text-secondary">or click to browse from your device</p>
                                </div>
                            </div>

                            {files.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[200px] overflow-y-auto pr-2">
                                    {files.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-4 glass rounded-2xl group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                                    <File className="w-5 h-5 text-indigo-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold truncate max-w-[150px]">{file.name}</span>
                                                    <span className="text-xs text-text-secondary">{(file.size / 1024).toFixed(1)} KB</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                                                className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        {...getRootProps()}
                                        className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/10 rounded-2xl hover:bg-white/5 transition-all"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span className="text-sm font-bold">Add More</span>
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-8 mt-auto">
                                <button onClick={prevStep} className="flex items-center gap-2 px-8 py-4 glass rounded-2xl font-bold hover:bg-white/10 transition-all">
                                    <ChevronLeft className="w-5 h-5" /> Back
                                </button>
                                <button
                                    onClick={nextStep}
                                    disabled={files.length === 0}
                                    className="flex items-center gap-2 px-10 py-4 bg-primary-gradient rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] shadow-xl shadow-indigo-500/20 transition-all"
                                >
                                    Configure Rules <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Helper components that should be imported or moved
const Check = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

export default QRCodeGenerator;
