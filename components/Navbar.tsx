
import React from 'react';
import { User, FileText, Sparkles } from 'lucide-react';
import { APP_NAME } from '../constants';
import { Role } from '../types';
import { cn } from '../lib/utils';

interface NavbarProps {
  userRole: Role;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ userRole, onNavigate, currentPage }) => {
  const NavItem = ({ name, id, isSpecial }: { name: string, id: string, isSpecial?: boolean }) => (
    <button
      onClick={() => onNavigate(id)}
      className={cn(
        "px-3 py-2 text-sm font-semibold transition-colors relative flex items-center space-x-1",
        currentPage === id ? "text-blue-600" : isSpecial ? "text-amber-600 hover:text-amber-700" : "text-slate-600 hover:text-blue-600"
      )}
    >
      {isSpecial && <Sparkles size={14} />}
      <span>{name}</span>
      {currentPage === id && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
      )}
    </button>
  );

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => onNavigate('home')} className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-200">
                <FileText className="text-white" size={20} />
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight uppercase">{APP_NAME}</span>
            </button>
            
            <div className="hidden md:ml-10 md:flex md:space-x-4">
              <NavItem name="Início" id="home" />
              <NavItem name="Categorias" id="categories" />
              <NavItem name="Pinout IA" id="ia" isSpecial />
              <NavItem name="Planos" id="pricing" />
              {userRole === Role.ADMIN && <NavItem name="Administração" id="admin" />}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-3 py-2 md:px-4 rounded-xl transition-all group"
            >
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <User size={14} className="text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <span className="hidden sm:inline text-sm font-bold text-slate-700">Minha Conta</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
