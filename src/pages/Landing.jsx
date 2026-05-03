import { useState, useEffect } from 'react'

const PORTAIS = ['Gupy', 'LinkedIn', 'Indeed', 'Catho', 'InfoJobs', 'Vagas.com']

export default function Landing({ onEntrar }) {
  const [portalIdx, setPortalIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setPortalIdx(i => (i + 1) % PORTAIS.length), 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--green), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✦</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>CurrículoIA</span>
        </div>
        <button onClick={onEntrar} style={{ padding: '10px 24px', background: 'var(--green)', color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14 }}>
          Começar grátis →
        </button>
      </nav>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 24px', animation: 'fadeUp 0.6s ease' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 13, color: 'var(--green)', marginBottom: 32, fontWeight: 600 }}>
          ✦ Inteligência artificial para sua carreira
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, marginBottom: 16, maxWidth: 800 }}>
          Encontre sua vaga<br />
          <span style={{ background: 'linear-gradient(90deg, var(--green), var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            no {PORTAIS[portalIdx]}
          </span>
        </h1>

        <p style={{ fontSize: 18, color: 'var(--muted)', maxWidth: 560, lineHeight: 1.7, marginBottom: 40 }}>
          Você preenche seu perfil uma vez. A IA busca vagas nos principais portais do Brasil, adapta seu currículo para cada uma e gera mensagens personalizadas para os recrutadores.
        </p>

        <button onClick={onEntrar} style={{
          padding: '16px 40px', background: 'linear-gradient(135deg, var(--green), var(--blue))', color: '#fff',
          border: 'none', borderRadius: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font)',
          fontSize: 16, letterSpacing: -0.3, boxShadow: '0 0 40px #00e5a030',
        }}>
          Criar meu perfil gratuitamente
        </button>

        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 16 }}>Sem cartão de crédito · Funciona em minutos</p>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 80, maxWidth: 860, width: '100%' }}>
          {[
            { icon: '🔍', title: 'Busca nos portais', desc: 'Gupy, LinkedIn, Indeed, Catho, InfoJobs e mais' },
            { icon: '📝', title: 'Currículo adaptado', desc: 'A IA reescreve para passar na triagem automática (ATS)' },
            { icon: '💬', title: 'Mensagem pro recrutador', desc: 'Texto personalizado gerado para cada vaga' },
            { icon: '📊', title: 'Painel de candidaturas', desc: 'Acompanhe tudo em um só lugar' },
          ].map(f => (
            <div key={f.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 20px', textAlign: 'left' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>{f.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
