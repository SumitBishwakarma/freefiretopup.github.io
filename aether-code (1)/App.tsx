import React, { useState } from 'react';
import { Layers, Zap, Box, Code2, Monitor, Download, Github, Maximize2, Minimize2, Smartphone, Tablet } from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import PreviewFrame from './components/PreviewFrame';
import AIPromptModal from './components/AIPromptModal';
import { generateCodeFromPrompt } from './services/geminiService';
import { CodeState, EditorTab } from './types';

const INITIAL_CODE: CodeState = {
  html: `<div class="card">\n  <div class="glow"></div>\n  <h2>Aether</h2>\n  <p>Future of Coding</p>\n</div>`,
  css: `body {\n  background: #000;\n  color: white;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}\n\n.card {\n  position: relative;\n  padding: 40px;\n  background: rgba(255,255,255,0.05);\n  border-radius: 20px;\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255,255,255,0.1);\n  overflow: hidden;\n}\n\nh2 {\n  font-size: 2.5rem;\n  margin: 0;\n  background: linear-gradient(to right, #06b6d4, #8b5cf6);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}`,
  js: `console.log('Aether Code initialized...');\n\nconst card = document.querySelector('.card');\ncard.addEventListener('mousemove', (e) => {\n  // Add interactive hover logic here\n});`
};

type ViewMode = 'desktop' | 'tablet' | 'mobile';

const App: React.FC = () => {
  const [code, setCode] = useState<CodeState>(INITIAL_CODE);
  const [activeTab, setActiveTab] = useState<EditorTab>('html');
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');

  const handleCodeChange = (type: EditorTab, value: string) => {
    setCode(prev => ({ ...prev, [type]: value }));
  };

  const handleAIGenerate = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const currentContext = JSON.stringify(code);
      const result = await generateCodeFromPrompt(prompt, currentContext);
      setCode({
        html: result.html,
        css: result.css,
        js: result.js
      });
      setAIModalOpen(false);
    } catch (error) {
      alert("Failed to generate code. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const fileContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aether Export</title>
  <style>
    ${code.css}
  </style>
</head>
<body>
  ${code.html}
  <script>
    ${code.js}
  </script>
</body>
</html>`;

    const blob = new Blob([fileContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-full bg-[#0f172a] text-slate-200 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="z-10 flex flex-col w-full h-full backdrop-blur-3xl">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-900/50">
              <Layers className="text-white" size={18} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-white">Aether Code</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setAIModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm transition-all hover:scale-105 group"
            >
              <Zap size={16} className="text-yellow-400 group-hover:text-yellow-300" />
              <span className="bg-gradient-to-r from-yellow-200 to-amber-200 bg-clip-text text-transparent font-medium">AI Assist</span>
            </button>
            <div className="h-6 w-px bg-white/10" />
            <a href="#" className="p-2 text-slate-400 hover:text-white transition-colors">
              <Github size={20} />
            </a>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* Editor Pane */}
          {!isFullScreen && (
            <div className="flex-1 flex flex-col min-w-0 border-r border-white/5 transition-all duration-300 ease-in-out">
              {/* Tabs */}
              <div className="flex items-center h-12 border-b border-white/5 px-2 bg-slate-900/50 shrink-0">
                {(['html', 'css', 'js'] as EditorTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      relative px-6 h-full flex items-center gap-2 text-sm font-medium transition-colors
                      ${activeTab === tab ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}
                    `}
                  >
                    {tab === 'html' && <Box size={14} />}
                    {tab === 'css' && <Monitor size={14} />}
                    {tab === 'js' && <Code2 size={14} />}
                    <span className="uppercase">{tab}</span>
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500 shadow-[0_-2px_8px_rgba(6,182,212,0.5)]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Code Input */}
              <div className="flex-1 relative bg-[#0b1120]/50">
                <CodeEditor 
                  code={code[activeTab]} 
                  onChange={(val) => handleCodeChange(activeTab, val)} 
                  language={activeTab}
                  isActive={true}
                />
              </div>
              
              {/* Status Bar */}
              <div className="h-8 border-t border-white/5 flex items-center px-4 text-xs text-slate-500 bg-slate-900/80 shrink-0">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse" />
                   Ready
                </div>
                <div className="flex-1" />
                <div>UTF-8</div>
              </div>
            </div>
          )}

          {/* Preview Pane */}
          <div className={`flex flex-col min-w-0 bg-black/20 gap-4 transition-all duration-300 ease-in-out ${isFullScreen ? 'fixed inset-0 z-50 bg-[#0f172a] p-0' : 'flex-1 p-4 lg:p-6'}`}>
             
             {/* Toolbar */}
             <div className={`flex items-center justify-between shrink-0 ${isFullScreen ? 'px-4 py-2 bg-slate-900/80 border-b border-white/5' : 'px-2 mb-2'}`}>
                <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-1 border border-white/5">
                    <button 
                      onClick={() => setViewMode('desktop')}
                      className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white/10 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                      title="Desktop View"
                    >
                      <Monitor size={14} />
                    </button>
                    <button 
                      onClick={() => setViewMode('tablet')}
                      className={`p-1.5 rounded-md transition-all ${viewMode === 'tablet' ? 'bg-white/10 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                      title="Tablet View"
                    >
                      <Tablet size={14} />
                    </button>
                    <button 
                      onClick={() => setViewMode('mobile')}
                      className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white/10 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                      title="Mobile View"
                    >
                      <Smartphone size={14} />
                    </button>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title={isFullScreen ? "Minimize View" : "Full Screen View"}
                  >
                    {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Download Project"
                  >
                     <Download size={16} />
                  </button>
                </div>
             </div>

             {/* Canvas/Frame Container */}
             <div className="flex-1 flex justify-center items-center relative min-h-0 overflow-hidden perspective-[2000px]">
               <div className={`
                 relative bg-white shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex flex-col
                 ${viewMode === 'desktop' ? 'w-full h-full rounded-xl' : ''}
                 ${viewMode === 'tablet' ? 'w-[768px] h-[95%] max-h-[1024px] rounded-[2rem] border-[12px] border-slate-800' : ''}
                 ${viewMode === 'mobile' ? 'w-[375px] h-[90%] max-h-[812px] rounded-[3rem] border-[12px] border-slate-800' : ''}
               `}>
                 {/* Device Notch/Camera for Mobile/Tablet */}
                 {(viewMode === 'mobile' || viewMode === 'tablet') && (
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-800 rounded-b-xl z-10 flex justify-center items-center">
                      <div className="w-16 h-1 bg-slate-700 rounded-full opacity-50"></div>
                   </div>
                 )}
                 
                 <div className="flex-1 w-full h-full overflow-hidden bg-white rounded-[inherit]">
                   <PreviewFrame code={code} />
                 </div>
               </div>
             </div>

          </div>

        </div>
      </div>

      <AIPromptModal 
        isOpen={isAIModalOpen} 
        onClose={() => setAIModalOpen(false)} 
        onSubmit={handleAIGenerate}
        isLoading={isGenerating}
      />
    </div>
  );
};

export default App;