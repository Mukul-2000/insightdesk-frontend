import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../config/socket';
import { Upload, FileAudio, CheckCircle2, Copy, Sparkles, AlertCircle } from 'lucide-react';

interface AgentUpdate {
    agent: 'Analyst' | 'Ghostwriter' | 'Newsletter' | 'Critic' | 'Complete' | null;
    status: string;
}

interface CampaignData {
    linkedInPost: string;
    twitterThread: string;
    newsletter: string;
}

export const StudioWorkspace = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState<AgentUpdate>({ agent: null, status: '' });
    const [activeTab, setActiveTab] = useState<'linkedin' | 'twitter' | 'newsletter'>('linkedin');
    const [result, setResult] = useState<CampaignData | null>(null);

    useEffect(() => {
        socket.on('agent-update', (data: AgentUpdate) => {
            setCurrentStep(data);
            if (data.agent === 'Complete') setLoading(false);
        });

        return () => {
            socket.off('agent-update');
        };
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setFile(e.target.files[0]);
    };

    const handleUploadAndProcess = async () => {
        if (!file) return;

        setLoading(true);
        setResult(null);
        setCurrentStep({ agent: 'Analyst', status: 'Uploading media asset...' });

        const formData = new FormData();
        formData.append('media', file);
        
        if (socket.id) {
            formData.append('socketId', socket.id);
        }

        try {
            const response = await axios.post(API_BASE_URL+'/api/v1/studio/repurpose', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.success) {
                setResult(response.data.data);
            }
        } catch (error) {
            console.error("Pipeline processing failed:", error);
            setCurrentStep({ agent: null, status: 'Error generating campaign.' });
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        // ⚡ Tightened layout: capped container width, shrank paddings & gap layout sizes
        <div className="w-full max-w-5xl mx-auto p-2 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-slate-100">
            
            {/* LEFT CONTROL COLUMN: Upload and Progress Tracking */}
            <div className="lg:col-span-5 flex flex-col gap-4">
                {/* ⚡ Softened Corners: Shifted to rounded-3xl with clean overflow clips */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-5 shadow-xl overflow-hidden">
                    <h2 className="text-base font-bold mb-3.5 flex items-center gap-2">
                        <Sparkles className="text-indigo-400" size={16} /> Content Studio
                    </h2>
                    
                    {/* Compact Drag & Drop Zone with rounded-2xl interior */}
                    <label className="border-2 border-dashed border-slate-700/80 hover:border-indigo-500 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all bg-slate-950/40">
                        <input type="file" accept="audio/*,video/*" className="hidden" onChange={handleFileChange} disabled={loading} />
                        {file ? <FileAudio className="text-indigo-400 animate-pulse" size={28} /> : <Upload className="text-slate-500" size={28} />}
                        <span className="text-xs font-semibold text-slate-300 text-center truncate max-w-[200px]">{file ? file.name : "Select Media File"}</span>
                        <span className="text-[10px] text-slate-500">MP3, MP4, WAV, M4A (Max 25MB)</span>
                    </label>

                    <button 
                        onClick={handleUploadAndProcess}
                        disabled={!file || loading}
                        className="w-full mt-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md cursor-pointer"
                    >
                        {loading ? 'Processing Pipeline...' : 'Generate Campaign'}
                    </button>
                </div>

                {/* REAL-TIME PIPELINE VISUAL STEPPER */}
                {currentStep.agent && (
                    <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-5 shadow-xl flex flex-col gap-3 overflow-hidden">
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pipeline Tracking Node</h3>
                        
                        <div className="flex flex-col gap-2">
                            {[
                                { key: 'Analyst', name: 'OpenAI Whisper ➡️ Gemini Analysis' },
                                { key: 'Ghostwriter', name: 'Groq Llama 3.3 Copy Draftsman' },
                                { key: 'Newsletter', name: 'Groq Llama 3.3 Newsletter Editor' },
                                { key: 'Critic', name: 'Gemini Flash Post-Critic Guard' }
                            ].map((step, idx) => {
                                const isCurrent = currentStep.agent === step.key;
                                const isComplete = currentStep.agent === 'Complete' || 
                                    (['Ghostwriter', 'Newsletter', 'Critic'].includes(currentStep.agent!) && idx === 0) ||
                                    (['Newsletter', 'Critic'].includes(currentStep.agent!) && idx === 1) ||
                                    (currentStep.agent === 'Critic' && idx === 2);

                                return (
                                    <div key={step.key} className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${isCurrent ? 'bg-indigo-950/40 border border-indigo-500/30' : 'bg-slate-950/30 border border-transparent'}`}>
                                        {isComplete ? <CheckCircle2 className="text-emerald-500 shrink-0" size={15} /> : isCurrent ? <div className="h-3.5 w-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" /> : <div className="h-3.5 w-3.5 rounded-full bg-slate-800 shrink-0" />}
                                        <div className="flex flex-col min-w-0">
                                            <span className={`text-xs font-medium truncate ${isCurrent ? 'text-indigo-300 font-semibold' : isComplete ? 'text-slate-400' : 'text-slate-600'}`}>{step.name}</span>
                                            {isCurrent && <span className="text-[10px] text-indigo-400/90 mt-0.5 truncate animate-pulse">{currentStep.status}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN: Interactive Content Workspace */}
            {/* ⚡ Restructured height: restricted layout sprawl using tight bounded properties */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800/80 rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[380px] max-h-[500px] w-full">
                {result ? (
                    <>
                        {/* Tab Switcher Navigation */}
                        <div className="flex border-b border-slate-800/60 bg-slate-950/40 p-2 gap-1.5">
                            {(['linkedin', 'twitter', 'newsletter'] as const).map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${activeTab === tab ? 'bg-slate-800 text-white border border-slate-700/60 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                                    {tab === 'twitter' ? 'X / Twitter' : tab}
                                </button>
                            ))}
                        </div>

                        {/* Text Workspace Content Area */}
                        <div className="p-5 flex-1 relative flex flex-col min-h-0">
                            <button 
                                onClick={() => copyToClipboard(activeTab === 'linkedin' ? result.linkedInPost : activeTab === 'twitter' ? result.twitterThread : result.newsletter)}
                                className="absolute top-4 right-4 p-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                                title="Copy to clipboard"
                            >
                                <Copy size={13} />
                            </button>

                            {/* Scrollable text container inside explicit boundaries */}
                            <div className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed overflow-y-auto pr-1 max-h-full">
                                {activeTab === 'linkedin' && result.linkedInPost}
                                {activeTab === 'twitter' && result.twitterThread}
                                {activeTab === 'newsletter' && result.newsletter}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-600 gap-2">
                        <AlertCircle size={24} className="text-slate-800" />
                        <p className="text-xs font-semibold text-slate-400">Workspace Empty</p>
                        <p className="text-[11px] max-w-xs text-slate-600 leading-normal">Upload a podcast or discussion media file to run the multi-cloud generation sequence.</p>
                    </div>
                )}
            </div>
        </div>
    );
};