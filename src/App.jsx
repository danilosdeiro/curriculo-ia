import { useState } from 'react'
import Landing from './pages/Landing.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Busca from './pages/Busca.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  const [pagina, setPagina] = useState('landing')
  const [usuario, setUsuario] = useState(null)
  const [vagas, setVagas] = useState([])

  const irPara = (p) => setPagina(p)

  if (pagina === 'landing') return <Landing onEntrar={() => irPara('cadastro')} />
  if (pagina === 'cadastro') return (
    <Cadastro
      onConcluir={(dados) => { setUsuario(dados); irPara('busca') }}
    />
  )
  if (pagina === 'busca') return (
    <Busca
      usuario={usuario}
      onConcluir={(vagasEncontradas) => { setVagas(vagasEncontradas); irPara('dashboard') }}
    />
  )
  if (pagina === 'dashboard') return (
    <Dashboard
      usuario={usuario}
      vagas={vagas}
      onNovaBusca={() => irPara('busca')}
    />
  )
}
