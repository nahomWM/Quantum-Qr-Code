import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Video, Zap, FileVideo, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const VideoCompressor = ({ onCompressed }) => {
    const [videoFile, setVideoFile] = useState(null);
    const [compressing, setCompressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const ffmpegRef = useRef(new FFmpeg());

    const loadFFmpeg = async () => {
        const ffmpeg = ffmpegRef.current;
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
    };

    const compress = async () => {
        if (!videoFile) return;
        setCompressing(true);
        setProgress(0);

        try {
            await loadFFmpeg();
            const ffmpeg = ffmpegRef.current;

            ffmpeg.on('progress', ({ progress }) => {
                setProgress(Math.round(progress * 100));
            });

            await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

            // Compression command - scale down and reduce bitrate
            await ffmpeg.exec(['-i', 'input.mp4', '-vcodec', 'libx264', '-crf', '28', '-s', '720x480', 'output.mp4']);

            const data = await ffmpeg.readFile('output.mp4');
            const compressedBlob = new Blob([data.buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(compressedBlob);

            const compressedFile = new File([compressedBlob], `compressed_${videoFile.name}`, { type: 'video/mp4' });

            setResult({ url, size: compressedFile.size });
            toast.success('Video compressed successfully!');
            if (onCompressed) onCompressed(compressedFile);
        } catch (err) {
            toast.error('Compression failed');
            console.error(err);
        } finally {
            setCompressing(false);
        }
    };

    return (
        <div className="glass p-10 rounded-[3rem] space-y-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400">
                    <Video className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Quantum Compressor</h2>
                    <p className="text-text-secondary text-sm">Optimize videos before attaching to QR codes.</p>
                </div>
            </div>

            {!videoFile ? (
                <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/10 rounded-[2rem] hover:bg-white/5 transition-all cursor-pointer group">
                    <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => setVideoFile(e.target.files[0])}
                    />
                    <FileVideo className="w-12 h-12 text-text-secondary group-hover:text-purple-400 mb-4 transition-colors" />
                    <p className="font-bold">Select Video File</p>
                    <p className="text-xs text-text-secondary mt-2 text-center px-8">Supports MP4, MOV, and AVI up to 100MB.</p>
                </label>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 glass rounded-2xl">
                        <div className="flex items-center gap-3">
                            <FileVideo className="text-purple-400" />
                            <span className="font-bold truncate max-w-[200px]">{videoFile.name}</span>
                        </div>
                        <button onClick={() => { setVideoFile(null); setResult(null); }} className="text-text-secondary hover:text-white">Change</button>
                    </div>

                    {!result && (
                        <button
                            onClick={compress}
                            disabled={compressing}
                            className="w-full py-5 bg-primary-gradient rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                        >
                            {compressing ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Compressing {progress}%
                                </>
                            ) : (
                                <>
                                    <Zap className="w-6 h-6" /> Start Compression
                                </>
                            )}
                        </button>
                    )}

                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 space-y-4"
                        >
                            <div className="flex justify-between items-center text-emerald-400">
                                <span className="font-bold flex items-center gap-2">
                                    <Download className="w-5 h-5" /> Optimized
                                </span>
                                <span className="text-xs">{(result.size / 1024 / 1024).toFixed(1)} MB</span>
                            </div>
                            <a
                                href={result.url}
                                download={`compressed_${videoFile.name}`}
                                className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all"
                            >
                                Download PNG
                            </a>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VideoCompressor;
