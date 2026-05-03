import { useState } from 'react'

const CORES_PORTAL = {
  Gupy: '#00C897', LinkedIn: '#0A66C2', Indeed: '#2164F3',
  Catho: '#E91E8C', InfoJobs: '#FF6B35', 'Vagas.com': '#6366f1',
}

function ScoreCirculo({ valor, label, cor }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 54, height: 54, borderRadius: '50%',
        border: `3px solid ${cor}`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: `${cor}12`,
      }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: cor }}>{valor}%</span>
      </div>
      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 5 }}>{label}</div>
    </div>
  )
}

async function chamarIA(prompt, sistema) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: sistema,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await resp.json()
  return data.content?.map(b => b.text || '').join('') || ''
}

export default function CartaoVaga({ vaga, usuario, jaCandidata, onCandidatar, delay = 0 }) {
  const [aberto, setAberto] = useState(false)
  const [curriculoAdaptado, setCurriculoAdaptado] = useState('')
  const [mensagemRecrutador, setMensagemRecrutador] = useState('')
  const [carregandoCV, setCarregandoCV] = useState(false)
  const [carregandoMsg, setCarregandoMsg] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState('curriculo')

  const corPortal = CORES_PORTAL[vaga.portal] || 'var(--blue)'
  const corMatch = vaga.match >= 85 ? 'var(--green)' : vaga.match >= 70 ? 'var(--yellow)' : 'var(--red)'
  const corAts = vaga.atsScore >= 80 ? 'var(--green)' : vaga.atsScore >= 65 ? 'var(--yellow)' : 'var(--red)'

  const gerarCurriculo = async () => {
    if (curriculoAdaptado) return
    setCarregandoCV(true)
    try {
      const resultado = await chamarIA(
        `Adapte este currículo para a vaga abaixo. Otimize para sistemas ATS: use as palavras-chave da vaga naturalmente, ajuste a ordem das experiências para destacar o mais relevante, e formate de forma limpa sem tabelas ou colunas.

VAGA: ${vaga.titulo} — ${vaga.empresa}
Descrição: ${vaga.descricao}
Habilidades pedidas: ${vaga.tags.join(', ')}
Local: ${vaga.local}

CURRÍCULO ORIGINAL DO CANDIDATO:
${usuario.curriculo || 'Não fornecido — gere um modelo baseado no cargo de ' + usuario.cargo}

Nome do candidato: ${usuario.nome}
E-mail: ${usuario.email}
Telefone: ${usuario.telefone || ''}
Cidade: ${usuario.cidade || ''}`,
        'Você é especialista em currículos para o mercado de trabalho brasileiro. Adapte o currículo mantendo apenas informações verídicas, otimizando para triagem ATS. Responda apenas com o currículo adaptado em texto corrido, sem explicações extras. Use PT-BR.'
      )
      setCurriculoAdaptado(resultado)
    } catch {
      setCurriculoAdaptado('Erro ao gerar. Verifique sua conexão e tente novamente.')
    }
    setCarregandoCV(false)
  }

  const gerarMensagem = async () => {
    if (mensagemRecrutador) return
    setCarregandoMsg(true)
    try {
      const resultado = await chamarIA(
        `Escreva uma mensagem profissional e personalizada para enviar ao recrutador sobre esta vaga.

CANDIDATO: ${usuario.nome}
Cargo que busca: ${usuario.cargo}
Cidade: ${usuario.cidade || 'não informada'}
Currículo resumido: ${(usuario.curriculo || '').slice(0, 400)}

VAGA: ${vaga.titulo} na ${vaga.empresa}
Portal: ${vaga.portal}
Local: ${vaga.local}
Salário: ${vaga.salario}
Descrição: ${vaga.descricao}

A mensagem deve:
- Ser direta e profissional (não muito longa, no máximo 5 parágrafos)
- Mencionar o cargo e a empresa pelo nome
- Destacar 2-3 pontos do candidato que se encaixam na vaga
- Terminar com chamada para ação (agendar conversa)
- Tom humano e confiante, não robótico`,
        'Você é especialista em comunicação profissional para o mercado brasileiro. Escreva mensagens que pareçam genuínas e humanas. Responda apenas com a mensagem, sem explicações. Use PT-BR.'
      )
      setMensagemRecrutador(resultado)
    } catch {
      setMensagemRecrutador('Erro ao gerar. Verifique sua conexão e tente novamente.')
    }
    setCarregandoMsg(false)
  }

  const abrirEGerar = () => {
    setAberto(true)
    gerarCurriculo()
    gerarMensagem()
  }

  const copiar = (texto) => {
    navigator.clipboard.writeText(texto)
    alert('Copiado para a área de transferência!')
  }

  return (
    <div style={{
      background: 'var(--surface)', border: `1px solid ${jaCandidata ? '#00e5a040' : 'var(--border)'}`,
      borderRadius: 18, marginBottom: 16, overflow: 'hidden',
      animation: `fadeUp 0.4s ease ${delay}ms both`,
      boxShadow: jaCandidata ? '0 0 0 1px #00e5a020' : 'none',
    }}>
      {/* Cabeçalho do cartão */}
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1 }}>
            {/* Portal + status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <span style={{
                padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                background: `${corPortal}20`, color: corPortal,
              }}>
                {vaga.portal}
              </span>
              {jaCandidata && (
                <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: '#00e5a015', color: 'var(--green)' }}>
                  ✓ Candidatura enviada
                </span>
              )}
            </div>

            {/* Título e empresa */}
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4, lineHeight: 1.3 }}>{vaga.titulo}</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 10 }}>
              🏢 {vaga.empresa} &nbsp;·&nbsp; 📍 {vaga.local}
            </p>
            <p style={{ color: 'var(--green)', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{vaga.salario}</p>

            {/* Tags de habilidades */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {vaga.tags.map(t => (
                <span key={t} style={{ padding: '4px 12px', background: '#3b82f615', color: '#60a5fa', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Scores */}
          <div style={{ display: 'flex', gap: 14, flexShrink: 0 }}>
            <ScoreCirculo valor={vaga.match} label="Match" cor={corMatch} />
            <ScoreCirculo valor={vaga.atsScore} label="ATS" cor={corAts} />
          </div>
        </div>

        {/* Botões de ação */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          <button
            onClick={aberto ? () => setAberto(false) : abrirEGerar}
            style={{
              padding: '9px 18px', borderRadius: 10, border: '1px solid var(--border)',
              background: aberto ? 'var(--surface2)' : 'var(--surface2)', color: 'var(--text)',
              fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13,
            }}>
            {aberto ? '▲ Fechar detalhes' : '🤖 Ver currículo adaptado + mensagem'}
          </button>

          <a href={vaga.link} target="_blank" rel="noopener noreferrer" style={{
            padding: '9px 18px', borderRadius: 10, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--muted)',
            fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13,
            textDecoration: 'none',
          }}>
            🔗 Ver vaga original
          </a>

          {!jaCandidata && (
            <button onClick={onCandidatar} style={{
              padding: '9px 18px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, var(--green), var(--blue))',
              color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13,
              marginLeft: 'auto',
            }}>
              ✉️ Marcar como candidatado
            </button>
          )}
        </div>
      </div>

      {/* Painel expandido */}
      {aberto && (
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--surface2)' }}>
          {/* Abas */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
            {[['curriculo', '📄 Currículo Adaptado'], ['mensagem', '💬 Mensagem pro Recrutador'], ['vaga', '📋 Sobre a Vaga']].map(([v, l]) => (
              <button key={v} onClick={() => setAbaAtiva(v)} style={{
                padding: '14px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
                fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13,
                color: abaAtiva === v ? 'var(--green)' : 'var(--muted)',
                borderBottom: abaAtiva === v ? '2px solid var(--green)' : '2px solid transparent',
                marginBottom: -1,
              }}>
                {l}
              </button>
            ))}
          </div>

          <div style={{ padding: '24px' }}>
            {/* Aba: Currículo */}
            {abaAtiva === 'curriculo' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Currículo otimizado para esta vaga</h4>
                    <p style={{ color: 'var(--muted)', fontSize: 13 }}>
                      Adaptado para passar na triagem automática (ATS) do {vaga.empresa}
                    </p>
                  </div>
                  {curriculoAdaptado && (
                    <button onClick={() => copiar(curriculoAdaptado)} style={{
                      padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 10,
                      background: 'transparent', color: 'var(--muted)', cursor: 'pointer',
                      fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, flexShrink: 0,
                    }}>
                      📋 Copiar
                    </button>
                  )}
                </div>

                {carregandoCV ? (
                  <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 12, animation: 'pulse 1.5s infinite' }}>🤖</div>
                    <p style={{ color: 'var(--green)', fontWeight: 600 }}>IA adaptando seu currículo...</p>
                    <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>Analisando os requisitos da vaga e seu perfil</p>
                  </div>
                ) : (
                  <pre style={{
                    background: 'var(--bg)', borderRadius: 12, padding: '20px',
                    color: 'var(--text)', fontSize: 13, lineHeight: 1.8,
                    whiteSpace: 'pre-wrap', fontFamily: 'var(--mono)',
                    maxHeight: 400, overflowY: 'auto', margin: 0,
                  }}>
                    {curriculoAdaptado}
                  </pre>
                )}
              </div>
            )}

            {/* Aba: Mensagem */}
            {abaAtiva === 'mensagem' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Mensagem para o recrutador</h4>
                    <p style={{ color: 'var(--muted)', fontSize: 13 }}>
                      Texto personalizado para enviar via {vaga.portal} ou LinkedIn
                    </p>
                  </div>
                  {mensagemRecrutador && (
                    <button onClick={() => copiar(mensagemRecrutador)} style={{
                      padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 10,
                      background: 'transparent', color: 'var(--muted)', cursor: 'pointer',
                      fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, flexShrink: 0,
                    }}>
                      📋 Copiar mensagem
                    </button>
                  )}
                </div>

                {carregandoMsg ? (
                  <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 12, animation: 'pulse 1.5s infinite' }}>✍️</div>
                    <p style={{ color: 'var(--blue)', fontWeight: 600 }}>Redigindo mensagem personalizada...</p>
                    <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>Criando um texto humano e profissional</p>
                  </div>
                ) : (
                  <div>
                    <div style={{
                      background: 'var(--bg)', borderRadius: 12, padding: '20px',
                      fontSize: 14, lineHeight: 1.8, color: 'var(--text)',
                      whiteSpace: 'pre-wrap', maxHeight: 360, overflowY: 'auto',
                      border: '1px solid var(--border)',
                    }}>
                      {mensagemRecrutador}
                    </div>
                    <div style={{ marginTop: 12, padding: '12px 16px', background: '#3b82f610', border: '1px solid #3b82f630', borderRadius: 10, fontSize: 13, color: '#60a5fa' }}>
                      💡 <strong>Dica:</strong> Revise o texto antes de enviar e adicione detalhes pessoais se quiser. Você envia — a IA só prepara.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Aba: Sobre a vaga */}
            {abaAtiva === 'vaga' && (
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Detalhes da vaga</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  {[
                    ['Empresa', vaga.empresa],
                    ['Cargo', vaga.titulo],
                    ['Local', vaga.local],
                    ['Salário', vaga.salario],
                    ['Portal', vaga.portal],
                    ['Modelo', vaga.local.includes('Remoto') ? 'Remoto' : vaga.local.includes('Híbrido') ? 'Híbrido' : 'Presencial'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px 16px' }}>
                      <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{k}</div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Descrição</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)' }}>{vaga.descricao}</p>
                </div>
                <div style={{ marginTop: 16 }}>
                  <a href={vaga.link} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-block', padding: '10px 20px', background: 'var(--surface)',
                    border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)',
                    textDecoration: 'none', fontWeight: 600, fontSize: 13,
                  }}>
                    🔗 Abrir vaga no {vaga.portal}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
