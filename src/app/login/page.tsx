'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-container">
      <div className="auth-card animate-fade-in">
        <div className="tabs">
          <button 
            className={`tab ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => setMode('signin')}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Registrarse
          </button>
        </div>

        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          {mode === 'signin' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {mode === 'signin' 
            ? 'Ingresa tus credenciales para acceder a tu panel.' 
            : 'Únete a nosotros y comienza a construir algo increíble.'}
        </p>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleAuth}>
          <div className="input-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Procesando...' : (mode === 'signin' ? 'Entrar' : 'Registrarse')}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          {mode === 'signin' ? (
            <p>¿No tienes cuenta? <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setMode('signup')}>Crea una aquí</span></p>
          ) : (
            <p>¿Ya tienes cuenta? <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setMode('signin')}>Inicia sesión</span></p>
          )}
        </div>
      </div>
    </main>
  );
}
