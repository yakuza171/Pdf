
import React, { useEffect, useState } from 'react';
import { Lock, Download, FileText, ChevronLeft, Printer, ShieldAlert, ExternalLink } from 'lucide-react';
import { PDFMetadata, Role } from '../types';
import { formatDate } from '../lib/utils';

interface PDFViewerProps {
  pdf: PDFMetadata;
  userRole: Role;
  onUpgrade: () => void;
  onBack: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdf, userRole, onUpgrade, onBack }) => {
  const isRestricted = userRole === Role.FREE;
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    // Se for Base64 (upload do usuário), converte para Blob para melhor renderização
    if (pdf.fileUrl.startsWith('data:application/pdf;base64,')) {
      const base64Data = pdf.fileUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setBlobUrl(pdf.fileUrl);
    }
  }, [pdf.fileUrl]);

  return (
    <div className="bg-slate-100 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight truncate max-w-[200px] md:max-w-md">{pdf.title}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pdf.filename}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {!isRestricted && blobUrl && (
              <>
                <a 
                  href={blobUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-50 hover:bg-blue-50 text-blue-600 rounded-xl transition-all"
                  title="Abrir em tela cheia"
                >
                  <ExternalLink size={20} />
                </a>
                <a 
                  href={blobUrl} 
                  download={pdf.filename}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all text-sm font-bold shadow-lg"
                >
                  <Download size={18} />
                  <span className="hidden sm:inline">Baixar PDF</span>
                </a>
              </>
            )}
            {isRestricted && (
              <button onClick={onUpgrade} className="bg-amber-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-lg">
                <Lock size={18} />
                <span>Desbloquear Manual</span>
              </button>
            )}
          </div>
        </div>

        <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden h-[70vh] md:h-[85vh] flex flex-col">
          {!isRestricted ? (
            blobUrl ? (
              <embed 
                src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                type="application/pdf"
                className="w-full h-full border-none"
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50">
                 <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )
          ) : (
            <div className="flex-1 relative overflow-auto p-6 flex justify-center bg-slate-200/50">
               <div className="w-full max-w-4xl bg-white shadow-2xl relative p-12 space-y-8 blur-md select-none pointer-events-none opacity-50">
                  <div className="h-12 w-3/4 bg-slate-100 rounded-lg"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-slate-50 rounded"></div>
                    <div className="h-4 w-full bg-slate-50 rounded"></div>
                    <div className="h-4 w-2/3 bg-slate-50 rounded"></div>
                  </div>
                  <div className="h-full w-full bg-slate-50 rounded-2xl flex items-center justify-center border-4 border-dashed border-slate-100">
                    <FileText size={100} className="opacity-10" />
                  </div>
               </div>
               <div className="absolute inset-0 backdrop-blur-[2px] flex items-center justify-center p-6 text-center z-20">
                  <div className="bg-white p-10 rounded-[3rem] shadow-3xl max-w-md border border-slate-100 animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldAlert size={40} className="text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tighter">Conteúdo Restrito</h3>
                    <p className="text-slate-500 mb-8 font-medium leading-relaxed">Este esquema detalhado é exclusivo para membros Premium Pro. Ative seu acesso agora.</p>
                    <button onClick={onUpgrade} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 active:scale-95 transition-all">
                      Assinar Plano Pro
                    </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
