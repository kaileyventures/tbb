'use client';

import React from 'react';
import { Lock } from 'lucide-react';

interface AdminAuthProps {
  inputPassword: string;
  setInputPassword: (v: string) => void;
  authError: string;
  handlePasswordSubmit: (e: React.FormEvent) => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({
  inputPassword,
  setInputPassword,
  authError,
  handlePasswordSubmit,
}) => {
  return (
    <div style={{ minHeight: '100vh', background: '#0b0f19', color: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif', padding: '20px' }}>
      <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '24px', padding: '40px 32px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' }}>
        <div style={{ width: '56px', height: '56px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', margin: '0 auto 20px auto' }}>
          <Lock size={28} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0', background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Admin Access Protected
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px', lineHeight: '1.5' }}>
          Enter your secret Admin password to unlock The Baker Bro dashboard.
        </p>

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="password" required
            placeholder="Enter Admin Password..."
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            style={{ width: '100%', padding: '14px 16px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none', textAlign: 'center', letterSpacing: '0.1em' }}
          />

          {authError && (
            <div style={{ color: '#f87171', fontSize: '13px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {authError}
            </div>
          )}

          <button
            type="submit"
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)', transition: 'transform 0.15s ease' }}>
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};
