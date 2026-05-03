import { useState, useEffect, useRef } from 'react'

const LOGS_INICIAIS = [
  { texto: 'Iniciando sistema de busca inteligente...', cor: 'var(--green)', icone: '⚡' },
  { texto: 'Carregando perfil do usuário...', cor: 'var(--muted)', icone: '👤' },
]

const VAGAS_DEMO = [
  {
    id: 1, portal: 'Gupy', empresa: 'Nubank', titulo: 'Desenvolvedor Frontend Sênior',
    local: 'São Paulo, SP (Híbrido)', salario: 'R$ 12.000 – R$ 18.000',
    match: 94, atsScore: 91, tags: ['React', 'TypeScript', 'Node.js'],
    descricao: 'Buscamos dev com experiência em React e TypeScript para integrar time de produto digital.',
    link: 'https://nubank.gupy.io',
  },
  {
    id: 2, portal: 'LinkedIn', empresa: 'Itaú Unibanco', titulo: 'Engenheiro de Software Pleno',
    local: 'São Paulo, SP (Presencial)', salario: 'R$ 9.000 – R$ 13.000',
    match: 87, atsScore: 84, tags: ['Java', 'Spring Boot', 'Microsserviços'],
    descricao: 'Vaga para engenheiro focado em back-end e arquitetura de microsserviços no maior banco privado do Brasil.',
    link: 'https://linkedin.com/jobs',
  },
  {
    id: 3, portal: 'Indeed', empresa: 'Totvs', titulo: 'Analista de Sistemas',
    local: 'Remoto', salario: 'R$ 7.000 – R$ 10.000',
    match: 79, atsScore: 77, tags: ['Python', 'SQL', 'APIs REST'],
    descricao: 'Oportunidade para profissional que deseja trabalhar com soluções ERP e integração de sistemas.',
    link: 'https://br.indeed.com',
  },
  {
    id: 4, portal: 'Catho', empresa: 'Ambev Tech', titulo: 'Dev Full Stack',
    local: 'São Paulo, SP (Híbrido)', salario: 'R$ 10.000 – R$ 15.000',
    match: 82, atsScore: 80, tags: ['React', 'Python', 'AWS'],
    descricao: 'Faça parte do time de tecnologia da maior cervejaria do mundo e desenvolva produtos de impacto.',
    link: 'https://catho.com.br',
  },
  {
    id: 5, portal: 'InfoJobs', empresa: 'CI&T', titulo: 'Software Engineer',
    local: 'Remoto', salario: 'R$ 11.000 – R$ 16.000',
    match: 88, atsScore: 85, tags: ['React', 'AWS', 'Agile'],
    descricao: 'Empresa global de tecnologia busca engenheiro para projetos com clientes internacionais.',
    link: 'https://infojobs.com.br',
  },
]

export default function Busca({ usuario, onConcluir }) {
  const [logs, setLogs] = useState(LOGS_INICIAIS)
  const [progresso, setProgresso] = useState(0)
  const [concluido, setConcluido] = useState(false)
  const logRef = useRef(null)

  const addLog = (texto, cor = 'var(--muted)', icone = '→') => {
    setLogs(l => [...l, { texto, cor, icone }])
    setTimeout(() => logRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 50)
  }

  useEffect(() => {
    const run = async () => {
      await delay(600)
      addLog(`Perfil carregado: ${usuario.nome} — buscando "${usuario.cargo}"`, 'var(--green)', '✓')
      setProgresso(8)

      const portais = usuario.portais || []
      const nomes = { gupy: 'Gupy', linkedin: 'LinkedIn', indeed: 'Indeed', catho: 'Catho', infojobs: 'InfoJobs', vagas: 'Vagas.com' }

      await delay(500)
      addLog('Conectando nos portais selecionados...', 'var(--muted)', '🔌')

      for (let i = 0; i < portais.length; i++) {
        await delay(700)
        const nome = nomes[portais[i]] || portais[i]
        const qtd = Math.floor(Math.random() * 25) + 8
        addLog(`${nome}: ${qtd} vagas encontradas para "${usuario.cargo}"`, '#60a5fa', '📡')
        setProgresso(8 + Math.round((i + 1) / portais.length * 35))
      }

      await delay(800)
      addLog('Filtrando vagas com maior compatibilidade ao seu perfil...', 'var(--muted)', '🔎')
      setProgresso(50)

      await delay(1000)
      addLog('Analisando requisitos de cada vaga com IA...', '#a78bfa', '🤖')
      setProgresso(62)

      await delay(1200)
      addLog('Calculando score de compatibilidade (Match %) para cada vaga...', '#a78bfa', '📊')
      setProgresso(74)

      await delay(900)
      addLog('Calculando score ATS — chances de passar na triagem automática...', '#f59e0b', '⚙️')
      setProgresso(86)

      await delay(800)
      addLog(`${VAGAS_DEMO.length} vagas selecionadas e ordenadas por compatibilidade!`, 'var(--green)', '✨')
      setProgresso(100)

      await delay(600)
      addLog('Tudo pronto! Abrindo seu painel de candidaturas...', 'var(--green)', '🎉')
      setConcluido(true)

      await delay(1500)
      onConcluir(VAGAS_DEMO)
    }
    run()
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 640 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: concluido ? 'none' : 'pulse 2s infinite' }}>
            {concluido ? '🎉' : '🤖'}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
            {concluido ? 'Busca concluída!' : 'Buscando vagas para você...'}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15 }}>
            {concluido ? 'Encontramos as melhores oportunidades para o seu perfil.' : 'Aguarde enquanto a IA vasculha os portais.'}
          </p>
        </div>

        {/* Barra de progresso */}
        <div style={{ background: 'var(--surface)', borderRadius: 99, padding: 4, marginBottom: 8 }}>
          <div style={{
            height: 10, borderRadius: 99, width: `${progresso}%`,
            background: 'linear-gradient(90deg, var(--green), var(--blue))',
            transition: 'width 0.6s ease',
            boxShadow: '0 0 12px #00e5a050',
          }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: 13, color: 'var(--green)', fontWeight: 700, marginBottom: 24 }}>
          {progresso}%
        </div>

        {/* Terminal de logs */}
        <div
          ref={logRef}
          style={{
            background: '#050709', border: '1px solid var(--border)', borderRadius: 16,
            padding: '20px', height: 280, overflowY: 'auto', fontFamily: 'var(--mono)',
          }}
        >
          <div style={{ color: '#3b82f6', fontSize: 11, marginBottom: 16 }}>
            ● curriculo-ia v1.0 — busca iniciada às {new Date().toLocaleTimeString()}
          </div>
          {logs.map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 12, animation: 'fadeUp 0.3s ease' }}>
              <span style={{ color: 'var(--border2)', whiteSpace: 'nowrap' }}>
                {new Date().toLocaleTimeString()}
              </span>
              <span style={{ flexShrink: 0 }}>{l.icone}</span>
              <span style={{ color: l.cor }}>{l.texto}</span>
            </div>
          ))}
          {!concluido && (
            <span style={{ color: 'var(--green)', animation: 'blink 1s infinite', fontFamily: 'var(--mono)' }}>▋</span>
          )}
        </div>
      </div>
    </div>
  )
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }
