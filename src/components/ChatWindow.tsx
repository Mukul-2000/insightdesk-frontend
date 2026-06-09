// import React, { useState, useEffect, useRef } from 'react';
// import { Send, Bot, User, Loader2, Paperclip } from 'lucide-react'; // ➕ Added Paperclip
// import { chatService } from '../services/api';
// import type { Message } from '../types/chat';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

// interface ChatWindowProps {
//     userId: string;
// }

// export const ChatWindow: React.FC<ChatWindowProps> = ({ userId }) => {
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [input, setInput] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [isUploading, setIsUploading] = useState(false); // ➕ Dynamic track for uploads
//     const [error, setError] = useState<string | null>(null);

//     const messagesEndRef = useRef<HTMLDivElement | null>(null);
//     const fileInputRef = useRef<HTMLInputElement | null>(null); // 🔑 Hidden Input Reference

//     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages, isLoading, isUploading]);

//     useEffect(() => {
//         const loadHistory = async () => {
//             try {
//                 setError(null);
//                 const history = await chatService.getChatHistory();
//                 setMessages(history);
//             } catch (err) {
//                 console.error(err);
//                 setError('Could not load chat history.');
//             }
//         };
//         loadHistory();
//     }, [userId]);

//     // ➕ File Ingestion Upload Handler
//     const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         setIsUploading(true);
//         setError(null);

//         const formData = new FormData();
//         formData.append('file', file); // Adjust string key match to match your Multer middleware 'file' tag

//         try {
//             const token = localStorage.getItem('token');
//             const response = await fetch(`${API_BASE_URL}/documents/ingest`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                     // Note: DO NOT specify Content-Type header here; fetch handles multi-part boundary parameters automatically
//                 },
//                 body: formData,
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to completely parse and vectorize document file.');
//             }

//             // Add a success confirmation card into your state conversation stream
//             setMessages((prev) => [
//                 ...prev,
//                 { userId, role: 'model', content: `Success! 🎉 System has fully vectorized and indexed your document: "${file.name}". You can now start querying against its data content dynamically.` }
//             ]);
//         } catch (err: any) {
//             setError(err.message || 'File ingestion failed.');
//         } finally {
//             setIsUploading(false);
//             if (fileInputRef.current) fileInputRef.current.value = ''; // Clean input
//         }
//     };

//     const handleSend = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!input.trim() || isLoading) return;

//         const userContent = input.trim();
//         setInput('');
//         setError(null);

//         const userMessage: Message = { userId, role: 'user', content: userContent };
//         setMessages((prev) => [...prev, userMessage]);
//         setIsLoading(true);

//         try {
//             const data = await chatService.sendMessage(userContent);
//             const modelMessage: Message = { userId, role: 'model', content: data.reply };
//             setMessages((prev) => [...prev, modelMessage]);
//         } catch (err) {
//             setError('Failed to get a response from the assistant.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="flex flex-col h-[600px] w-full max-w-3xl mx-auto border border-zinc-200 rounded-2xl bg-white shadow-xl overflow-hidden">
//             {/* Top Header Banner */}
//             <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center gap-3">
//                 <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
//                     <Bot size={20} />
//                 </div>
//                 <div>
//                     <h2 className="font-semibold text-zinc-800 text-sm md:text-base">InsightDesk RAG Assistant</h2>
//                     <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
//                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Context Engine Operational
//                     </p>
//                 </div>
//             </div>

//             {/* Messages Feed Area */}
//             <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-zinc-50/50">
//                 {error && (
//                     <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center font-medium border border-red-100">
//                         {error}
//                     </div>
//                 )}

//                 {messages.length === 0 && !isLoading && !isUploading && (
//                     <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400 space-y-2">
//                         <Bot size={40} className="stroke-1 text-zinc-300" />
//                         <p className="text-sm">No conversation history found.</p>
//                         <p className="text-xs max-w-xs">Attach a document using the paperclip or send a message to begin.</p>
//                     </div>
//                 )}

//                 {messages.map((msg, index) => {
//                     const isUser = msg.role === 'user';
//                     return (
//                         <div key={index} className={`flex gap-3 items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
//                             {!isUser && (
//                                 <div className="p-1.5 bg-white border border-zinc-200 rounded-lg text-zinc-600 shrink-0 shadow-xs">
//                                     <Bot size={16} />
//                                 </div>
//                             )}

