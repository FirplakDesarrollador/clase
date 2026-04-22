'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="animate-pulse" style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 600 }}>Cargando...</div>
      </main>
    );
  }

  return (
    <main>
      <header className="home-header animate-fade-in">
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#64748b' }}>Panel de Control</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user ? (
            <>
              <div className="user-badge">
                <div className="avatar">{user.email?.[0].toUpperCase()}</div>
                <span style={{ fontSize: '0.9rem' }}>{user.email}</span>
              </div>
              <button className="btn" style={{ background: 'transparent', border: '1px solid var(--border)', padding: '0.5rem 1rem' }} onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <button className="btn" onClick={() => router.push('/login')}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </header>

      <section className="hero animate-fade-in" style={{ textAlign: 'left', paddingTop: '1rem', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem' }}>
          {user ? `Hola de nuevo, ${user.email?.split('@')[0]}` : 'Bienvenido a tu App'}
        </h1>
        <p style={{ margin: '0' }}>
          {user 
            ? 'Aquí tienes un resumen de tu actividad y acceso rápido a tus herramientas.' 
            : 'Conecta tu cuenta para acceder a todas las funcionalidades premium.'}
        </p>
      </section>

      <div className="card-grid">
        <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2>
            <span>📊</span> Estadísticas
          </h2>
          <p>Visualiza el rendimiento de tus proyectos en tiempo real con gráficas interactivas.</p>
          <div style={{ marginTop: '1.5rem', height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: '65%', height: '100%', background: 'var(--primary)' }}></div>
          </div>
          <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>65% de tus objetivos completados</p>
        </div>

        <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2>
            <span>🛡️</span> Seguridad
          </h2>
          <p>Tu sesión está protegida por Supabase Auth. Puedes gestionar tus factores de autenticación en ajustes.</p>
          <div style={{ marginTop: '1.5rem' }}>
             <span className="status-badge status-online">Protección Activa</span>
          </div>
        </div>

        <div className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2>
            <span>⚡</span> Acciones Rápidas
          </h2>
          <p>Realiza tareas comunes de forma inmediata con nuestros accesos directos optimizados.</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
            <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Nuevo Proyecto</button>
            <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--secondary)' }}>Reportes</button>
          </div>
        </div>
      </div>

      {!user && (
        <div className="card animate-fade-in" style={{ marginTop: '3rem', textAlign: 'center', background: 'linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))' }}>
          <h2>¡Empieza hoy mismo!</h2>
          <p style={{ marginBottom: '1.5rem' }}>Únete a miles de desarrolladores que ya están construyendo el futuro.</p>
          <button className="btn" onClick={() => router.push('/login')}>Crear Cuenta Gratis</button>
        </div>
      )}
    </main>
  );
}
