import React, { useState } from 'react';
import JSZip from 'jszip';
import { JAVA_PROJECT_FILES, ProjectFile } from '../data/initialData';
import { 
  FolderTree, 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  Folder, 
  FileText, 
  Terminal,
  Database,
  ExternalLink
} from 'lucide-react';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(JAVA_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Create root folder
      const root = zip.folder('bank-account-management');
      if (!root) throw new Error('Could not create zip folder');

      // Add all files
      JAVA_PROJECT_FILES.forEach(file => {
        root.file(file.path, file.content);
      });

      // Generate binary zip
      const blob = await zip.generateAsync({ type: 'blob' });

      // Trigger browser download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'bank-account-management-java-project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error('Failed to generate zip:', err);
      alert('Failed to package project files into ZIP.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-4 space-y-4 font-sans text-slate-100">
      
      {/* Header with Download ZIP Button */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Java Project Source Code Explorer & Artifacts
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete, pristine, production-grade 2nd-year B.Tech Java Mini Project files. Ready to run in Eclipse or IntelliJ IDEA.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-2 transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? 'Generating ZIP...' : 'Download Project (.ZIP)'}</span>
        </button>
      </div>

      {/* Main Split View: File Tree + Code Display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Left: Project File Tree (4 cols) */}
        <div className="md:col-span-4 bg-slate-800/90 border border-slate-700 rounded-lg p-3 space-y-3 shadow-md max-h-[620px] overflow-y-auto">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider px-2 py-1 border-b border-slate-700 flex items-center justify-between">
            <span>Project Explorer</span>
            <span className="text-[10px] text-slate-500 font-mono">16 Files</span>
          </div>

          {/* Group 1: Source Files (src/) */}
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-sky-400 flex items-center gap-1.5 px-2 py-1">
              <Folder className="w-3.5 h-3.5 text-sky-400" />
              <span>src/ (Java Source Code)</span>
            </div>
            
            <div className="pl-4 space-y-0.5">
              {JAVA_PROJECT_FILES.filter(f => f.category === 'Source Code').map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono flex items-center gap-2 transition-colors ${
                    selectedFile.path === file.path
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-700/60'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group 2: Database & Build Config */}
          <div className="space-y-1 pt-2 border-t border-slate-700/60">
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 px-2 py-1">
              <Folder className="w-3.5 h-3.5 text-emerald-400" />
              <span>Database, Build & Scripts</span>
            </div>
            
            <div className="pl-4 space-y-0.5">
              {JAVA_PROJECT_FILES.filter(f => f.category === 'Config & Scripts').map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono flex items-center gap-2 transition-colors ${
                    selectedFile.path === file.path
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-700/60'
                  }`}
                >
                  {file.name.endsWith('.sql') ? (
                    <Database className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  ) : file.name.endsWith('.bat') || file.name.endsWith('.sh') ? (
                    <Terminal className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                  )}
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group 3: Documentation */}
          <div className="space-y-1 pt-2 border-t border-slate-700/60">
            <div className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1.5 px-2 py-1">
              <Folder className="w-3.5 h-3.5 text-indigo-400" />
              <span>Documentation</span>
            </div>
            
            <div className="pl-4 space-y-0.5">
              {JAVA_PROJECT_FILES.filter(f => f.category === 'Docs').map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono flex items-center gap-2 transition-colors ${
                    selectedFile.path === file.path
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-700/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Code Viewer (8 cols) */}
        <div className="md:col-span-8 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden flex flex-col shadow-xl">
          
          {/* File bar */}
          <div className="bg-slate-800 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono">
              <FileCode className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-white">{selectedFile.path}</span>
              <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded uppercase">
                {selectedFile.language}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Code content with line numbers */}
          <div className="p-4 overflow-y-auto max-h-[560px] font-mono text-xs leading-relaxed text-slate-200 bg-slate-950">
            <pre className="whitespace-pre">
              {selectedFile.content.split('\n').map((line, idx) => (
                <div key={idx} className="table-row hover:bg-slate-900/60">
                  <span className="table-cell select-none pr-4 text-right text-slate-600 text-[11px] w-10">
                    {idx + 1}
                  </span>
                  <span className="table-cell">
                    {line}
                  </span>
                </div>
              ))}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
};
