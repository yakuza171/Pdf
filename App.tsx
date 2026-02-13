
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import MobileTabs from './components/MobileTabs';
import SearchBar from './components/SearchBar';
import PDFCard from './components/PDFCard';
import PDFViewer from './components/PDFViewer';
import { Role, PDFMetadata, User } from './types';
import { ACERVO_PDFS, CATEGORIAS, APP_NAME } from './constants';
import { geminiService } from './services/geminiService';
import { GoogleGenAI } from "@google/genai";
import { 
  Zap, Crown, ShieldCheck, ChevronRight, 
  Upload, Search, FileText, 
  Activity, LogOut, QrCode, MessageCircle, Copy, Check,
  User as UserIcon, LayoutGrid, FileUp, AlertCircle, Camera, Sparkles, X, ScanSearch, Cpu, LogIn
} from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [pdfList, setPdfList] = useState<PDFMetadata[]>([]);
  const [searchResults, setSearchResults] = useState<PDFMetadata[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<PDFMetadata | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [compImage, setCompImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const compInputRef = useRef<HTMLInputElement>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedPdfs = localStorage.getItem('electropdf_files');
    if (savedPdfs) {
      setPdfList(JSON.parse(savedPdfs));
      setSearchResults(JSON.parse(savedPdfs));
    } else {
      setPdfList(ACERVO_PDFS);
      setSearchResults(ACERVO_PDFS);
      localStorage.setItem('electropdf_files', JSON.stringify(ACERVO_PDFS));
    }

    const session = localStorage.getItem('electropdf_session');
    if (session) {
      try {
        setCurrentUser(JSON.parse(session));
      } catch (e) {
        localStorage.removeItem('electropdf_session');
      }
    }
    
    if (!localStorage.getItem('electropdf_users')) {
      localStorage.setItem('electropdf_users', JSON.stringify([]));
    }
  }, []);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setCurrentPage('search');
    try {
      const results = await geminiService.searchPDFs(query, pdfList);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('electropdf_users') || '[]');
    const user = users.find((u: User) => u.email.toLowerCase() === authEmail.toLowerCase().trim() && u.password === authPass);
    
    if (user) {
      const { password, ...userSession } = user;
      setCurrentUser(userSession as User);
      localStorage.setItem('electropdf_session', JSON.stringify(userSession));
      setCurrentPage('home');
    } else {
      alert('Credenciais inválidas.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('electropdf_users') || '[]');
    if (users.find((u: User) => u.email.toLowerCase() === authEmail.toLowerCase().trim())) {
      alert('E-mail já cadastrado.');
      return;
    }

    const newUser: User = {
      id: 'u' + Date.now(),
      name: authName.trim(),
      email: authEmail.toLowerCase().trim(),
      password: authPass,
      role: users.length === 0 ? Role.ADMIN : Role.FREE
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('electropdf_users', JSON.stringify(updatedUsers));
    
    const { password, ...userSession } = newUser;
    setCurrentUser(userSession as User);
    localStorage.setItem('electropdf_session', JSON.stringify(userSession));
    
    alert('Conta criada com sucesso!');
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('electropdf_session');
    setCurrentPage('home');
  };

  const handlePdfClick = (pdfId: string) => {
    const pdf = pdfList.find(p => p.id === pdfId);
    if (pdf) {
      setSelectedPdf(pdf);
      setCurrentPage('viewer');
    }
  };

  const handleAddPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return alert('Selecione um PDF.');
    setIsUploading(true);
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const reader = new FileReader();
      const fileAsBase64 = await new Promise<string>((res) => {
        reader.onload = () => res(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });
      const newPdf: PDFMetadata = {
        id: 'p' + Date.now(),
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        filename: selectedFile.name,
        fileUrl: fileAsBase64,
        categoryId: formData.get('category') as string,
        tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
        views: 0,
        downloads: 0,
        createdAt: new Date().toISOString()
      };
      const updatedList = [newPdf, ...pdfList];
      setPdfList(updatedList);
      setSearchResults(updatedList);
      localStorage.setItem('electropdf_files', JSON.stringify(updatedList));
      alert('Manual Publicado!');
      setSelectedFile(null);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      alert('Erro no upload.');
    } finally { setIsUploading(false); }
  };

  const handleCompImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompImage(reader.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const analyzeComponent = async () => {
    if (!compImage) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = compImage.split(',')[1];
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
            { text: "Identifique este componente eletrônico. Forneça o Pinout (função de cada pino) e descrição em português." }
          ]
        }
      });
      setAnalysisResult(response.text || "Não identificado.");
    } catch (error) { 
      setAnalysisResult("Erro na análise via IA."); 
    } finally { setIsAnalyzing(false); }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-600 selection:text-white bg-slate-50">
      <Navbar userRole={currentUser?.role || Role.FREE} currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 pb-24 md:pb-0">
        {!currentUser && currentPage !== 'home' ? (
          <div className="max-w-md mx-auto my-12 px-4 mb-32">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl">
              <div className="text-center mb-8">
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200">
                  <LogIn className="text-white" size={32} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{authMode === 'login' ? 'Bem-vindo!' : 'Cadastrar'}</h2>
              </div>
              <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                {authMode === 'register' && (
                  <input required type="text" value={authName} onChange={(e) => setAuthName(e.target.value)} placeholder="Nome" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 font-bold focus:border-blue-500 outline-none" />
                )}
                <input required type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="E-mail" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 font-bold focus:border-blue-500 outline-none" />
                <input required type="password" value={authPass} onChange={(e) => setAuthPass(e.target.value)} placeholder="Senha" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 font-bold focus:border-blue-500 outline-none" />
                <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-700 transition-all uppercase tracking-widest text-xs mt-4">
                  {authMode === 'login' ? 'Entrar' : 'Registrar'}
                </button>
              </form>
              <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="w-full text-center mt-6 text-slate-500 font-bold text-sm">
                {authMode === 'login' ? 'Não tem conta? Crie uma' : 'Já tem conta? Logar'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {currentPage === 'home' && renderHome(setCurrentPage, handleSearch, isSearching, pdfList, currentUser, handlePdfClick)}
            {currentPage === 'search' && renderSearch(searchResults, handleSearch, isSearching, currentUser, handlePdfClick)}
            {currentPage === 'categories' && renderCategories(handleSearch)}
            {currentPage === 'pricing' && renderPixPayment(() => { navigator.clipboard.writeText('47984888812'); setCopied(true); setTimeout(() => setCopied(false), 2000); }, copied)}
            {currentPage === 'dashboard' && renderDashboard(currentUser, handleLogout, setCurrentPage)}
            {currentPage === 'admin' && (currentUser?.role === Role.ADMIN ? renderAdmin(pdfList, isUploading, selectedFile, fileInputRef, (e) => e.target.files && setSelectedFile(e.target.files[0]), handleAddPdf, setPdfList) : null)}
            {currentPage === 'ia' && renderComponentAnalyzer(compInputRef, compImage, handleCompImageChange, isAnalyzing, analyzeComponent, analysisResult)}
            {currentPage === 'viewer' && selectedPdf && (
              <PDFViewer pdf={selectedPdf} userRole={currentUser?.role || Role.FREE} onUpgrade={() => setCurrentPage('pricing')} onBack={() => setCurrentPage('home')} />
            )}
          </>
        )}
      </main>
      <MobileTabs currentPage={currentPage} onNavigate={setCurrentPage} />
      <Footer />
    </div>
  );
};

