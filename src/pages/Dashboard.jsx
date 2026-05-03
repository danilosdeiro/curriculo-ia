import { useState } from 'react'
import CartaoVaga from '../components/CartaoVaga.jsx'

const CORES_PORTAL = {
  Gupy: '#00C897', LinkedIn: '#0A66C2', Indeed: '#2164F3',
  Catho: '#E91E8C', InfoJobs: '#FF6B35', 'Vagas.com': '#6366f1',
}

export default function Dashboard({ usuario, vagas, onNovaBusca }) {
  const [filtro, setFiltro] = useState('todas')
  const [candidatadas, setCandidatadas] = useState([])

  const marcarCandidatada = (id) => setCandidatadas(c => [...c, id])

  const vagasFiltradas = vagas.filter(v => {
    if (filtro === 'alta') return v.match >= 85
    if (filtro === 'remoto') return v.local.toLowerCase().includes('remoto')
    if (filtro === 'candidatadas') return candidatadas.includes(v.id)
    return true
  }).sort((a, b) => b.match - a.match)

  const mediaMatch = Math.round(vagas.reduce((a, v) => a + v.match, 0) / vagas.length)
  const mediaAts = Math.round(vagas.reduce((a, v) => a + v.atsScore, 0) / vagas.length)

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        padding: '16px 32px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--green), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✦</div>
          <span style={{ fontWeight: 800, fontSize: 16 }}>CurrículoIA</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--muted)', fontSize: 14 }}>Olá, <strong style={{ color: 'var(--text)' }}>{usuario.nome.split(' ')[0]}</strong></span>
          <button onClick={onNovaBusca} style={{
            padding: '8px 18px', background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 10, color: 'var(--muted)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13,
          }}>
            🔄 Nova busca
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 24px' }}>
        {/* Título */}
        <div style={{ marginBottom: 28, animation: 'fadeUp 0.4s ease' }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
            Suas vagas — <span style={{ color: 'var(--green)' }}>{vagas.length} encontradas</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15 }}>
            Buscamos em {usuario.portais?.length || 5} portais para o cargo <strong style={{ color: 'var(--text)' }}>"{usuario.cargo}"</strong>
          </p>
        </div>

        {/* Métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Vagas encontradas', valor: vagas.length, cor: 'var(--green)', icone: '🎯' },
            { label: 'Candidatadas', valor: candidatadas.length, cor: 'var(--blue)', icone: '✉️' },
            { label: 'Match médio', valor: `${mediaMatch}%`, cor: '#a78bfa', icone: '📊' },
            { label: 'Score ATS médio', valor: `${mediaAts}%`, cor: 'var(--yellow)', icone: '🤖' },
          ].map(m => (
            <div key={m.label} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '18px 16px', animation: 'fadeUp 0.5s ease',
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{m.icone}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: m.cor, marginBottom: 4 }}>{m.valor}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            ['todas', '📋 Todas'],
            ['alta', '🔥 Alta compatibilidade'],
            ['remoto', '🏠 Remotas'],
            ['candidatadas', `✅ Candidatadas (${candidatadas.length})`],
          ].map(([v, l]) => (
            <button key={v} onClick={() => setFiltro(v)} style={{
              padding: '9px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
              background: filtro === v ? 'linear-gradient(135deg, var(--green), var(--blue))' : 'var(--surface)',
              color: filtro === v ? '#fff' : 'var(--muted)',
              border: filtro === v ? 'none' : '1px solid var(--border)',
            }}>
              {l}
            </button>
          ))}
        </div>

        {/* Lista de vagas */}
        {vagasFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p>Nenhuma vaga neste filtro ainda.</p>
          </div>
        ) : (
          vagasFiltradas.map((vaga, i) => (
            <CartaoVaga
              key={vaga.id}
              vaga={vaga}
              usuario={usuario}
              jaCandidata={candidatadas.includes(vaga.id)}
              onCandidatar={() => marcarCandidatada(vaga.id)}
              delay={i * 60}
            />
          ))
        )}
      </div>
    </div>
  )
}
