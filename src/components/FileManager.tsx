import React, { useEffect, useState } from 'react';

interface UploadedFile {
  _id: string; // Contains the s3Key string acting as the unique grouping key
  fileName: string;
  s3Url: string;
  uploadedAt: string;
  totalChunks: number;
}

export const FileManager: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  // Fetch unique files list on layout mount
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // Retrieve your active JWT session token
      const response = await fetch(`${API_BASE_URL}/documents/files`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      if (result.success) {
        setFiles(result.data);
      } else {
        setErrorMsg(result.message || 'Failed to sync workspace files.');
      }
    } catch (err) {
      setErrorMsg('Network error trying to pull active document directories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Handle running the cascading deletion pipeline
  const handleDelete = async (s3Key: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this file? This will permanently wipe all AI training text vectors associated with it.')) {
      return;
    }

    try {
      setDeletingKey(s3Key);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/documents/files`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ s3Key })
      });

      const result = await response.json();

      if (result.success) {
        // Optimistically remove the file element from state arrays instantly
        setFiles(prevFiles => prevFiles.filter(f => f._id !== s3Key));
      } else {
        alert(`Deletion request rejected: ${result.message}`);
      }
    } catch (err) {
      alert('Network transmission breakdown executing file destruction routines.');
    } finally {
      setDeletingKey(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-zinc-500 font-medium text-xs mono">Syncing knowledge context tables...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-2xs font-sans text-xs">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h3 className="font-bold text-zinc-950 text-sm tracking-tight">Active Knowledge Documents</h3>
          <p className="text-zinc-400 font-medium">Manage hosted document contexts synced to your agent workflows.</p>
        </div>
        <button 
          onClick={fetchFiles}
          className="px-3 py-1.5 border border-zinc-200 hover:bg-zinc-50 rounded-xl font-bold transition-all text-zinc-600"
        >
          Refresh Directory
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-semibold mb-4">
          {errorMsg}
        </div>
      )}

      {files.length === 0 ? (
        <div className="text-center py-12 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl">
          <p className="font-semibold text-zinc-500">No context files found in your workspace.</p>
          <p className="text-[10px] text-zinc-400 mt-0.5">Ingest a PDF file to begin feeding the LLM pipeline.</p>
        </div>
      ) : (
        <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-bold text-[10px] mono">
                <th className="p-4">File Name</th>
                <th className="p-4">Uploaded On</th>
                <th className="p-4 text-center">Vector Chunks</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700 font-medium">
              {files.map((file) => (
                <tr key={file._id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="p-4 max-w-xs truncate">
                    <a 
                      href={file.s3Url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      {file.fileName}
                    </a>
                  </td>
                  <td className="p-4 text-zinc-400">
                    {new Date(file.uploadedAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                  <td className="p-4 text-center">
                    <span className="mono px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md text-[10px] font-bold">
                      {file.totalChunks} vectors
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(file._id)}
                      disabled={deletingKey === file._id}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 disabled:bg-zinc-50 disabled:text-zinc-300 text-red-600 font-bold rounded-lg transition-all"
                    >
                      {deletingKey === file._id ? 'Purging...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};