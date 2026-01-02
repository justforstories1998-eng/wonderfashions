import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../components/common/Toast';
import Button from '../../components/common/Button';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { settings } = useSettings();
  const toast = useToast();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast.success('Access Granted to Royal Suite');
    } catch (err) {
      toast.error('Invalid Credentials');
    }
  };

  const branding = settings?.branding || {};

  return (
    <div className="min-h-screen flex bg-[#FDFCF0] font-sans">
      {/* LEFT SIDE: BRANDING & ART */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#4A0404] relative overflow-hidden items-center justify-center border-r-4 border-[#C5A059]">
        {/* Decorative Patterns */}
        <div className="absolute inset-0 opacity-10 bg-mandala-pattern scale-150"></div>
        <div className="absolute inset-20 border border-[#C5A059]/20 rounded-full"></div>
        
        <div className="relative z-10 text-center space-y-8 p-12">
          {/* Logo Container */}
          <div className="w-32 h-32 bg-[#FDFCF0] rounded-full mx-auto flex items-center justify-center shadow-2xl border-4 border-[#C5A059] overflow-hidden">
            {branding.logo ? (
              <img src={branding.logo} alt="Logo" className="w-full h-full object-contain p-2" />
            ) : (
              <span className="text-5xl font-display font-black text-[#4A0404]">
                {branding.fallbackText?.[0] || 'W'}
              </span>
            )}
          </div>

          {/* BRAND NAME ON ONE LINE */}
          <div className="space-y-2">
            <h1 className="text-4xl xl:text-5xl font-display font-bold text-[#FDFCF0] tracking-wider uppercase flex items-center justify-center gap-3">
              <span>{branding.fallbackText || 'WONDER'}</span>
              <span className="text-[#C5A059]">{branding.subText || 'FASHIONS'}</span>
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-8 bg-[#C5A059]/50"></div>
              <p className="text-[#C5A059] text-[10px] tracking-[0.5em] font-black uppercase">Management Suite</p>
              <div className="h-px w-8 bg-[#C5A059]/50"></div>
            </div>
          </div>

          <p className="text-white/40 text-xs max-w-xs mx-auto leading-relaxed italic font-light">
            "Authenticity in every thread, precision in every command."
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-10">
          {/* Mobile Header */}
          <div className="lg:hidden text-center space-y-4 mb-12">
             {branding.logo ? (
                <img src={branding.logo} className="h-20 mx-auto" alt="Logo" />
             ) : (
                <div className="w-16 h-16 bg-[#4A0404] rounded-full mx-auto flex items-center justify-center border-2 border-[#C5A059]">
                    <span className="text-2xl font-display font-bold text-[#C5A059]">{branding.fallbackText?.[0]}</span>
                </div>
             )}
             <h2 className="text-3xl font-display font-bold text-[#4A0404] uppercase tracking-tight">
                {branding.fallbackText} <span className="text-[#C5A059]">{branding.subText}</span>
             </h2>
          </div>

          <div className="text-center lg:text-left space-y-2">
            <Link to="/" className="inline-flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#4A0404] transition-colors mb-4 border-b border-transparent hover:border-gray-200 pb-1">
               <ArrowLeft size={14} className="mr-2"/> Back to Boutique
            </Link>
            <h2 className="text-4xl font-display font-bold text-[#1A1A1A]">Admin Access</h2>
            <p className="text-gray-400 text-sm">Please verify your identity to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="relative group">
                <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-2 block group-focus-within:text-[#4A0404] transition-colors">Credential Email</label>
                <div className="relative">
                    <input 
                      type="email" 
                      required
                      className="w-full bg-transparent border-b-2 border-gray-100 py-3 pl-0 pr-10 outline-none focus:border-[#4A0404] transition-all font-medium text-gray-800"
                      placeholder="admin@wonderfashions.com"
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    <Mail className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                </div>
              </div>

              <div className="relative group">
                <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-2 block group-focus-within:text-[#4A0404] transition-colors">Master Password</label>
                <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required
                      className="w-full bg-transparent border-b-2 border-gray-100 py-3 pl-0 pr-10 outline-none focus:border-[#4A0404] transition-all font-medium text-gray-800"
                      placeholder="••••••••"
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#4A0404] transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              loading={authLoading}
              className="py-4 bg-[#4A0404] hover:bg-[#2D0A0A] text-[#C5A059] rounded-none border border-[#C5A059]/50 shadow-2xl uppercase tracking-[0.4em] font-bold text-xs transition-all active:scale-[0.98]"
            >
              Sign In
            </Button>
          </form>

          <div className="pt-12 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest border-t border-gray-50">
            <ShieldCheck size={14} className="text-[#C5A059]"/> <span>Secure Encrypted Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;