const renderHome = (setCurrentPage: any, handleSearch: any, isSearching: any, pdfList: any, currentUser: any, handlePdfClick: any) => (
  <div className="space-y-12 pb-20">
    <section className="bg-slate-900 text-white pt-16 pb-32 px-4 rounded-b-[4rem] text-center shadow-2xl">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight">Acervo <span className="text-blue-500">Expert</span></h1>
        <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto">Manuais técnicos e esquemas elétricos com suporte de IA.</p>
        <div className="pt-8 max-w-3xl mx-auto"><SearchBar onSearch={handleSearch} isLoading={isSearching} /></div>
      </div>
    </section>
    <section className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {CATEGORIAS.slice(0, 3).map(cat => (
          <button key={cat.id} onClick={() => handleSearch(cat.name)} className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-xl flex flex-col items-center space-y-4 group hover:scale-105 transition-all">
            <div className="text-blue-600 bg-blue-50 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">{cat.icon}</div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{cat.name}</span>
          </button>
        ))}
        <button onClick={() => setCurrentPage('ia')} className="bg-amber-500 p-7 rounded-[2rem] text-white shadow-xl flex flex-col items-center justify-center space-y-4 hover:scale-105 transition-all">
          <ScanSearch size={28} />
          <span className="text-[10px] font-black uppercase tracking-widest">Pinout IA</span>
        </button>
        <button onClick={() => setCurrentPage('categories')} className="bg-blue-600 p-7 rounded-[2rem] text-white shadow-xl flex flex-col items-center justify-center space-y-4 hover:scale-105 transition-all">
          <LayoutGrid size={28} />
          <span className="text-[10px] font-black uppercase tracking-widest">Setores</span>
        </button>
        {currentUser?.role === Role.ADMIN && (
          <button onClick={() => setCurrentPage('admin')} className="bg-slate-900 p-7 rounded-[2rem] text-white shadow-xl flex flex-col items-center justify-center space-y-4 hover:scale-105 transition-all">
            <Upload size={28} />
            <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
          </button>
        )}
      </div>
    </section>
    <section className="max-w-7xl mx-auto px-4 space-y-8 pb-32">
      <h2 className="text-3xl font-black text-slate-900 flex items-center space-x-3"><Zap className="text-blue-600" /><span>Recém Adicionados</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pdfList.slice(0, 6).map((pdf: any) => <PDFCard key={pdf.id} pdf={pdf} userRole={currentUser?.role || Role.FREE} onClick={handlePdfClick} />)}
      </div>
    </section>
  </div>
);

