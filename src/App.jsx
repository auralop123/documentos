import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Conversor from './Conversor'

function App() {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [logueado, setLogueado] = useState(false)
  const [usuarioRegistro, setUsuarioRegistro] = useState('')
  const [claveRegistro, setClaveRegistro] = useState('')
  const [usuarios, setUsuarios] = useState([])



  function cambiarUsuario(evento) {
    setUsuario(evento.target.value)
  }

  function cambiarClave(evento) {
    setClave(evento.target.value)
  }

  function cambiarUsuarioRegistro(evento) {
    setUsuarioRegistro(evento.target.value)
  }

  function cambiarClaveRegistro(evento) {
    setClaveRegistro(evento.target.value)
  }


  async function ingresar() {
    const peticion = await fetch('http://localhost:3000/login?usuario=' + usuario + '&clave' + clave, { credentials: 'include' })
    if (peticion.ok) {
      setLogueado(true)
      obtenerUsuarios();
    } else {
      alert('Usuario o clave incorrectos')
    }
  }

  async function registrar() {
    const peticion = await fetch('http://localhost:3000/registro?usuario=' + usuarioRegistro + '&clave' + claveRegistro, { credentials: 'include' })
    if (peticion.ok) {
      alert("Usuario registrado")
      setLogueado(true)
      obtenerUsuarios();
    } else {
      alert('Usuario no registrado')
    }
  }


  async function validar() {
    const peticion = await fetch('http://localhost:3000/validar', { credentials: 'include' })
    if (peticion.ok) {
      setLogueado(true)
      obtenerUsuarios();
    }
  }

  async function obtenerUsuarios() {
    const peticion = await fetch('http://localhost:3000/usuarios', { credentials: 'include' })
    if (peticion.ok) {
      const respuesta = await peticion.json()
      setUsuarios(respuesta)
    }
  }
  
  async function eliminarUsuario(id) {
    const peticion = await fetch('http://localhost:3000/usuarios?id=' + id, { credentials: 'include', method: 'DELETE' })
    if (peticion.ok) {
      alert('Usuario eliminado')
      setUsuarios(respuesta)
      obtenerUsuarios();
    }
  }

  useEffect(() => {
    validar()
    
  }, [])


  if (logueado) {
    return (
      <>
    <Conversor />
    <h1>Registro</h1>
      <input placeholder='Usuario' type="text" name="usuario" id="usuario" value={usuarioRegistro} onChange={cambiarUsuarioRegistro} />
      <input placeholder='Clave' type="password" name="clave" id="clave" value={claveRegistro} onChange={cambiarClaveRegistro} />
      <button onClick={registrar}>Registrar</button>

      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>Usuario</th>
            <th>Clave</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {
            usuarios.map(usuario => (
              <tr key={usuario.id}>
                <th>{usuario.id}</th>
                <th>{usuario.usuario}</th>
                <th>{usuario.clave}</th>
                <th>
                  <button
                  onClick={()=>{eliminarUsuario(usuario.id)}}
                  >X</button>
                </th>
              </tr>
            ))
          }
        </tbody>
      </table>
    </>)
  }

  return (
    <>
      <h1>Inicio de sesion</h1>
      <input placeholder='Usuario' type="text" name="usuario" id="usuario" value={usuario} onChange={cambiarUsuario} />
      <input placeholder='Clave' type="password" name="clave" id="clave" value={clave} onChange={cambiarClave} />
      <button onClick={ingresar}>Ingresar</button>



    </>
  )
}

export default App
