import { useState } from 'react'

const ETAPAS = ['Perfil', 'Currículo', 'Preferências']

function Label({ children }) {
  return <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{children}</label>
}

function Campo({ label, children }) {
  return <div style={{ marginBottom: 20 }}><Label>{label}</Label>{children}</div>
}

function BotaoEtapa({ label, ativo, concluido, numero }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 13,
        background: concluido ? 'var(--green)' : ativo ? 'var(--blue)' : 'var(--surface2)',
        color: concluido || ativo ? '#fff' : 'var(--muted)',
        border: ativo ? '2px solid var(--blue)' : '2px solid transparent',
        boxShadow: ativo ? '0 0 16px #3b82f640' : 'none',
      }}>
        {concluido ? '✓' : numero}
      </div>
      <span style={{ fontWeight: ativo ? 700 : 500, color: ativo ? 'var(--text)' : 'var(--muted)', fontSize: 14 }}>{label}</span>
    </div>
  )
}

export default function Cadastro({ onConcluir }) {
  const [etapa, setEtapa] = useState(0)
  const [modoCV, setModoCV] = useState('digitar')
  const [dados, setDados] = useState({
    nome: '', email: '', telefone: '', cidade: '',
    curriculo: '', fileName: '',
    cargo: '', local: '', salario: '', modelo: '',
    portais: ['gupy', 'linkedin', 'indeed', 'catho', 'infojobs'],
  })

  const set = (campo, valor) => setDados(d => ({ ...d, [campo]: valor }))

  const handleArquivo = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => set('curriculo', ev.target.result)
    reader.readAsText(file)
    set('fileName', file.name)
  }

  const togglePortal = (id) => {
    setDados(d => ({
      ...d,
      portais: d.portais.includes(id) ? d.portais.filter(p => p !== id) : [...d.portais, id]
    }))
  }

  const podeAvancar = [
    dados.nome && dados.email,
    dados.curriculo.length > 50,
    dados.cargo,
  ][etapa]

  const PORTAIS = [
    { id: 'gupy', nome: 'Gupy', cor: '#00C897', emoji: '🚀' },
    { id: 'linkedin', nome: 'LinkedIn', cor: '#0A66C2', emoji: '🔗' },
    { id: 'indeed', nome: 'Indeed', cor: '#2164F3', emoji: '🔍' },
    { id: 'catho', nome: 'Catho', cor: '#E91E8C', emoji: '📋' },
    { id: 'infojobs', nome: 'InfoJobs', cor: '#FF6B35', emoji: '💼' },
    { id: 'vagas', nome: 'Vagas.com', cor: '#6366f1', emoji: '🎯' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, background: 'var(--surface)', borderRight: '1px solid var(--border)',
        padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 8,
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--green), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✦</div>
          <span style={{ fontWeight: 800, fontSize: 16 }}>CurrículoIA</span>
        </div>
        {ETAPAS.map((e, i) => (
          <div key={e} style={{ marginBottom: 8 }}>
            <BotaoEtapa label={e} numero={i + 1} ativo={etapa === i} concluido={etapa > i} />
            {i < ETAPAS.length - 1 && (
              <div style={{ width: 2, height: 20, background: etapa > i ? 'var(--green)' : 'var(--border)', marginLeft: 15, marginTop: 4 }} />
            )}
          </div>
        ))}
        <div style={{ marginTop: 'auto', padding: '16px', background: 'var(--surface2)', borderRadius: 12, fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
          💡 <strong style={{ color: 'var(--text)' }}>Dica:</strong> Quanto mais detalhado seu currículo, melhor a IA consegue adaptá-lo para cada vaga.
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '48px', maxWidth: 680, animation: 'fadeUp 0.4s ease' }}>

        {/* Etapa 1 - Perfil */}
        {etapa === 0 && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Seu perfil</h1>
            <p style={{ color: 'var(--muted)', marginBottom: 36, lineHeight: 1.6 }}>
              Informações básicas para personalizar sua busca.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <Campo label="Nome completo">
                <input placeholder="João Silva" value={dados.nome} onChange={e => set('nome', e.target.value)} />
              </Campo>
              <Campo label="E-mail">
                <input type="email" placeholder="joao@email.com" value={dados.email} onChange={e => set('email', e.target.value)} />
              </Campo>
              <Campo label="Telefone / WhatsApp">
                <input placeholder="(11) 99999-9999" value={dados.telefone} onChange={e => set('telefone', e.target.value)} />
              </Campo>
              <Campo label="Cidade / Estado">
                <input placeholder="São Paulo, SP" value={dados.cidade} onChange={e => set('cidade', e.target.value)} />
              </Campo>
            </div>
          </div>
        )}

        {/* Etapa 2 - Currículo */}
        {etapa === 1 && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Seu currículo</h1>
            <p style={{ color: 'var(--muted)', marginBottom: 24, lineHeight: 1.6 }}>
              Cole o conteúdo ou faça upload. A IA vai ler e adaptar para cada vaga.
            </p>

            {/* Toggle modo */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--surface)', padding: 4, borderRadius: 12, width: 'fit-content' }}>
              {[['digitar', '✏️ Digitar / Colar'], ['upload', '📎 Enviar arquivo']].map(([modo, label]) => (
                <button key={modo} onClick={() => setModoCV(modo)} style={{
                  padding: '9px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'var(--font)',
                  fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
                  background: modoCV === modo ? 'var(--blue)' : 'transparent',
                  color: modoCV === modo ? '#fff' : 'var(--muted)',
                }}>
                  {label}
                </button>
              ))}
            </div>

            {modoCV === 'digitar' ? (
              <Campo label="Conteúdo do currículo">
                <textarea
                  rows={14}
                  placeholder={`Cole aqui o conteúdo do seu currículo...\n\nExemplo:\nNome: João Silva\nExperiência: 3 anos como Dev Frontend (React, TypeScript)\nFormação: Ciência da Computação — UNICAMP (2021)\nHabilidades: React, Node.js, SQL, Git...`}
                  value={dados.curriculo}
                  onChange={e => set('curriculo', e.target.value)}
                />
              </Campo>
            ) : (
              <div
                onClick={() => document.getElementById('file-cv').click()}
                style={{
                  border: '2px dashed var(--border2)', borderRadius: 16, padding: '48px 32px',
                  textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s',
                  background: 'var(--surface)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}
              >
                <input id="file-cv" type="file" accept=".txt,.pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleArquivo} />
                {dados.fileName ? (
                  <>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                    <p style={{ color: 'var(--green)', fontWeight: 700, marginBottom: 4 }}>{dados.fileName}</p>
                    <p style={{ color: 'var(--muted)', fontSize: 13 }}>Clique para trocar</p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>Clique para selecionar o arquivo</p>
                    <p style={{ color: 'var(--muted)', fontSize: 13 }}>Suporta .txt, .pdf, .doc, .docx</p>
                  </>
                )}
              </div>
            )}

            {dados.curriculo && (
              <div style={{ marginTop: 12, padding: '12px 16px', background: '#00e5a010', border: '1px solid #00e5a030', borderRadius: 10, fontSize: 13, color: 'var(--green)' }}>
                ✓ Currículo recebido com {dados.curriculo.length} caracteres. A IA vai adaptá-lo para cada vaga.
              </div>
            )}
          </div>
        )}

        {/* Etapa 3 - Preferências */}
        {etapa === 2 && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>O que você busca?</h1>
            <p style={{ color: 'var(--muted)', marginBottom: 36, lineHeight: 1.6 }}>
              Configure onde e o que buscar. Quanto mais específico, melhor.
            </p>

            <Campo label="Cargo ou função desejada">
              <input placeholder="Ex: Desenvolvedor Frontend, Analista de Marketing, Designer UX..." value={dados.cargo} onChange={e => set('cargo', e.target.value)} />
            </Campo>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <Campo label="Localização">
                <input placeholder="São Paulo, SP / Remoto" value={dados.local} onChange={e => set('local', e.target.value)} />
              </Campo>
              <Campo label="Modelo de trabalho">
                <select value={dados.modelo} onChange={e => set('modelo', e.target.value)}>
                  <option value="">Qualquer um</option>
                  <option>Remoto</option>
                  <option>Presencial</option>
                  <option>Híbrido</option>
                </select>
              </Campo>
            </div>

            <Campo label="Pretensão salarial">
              <select value={dados.salario} onChange={e => set('salario', e.target.value)}>
                <option value="">Sem preferência</option>
                <option>Até R$ 3.000</option>
                <option>R$ 3.000 – R$ 5.000</option>
                <option>R$ 5.000 – R$ 8.000</option>
                <option>R$ 8.000 – R$ 12.000</option>
                <option>R$ 12.000 – R$ 18.000</option>
                <option>Acima de R$ 18.000</option>
              </select>
            </Campo>

            <Label>Portais para buscar</Label>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>Selecione onde a IA deve procurar vagas:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 8 }}>
              {PORTAIS.map(p => {
                const ativo = dados.portais.includes(p.id)
                return (
                  <div key={p.id} onClick={() => togglePortal(p.id)} style={{
                    padding: '16px 12px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                    border: `2px solid ${ativo ? p.cor : 'var(--border)'}`,
                    background: ativo ? `${p.cor}12` : 'var(--surface)',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ fontSize: 26, marginBottom: 6 }}>{p.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: ativo ? p.cor : 'var(--muted)' }}>{p.nome}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Botões de navegação */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
          {etapa > 0 ? (
            <button onClick={() => setEtapa(e => e - 1)} style={{
              padding: '12px 24px', background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 12, color: 'var(--muted)', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14,
            }}>← Voltar</button>
          ) : <div />}

          <button
            onClick={() => etapa < 2 ? setEtapa(e => e + 1) : onConcluir(dados)}
            disabled={!podeAvancar}
            style={{
              padding: '12px 32px', border: 'none', borderRadius: 12, fontWeight: 800, cursor: podeAvancar ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font)', fontSize: 14, transition: 'all 0.2s',
              background: podeAvancar ? 'linear-gradient(135deg, var(--green), var(--blue))' : 'var(--surface2)',
              color: podeAvancar ? '#fff' : 'var(--muted)', opacity: podeAvancar ? 1 : 0.6,
            }}>
            {etapa === 2 ? '🚀 Iniciar busca com IA' : 'Próximo →'}
          </button>
        </div>
      </main>
    </div>
  )
}
