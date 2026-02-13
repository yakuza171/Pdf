
import React from 'react';
import { Search, Sparkles, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto relative group">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque por marca, modelo ou componente (ex: Brastemp, LG Inverter)..."
          className="w-full pl-14 pr-28 py-5 bg-white border-2 border-slate-200 rounded-3xl focus:outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-500/10 transition-all text-lg font-medium shadow-sm group-hover:shadow-md placeholder:text-slate-400"
        />
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
          {isLoading ? (
            <div className="animate-spin h-6 w-6 border-3 border-blue-500 border-t-transparent rounded-full"></div>
          ) : (
            <Search size={26} className="group-focus-within:text-blue-500" />
          )}
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-3">
          {query && (
            <button 
              type="button"
              onClick={() => setQuery('')}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-black text-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center space-x-2 shadow-lg shadow-blue-200"
          >
            <Sparkles size={16} />
            <span>BUSCAR</span>
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 px-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Buscas comuns:</span>
        <button type="button" onClick={() => { setQuery('LG Inverter'); onSearch('LG Inverter'); }} className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">LG Inverter</button>
        <button type="button" onClick={() => { setQuery('Esquema Brastemp'); onSearch('Esquema Brastemp'); }} className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">Brastemp</button>
        <button type="button" onClick={() => { setQuery('Manual Samsung'); onSearch('Manual Samsung'); }} className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">Samsung TV</button>
        <button type="button" onClick={() => { setQuery('Módulo Taramps'); onSearch('Módulo Taramps'); }} className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">Som Automotivo</button>
      </div>
    </form>
  );
};

export default SearchBar;