const renderSearch = (searchResults: any, handleSearch: any, isSearching: any, currentUser: any, handlePdfClick: any) => (
  <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 min-h-[70vh] mb-20 animate-in fade-in duration-500">
    <SearchBar onSearch={handleSearch} isLoading={isSearching} />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {searchResults.map((pdf: any) => <PDFCard key={pdf.id} pdf={pdf} userRole={currentUser?.role || Role.FREE} onClick={handlePdfClick} />)}
    </div>
  </div>
);

const renderCategories = (handleSearch: any) => (
  <div className="max-w-7xl mx-auto px-4 py-20 space-y-12 mb-20">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {CATEGORIAS.map(cat => (
        <button key={cat.id} onClick={() => handleSearch(cat.name)} className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl flex flex-col items-center justify-center text-center space-y-6 group hover:-translate-y-2 transition-all">
          <div className="p-8 bg-blue-50 rounded-[2rem] text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">{cat.icon}</div>
          <span className="text-lg font-black text-slate-900 uppercase tracking-widest">{cat.name}</span>
        </button>
      ))}
    </div>
  </div>
);

const renderComponentAnalyzer = (compInputRef: any, compImage: any, handleCompImageChange: any, isAnalyzing: any, analyzeComponent: any, analysisResult: any) => (
  <div className="max-w-5xl mx-auto px-4 py-12 space-y-12 mb-32">
    <div className="text-center space-y-4">
      <div className="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl text-white mb-6"><ScanSearch size={40} /></div>
      <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Pinout com IA</h2>
      <p className="text-slate-500 font-medium max-w-xl mx-auto">Use a câmera ou galeria para identificar componentes.</p>
    </div>
    <div className="grid md:grid-cols-2 gap-10">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-2xl space-y-8">
        <div onClick={() => compInputRef.current?.click()} className="aspect-square border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-slate-50 border-slate-100 hover:border-blue-200">
          <input type="file" ref={compInputRef} onChange={handleCompImageChange} accept="image/*" className="hidden" />
          {compImage ? <img src={compImage} className="w-full h-full object-cover" /> : <div className="text-center"><Camera className="text-slate-300 mx-auto mb-4" size={48} /><p className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Toque para selecionar</p></div>}
        </div>
        <button onClick={analyzeComponent} disabled={!compImage || isAnalyzing} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
          {isAnalyzing ? "Analisando..." : "Revelar Pinagem"}
        </button>
      </div>
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl min-h-[400px]">
        {analysisResult ? <div className="prose prose-slate max-w-none text-slate-700 font-medium whitespace-pre-wrap">{analysisResult}</div> : <div className="h-full flex items-center justify-center text-slate-300 font-bold italic">Aguardando imagem...</div>}
      </div>
    </div>
  </div>
);

