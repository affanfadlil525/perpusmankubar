import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { LayoutDashboard, Book, Users, RefreshCw, Search, Plus, Library, Info, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

// Pages
import Dashboard from "./pages/Dashboard";
import Catalog from "./pages/Catalog";
import Members from "./pages/Members";
import Circulation from "./pages/Circulation";
import LibraryProfile from "./pages/LibraryProfile";
import Login from "./pages/Login";
import StudentLogin from "./pages/StudentLogin";
import LandingPage from "./pages/LandingPage";
import BookDetail from "./pages/BookDetail";
import Reader from "./pages/Reader";

const Sidebar = ({ onLogout, isOpen, onClose }: { onLogout: () => void; isOpen: boolean; onClose: () => void }) => {
  const location = useLocation();
  
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white h-screen z-[70] flex flex-col p-4 transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-2 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">Libraria</h1>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">MAN Kutai Barat</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" active={location.pathname === "/dashboard"} onClick={onClose} />
          <SidebarItem to="/catalog" icon={Book} label="Katalog Buku" active={location.pathname === "/catalog"} onClick={onClose} />
          <SidebarItem to="/members" icon={Users} label="Keanggotaan" active={location.pathname === "/members"} onClick={onClose} />
          <SidebarItem to="/circulation" icon={RefreshCw} label="Sirkulasi" active={location.pathname === "/circulation"} onClick={onClose} />
          <SidebarItem to="/profile" icon={Info} label="Profil Perpus" active={location.pathname === "/profile"} onClick={onClose} />
        </nav>

        <div className="mt-auto space-y-2">
          <button 
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 font-medium"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-1">INLISLite v3.2 Clone</p>
            <p className="text-[10px] text-slate-400">Powered by Perpusnas RI</p>
          </div>
        </div>
      </aside>
    </>
  );
};

const SidebarItem = ({ to, icon: Icon, label, active, onClick }: { to: string; icon: any; label: string; active: boolean; onClick: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-emerald-50 text-emerald-700 shadow-sm" 
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <Icon className={cn("w-5 h-5 transition-transform duration-200", active ? "scale-110" : "group-hover:scale-110")} />
    <span className="font-medium">{label}</span>
    {active && (
      <motion.div
        layoutId="sidebar-active"
        className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"
      />
    )}
  </Link>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("is_auth") === "true";
  });

  const [isStudentAuthenticated, setIsStudentAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("is_student_auth") === "true";
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("is_auth", "true");
  };

  const handleStudentLogin = () => {
    setIsStudentAuthenticated(true);
    localStorage.setItem("is_student_auth", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsStudentAuthenticated(false);
    localStorage.removeItem("is_auth");
    localStorage.removeItem("is_student_auth");
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/book/:id" element={<BookDetail />} />
          
          {/* Reader Route - Requires Student or Librarian Auth */}
          <Route 
            path="/read/:id" 
            element={
              (isStudentAuthenticated || isAuthenticated) 
                ? <Reader /> 
                : <Navigate to="/student-login" state={{ from: { pathname: window.location.pathname } }} replace />
            } 
          />
          
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />} 
          />

          <Route 
            path="/student-login" 
            element={!isStudentAuthenticated ? <StudentLogin onLogin={handleStudentLogin} /> : <Navigate to="/" replace />} 
          />

          {/* Protected Librarian Routes */}
          <Route
            path="/*"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" replace />
              ) : (
                <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
                  <Sidebar onLogout={handleLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                  <div className="flex-1 flex flex-col min-w-0">
                    {/* Mobile Header */}
                    <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                          <Library className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-900">Libraria</span>
                      </div>
                      <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-500 hover:text-slate-900">
                        <Menu className="w-6 h-6" />
                      </button>
                    </header>
                    
                    <main className="flex-1 p-4 md:p-8 overflow-auto">
                      <AnimatePresence mode="wait">
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/catalog" element={<Catalog />} />
                          <Route path="/members" element={<Members />} />
                          <Route path="/circulation" element={<Circulation />} />
                          <Route path="/profile" element={<LibraryProfile />} />
                          <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                      </AnimatePresence>
                    </main>
                  </div>
                </div>
              )
            }
          />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}
