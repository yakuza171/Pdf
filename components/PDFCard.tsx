
import React from 'react';
import { FileText, Eye, Download, Lock, ChevronRight } from 'lucide-react';
import { PDFMetadata, Role } from '../types';
import { formatNumber, formatDate } from '../lib/utils';
import { CATEGORIAS } from '../constants';

interface PDFCardProps {
  pdf: PDFMetadata;
  userRole: Role;
  onClick: (pdfId: string) => void;
}

const PDFCard: React.FC<PDFCardProps> = ({ pdf, userRole, onClick }) => {
  const isLocked = userRole === Role.FREE;
  const category = CATEGORIAS.find(c => c.id === pdf.categoryId);

  return (
    <div 
      onClick={() => onClick(pdf.id)}
      className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-2xl hover:border-blue-400 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors">
          <FileText size={26} className="text-blue-600 group-hover:text-white" />
        </div>
        <div className="flex flex-col items-end space-y-2">
          {isLocked && (
            <span className="flex items-center space-x-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
              <Lock size={12} />
              <span>Assinante</span>
            </span>
          )}
          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">
            {category?.name || 'Manual'}
          </span>
        </div>
      </div>

      <h3 className="font-extrabold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
        {pdf.title}
      </h3>
      <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10 leading-snug">
        {pdf.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-4 text-slate-400 text-xs font-bold uppercase tracking-tighter">
          <span className="flex items-center space-x-1">
            <Eye size={14} />
            <span>{formatNumber(pdf.views)}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Download size={14} />
            <span>{formatNumber(pdf.downloads)}</span>
          </span>
        </div>
        <div className="flex items-center text-blue-600 text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
          <span>Visualizar</span>
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
};

export default PDFCard;