const renderDashboard = (currentUser: any, handleLogout: any, setCurrentPage: any) => (
  <div className="max-w-4xl mx-auto px-4 py-16 space-y-10 mb-20">
    <div className="bg-white p-16 rounded-[3rem] border border-slate-200 shadow-xl text-center">
      <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-400"><UserIcon size={48} /></div>
      <h3 className="text-3xl font-black text-slate-900">{currentUser?.name}</h3>
      <p className="text-slate-500 mb-10 font-bold">{currentUser?.email}</p>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <div className="bg-blue-50 px-10 py-8 rounded-[2rem] border border-blue-100 flex-1">
          <p className="text-blue-900 font-black text-[10px] uppercase tracking-widest mb-1">Status</p>
          <p className="text-blue-600 font-black text-2xl uppercase">{currentUser?.role}</p>
        </div>
        <button onClick={handleLogout} className="bg-rose-50 text-rose-600 px-10 py-8 rounded-[2rem] font-black uppercase text-xs tracking-widest">Sair</button>
      </div>
    </div>
  </div>
);

const renderAdmin = (pdfList: any, isUploading: any, selectedFile: any, fileInputRef: any, handleFileChange: any, handleAddPdf: any, setPdfList: any) => (
  <div className="max-w-7xl mx-auto px-4 py-16 space-y-12 mb-32">
    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Administração</h2>
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl">
        <form onSubmit={handleAddPdf} className="space-y-6">
          <div onClick={() => fileInputRef.current?.click()} className="border-4 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
            {selectedFile ? <p className="font-bold text-green-600">{selectedFile.name}</p> : <Upload className="text-slate-300" size={40} />}
          </div>
          <input name="title" required placeholder="Título" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold" />
          <select name="category" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold">
            {CATEGORIAS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input name="tags" placeholder="Tags (vírgula)" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold" />
          <textarea name="description" required placeholder="Descrição" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 h-32" />
          <button disabled={isUploading} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-xs">
            {isUploading ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </div>
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden p-8">
        <h3 className="text-xl font-black mb-6">Arquivos Ativos</h3>
        <div className="space-y-4">
          {pdfList.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="font-bold truncate max-w-[200px]">{p.title}</span>
              <button onClick={() => { const up = pdfList.filter((x:any) => x.id !== p.id); setPdfList(up); localStorage.setItem('electropdf_files', JSON.stringify(up)); }} className="text-rose-600 font-black text-xs uppercase">Excluir</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const renderPixPayment = (copyPix: any, copied: any) => (
  <div className="max-w-4xl mx-auto my-16 px-4 mb-32">
    <div className="bg-white rounded-[4rem] border border-slate-200 overflow-hidden shadow-2xl grid md:grid-cols-2">
      <div className="p-12 bg-slate-900 text-white flex flex-col justify-between">
        <h2 className="text-5xl font-black tracking-tighter mb-6">Plano Pro</h2>
        <p className="text-slate-400 text-lg">Acesso ilimitado e Pinout IA avançado.</p>
      </div>
      <div className="p-12 text-center bg-white flex flex-col items-center">
        <div className="bg-slate-50 p-8 rounded-[3rem] mb-8"><QrCode size={200} /></div>
        <button onClick={copyPix} className="w-full bg-slate-100 py-4 rounded-xl font-black flex items-center justify-center space-x-2 mb-4">
          {copied ? <Check className="text-green-500" /> : <Copy className="text-slate-400" />}
          <span>Copiar Pix: 47984888812</span>
        </button>
        <a href="https://wa.me/5547984888812" className="w-full bg-green-500 text-white font-black py-4 rounded-xl flex items-center justify-center space-x-2 shadow-xl">
          <MessageCircle /><span>Enviar Comprovante</span>
        </a>
      </div>
    </div>
  </div>
);

const Footer = () => (
  <footer className="hidden md:block bg-slate-950 text-slate-600 py-16 text-center border-t border-slate-900">
    <p className="text-[10px] font-black uppercase tracking-[0.5em]">&copy; 2024 ElectroPDF - Sistema de Suporte Especializado</p>
  </footer>
);

export default App;