//                             <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-xs ${isUser ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-zinc-800 border border-zinc-200/80 rounded-tl-none'
//                                 }`}>
//                                 {/* Update this block 👇 */}
//                                 {isUser ? (
//                                     msg.content
//                                 ) : (
//                                     <div className="prose prose-sm max-w-none text-zinc-800 break-words space-y-2">
//                                         <ReactMarkdown remarkPlugins={[remarkGfm]}>
//                                             {msg.content}
//                                         </ReactMarkdown>
//                                     </div>
//                                 )}
//                             </div>

//                             {isUser && (
//                                 <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
//                                     <User size={16} />
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 })}

//                 {/* Uploading Status */}
//                 {isUploading && (
//                     <div className="flex gap-3 items-start justify-start">
//                         <div className="p-1.5 bg-white border border-zinc-200 rounded-lg text-blue-600 shrink-0 shadow-xs animate-spin">
//                             <Loader2 size={16} />
//                         </div>
//                         <div className="bg-blue-50/50 text-blue-700 border border-blue-100 text-xs px-4 py-2.5 rounded-2xl rounded-tl-none shadow-xs font-medium italic">
//                             Parsing file chunks, extracting structural data text, and processing deep embedding weights...
//                         </div>
//                     </div>
//                 )}

//                 {isLoading && (
//                     <div className="flex gap-3 items-start justify-start">
//                         <div className="p-1.5 bg-white border border-zinc-200 rounded-lg text-zinc-400 shrink-0 shadow-xs animate-spin">
//                             <Loader2 size={16} />
//                         </div>
//                         <div className="bg-white text-zinc-400 border border-zinc-100 text-xs px-4 py-2.5 rounded-2xl rounded-tl-none shadow-xs font-medium italic">
//                             Analyzing text context windows...
//                         </div>
//                     </div>
//                 )}
//                 <div ref={messagesEndRef} />
//             </div>

//             {/* Input Form Footer */}
//             <form onSubmit={handleSend} className="p-4 bg-white border-t border-zinc-100 flex gap-2 items-center">
//                 {/* Hidden Native File Input Element */}
//                 <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleFileUpload}
//                     accept=".pdf,.txt,.docx"
//                     className="hidden"
//                 />

//                 {/* Attachment Pin Trigger Action */}
//                 <button
//                     type="button"
//                     disabled={isUploading || isLoading}
//                     onClick={() => fileInputRef.current?.click()}
//                     className="p-2.5 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
//                     title="Upload knowledge document (PDF, TXT)"
//                 >
//                     <Paperclip size={18} />
//                 </button>

//                 <input
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder={isUploading ? "Please wait for document indexing..." : "Ask something..."}
//                     disabled={isLoading || isUploading}
//                     className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                 />
//                 <button
//                     type="submit"
//                     disabled={isLoading || isUploading || !input.trim()}
//                     className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-zinc-100 disabled:text-zinc-400 cursor-pointer shadow-md shadow-blue-500/10"
//                 >
//                     <Send size={18} />
//                 </button>
//             </form>
//         </div>
//     );
// };


