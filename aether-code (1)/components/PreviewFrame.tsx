import React, { useEffect, useState } from 'react';
import { CodeState } from '../types';

interface PreviewFrameProps {
  code: CodeState;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ code }) => {
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Escape </script> tags to prevent breaking the HTML structure
      const safeJs = code.js.replace(/<\/script>/g, '<\\/script>');
      
      const documentContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { margin: 0; padding: 0; font-family: sans-serif; }
              ${code.css}
            </style>
          </head>
          <body>
            ${code.html}
            <script>
              try {
                ${safeJs}
              } catch (err) {
                console.error(err);
              }
            </script>
          </body>
        </html>
      `;
      setSrcDoc(documentContent);
    }, 600); // 600ms debounce to prevent flashing

    return () => clearTimeout(timeout);
  }, [code]);

  return (
    <div className="w-full h-full flex flex-col relative bg-white">
      <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-3 space-x-2 shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
        <div className="flex-1 text-center text-xs text-slate-400 font-mono truncate">localhost:3000</div>
      </div>
      <iframe
        title="preview"
        srcDoc={srcDoc}
        className="w-full flex-1 border-none bg-white"
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default PreviewFrame;