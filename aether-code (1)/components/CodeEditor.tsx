import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: 'html' | 'css' | 'js';
  isActive: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="relative w-full h-full group">
      <textarea
        className="w-full h-full bg-transparent text-slate-300 font-mono text-sm p-4 resize-none focus:outline-none focus:ring-0 leading-6 border-none"
        value={code}
        onChange={(e) => onChange(e.target.value)}
        spellCheck="false"
        autoCapitalize="off"
        autoComplete="off"
        placeholder={`Write your ${language.toUpperCase()} here...`}
      />
      {/* Subtle line number simulation/guide */}
      <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-cyan-500/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

export default CodeEditor;