import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Paperclip, FolderClosed, X } from 'lucide-react'; // ➕ Added FolderClosed & X icons
import { chatService } from '../services/api';
import { FileManager } from './FileManager'; // ➕ Import your newly created FileManager component
import type { Message } from '../types/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatWindowProps {
    userId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ userId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showFiles, setShowFiles] = useState(false); // ➕ State to toggle the FileManager view

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, isUploading]);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                setError(null);
                const history = await chatService.getChatHistory();
                setMessages(history);
            } catch (err) {
                console.error(err);
                setError('Could not load chat history.');
            }
        };
        loadHistory();
    }, [userId]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/documents/ingest`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to completely parse and vectorize document file.');
            }

            setMessages((prev) => [
                ...prev,
                { userId, role: 'model', content: `Success! 🎉 System has fully vectorized and indexed your document: "${file.name}". You can now start querying against its data content dynamically.` }
            ]);
        } catch (err: any) {
            setError(err.message || 'File ingestion failed.');
        } finally {
            // ✨ This block executes regardless of success or failure to reset state smoothly
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Safely reset input value only if element is mounted
            }
        }
    };
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userContent = input.trim();
        setInput('');
        setError(null);

        const userMessage: Message = { userId, role: 'user', content: userContent };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const data = await chatService.sendMessage(userContent);
            const modelMessage: Message = { userId, role: 'model', content: data.reply };
            setMessages((prev) => [...prev, modelMessage]);
        } catch (err) {
            setError('Failed to get a response from the assistant.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-3xl mx-auto border border-zinc-200 rounded-2xl bg-white shadow-xl overflow-hidden relative">
            
            {/* Top Header Banner */}
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-zinc-800 text-sm md:text-base">InsightDesk RAG Assistant</h2>
                        <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Context Engine Operational
                        </p>
                    </div>
                </div>

                {/* ➕ Manage Files Trigger Button in the Header */}
                <button
                    type="button"
                    onClick={() => setShowFiles(!showFiles)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                >
                    <FolderClosed size={14} />
                    Manage Files
                </button>
            </div>

            {/* ➕ SLIDING OVERLAY CONTAINER FOR FILE MANAGER */}
            {showFiles && (
                <div className="absolute inset-0 bg-white z-30 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
                    {/* File Manager Inner Sub-Header */}
                    <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-zinc-800 font-bold text-sm">
                            <FolderClosed size={16} className="text-blue-600" />
                            Workspace File Manager
                        </div>
                        <button 
                            onClick={() => setShowFiles(false)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    {/* Scrollable container displaying the File Manager component view */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <FileManager />
                    </div>
                </div>
            )}

            {/* Messages Feed Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-zinc-50/50">
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center font-medium border border-red-100">
                        {error}
                    </div>
                )}

                {messages.length === 0 && !isLoading && !isUploading && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400 space-y-2">
                        <Bot size={40} className="stroke-1 text-zinc-300" />
                        <p className="text-sm">No conversation history found.</p>
                        <p className="text-xs max-w-xs">Attach a document using the paperclip or send a message to begin.</p>
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isUser = msg.role === 'user';
                    return (
                        <div key={index} className={`flex gap-3 items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
                            {!isUser && (
                                <div className="p-1.5 bg-white border border-zinc-200 rounded-lg text-zinc-600 shrink-0 shadow-xs">
                                    <Bot size={16} />
                                </div>
                            )}

                            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-xs ${isUser ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-zinc-800 border border-zinc-200/80 rounded-tl-none'}`}>
                                {isUser ? msg.content : (
                                    <div className="prose prose-sm max-w-none text-zinc-800 break-words space-y-2">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>

                            {isUser && (
                                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                    <User size={16} />
                                </div>
                            )}
                        </div>
                    );
                })}

                {isUploading && (
                    <div className="flex gap-3 items-start justify-start">
                        <div className="p-1.5 bg-white border border-zinc-200 rounded-lg text-blue-600 shrink-0 shadow-xs animate-spin">
                            <Loader2 size={16} />
                        </div>
                        <div className="bg-blue-50/50 text-blue-700 border border-blue-100 text-xs px-4 py-2.5 rounded-2xl rounded-tl-none shadow-xs font-medium italic">
                            Parsing file chunks, extracting structural data text, and processing deep embedding weights...
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="flex gap-3 items-start justify-start">
                        <div className="p-1.5 bg-white border border-zinc-200 rounded-lg text-zinc-400 shrink-0 shadow-xs animate-spin">
                            <Loader2 size={16} />
                        </div>
                        <div className="bg-white text-zinc-400 border border-zinc-100 text-xs px-4 py-2.5 rounded-2xl rounded-tl-none shadow-xs font-medium italic">
                            Analyzing text context windows...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-zinc-100 flex gap-2 items-center">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.txt,.docx"
                    className="hidden"
                />

                <button
                    type="button"
                    disabled={isUploading || isLoading}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
                    title="Upload knowledge document (PDF, TXT)"
                >
                    <Paperclip size={18} />
                </button>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isUploading ? "Please wait for document indexing..." : "Ask something..."}
                    disabled={isLoading || isUploading}
                    className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button
                    type="submit"
                    disabled={isLoading || isUploading || !input.trim()}
                    className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-zinc-100 disabled:text-zinc-400 cursor-pointer shadow-md shadow-blue-500/10"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};