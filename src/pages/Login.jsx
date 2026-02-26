import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/axios'
import AuthContext from '../context/AuthProvider'
import Swal from 'sweetalert2'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const { setAuth } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if([email, password].includes('')){
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }

        try {
            // Consumo del endpoint de login
            const { data } = await clienteAxios.post('/login', { email, password })
            
            localStorage.setItem('token', data.token)
            setAuth(data)
            navigate('/dashboard')
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: error.response?.data?.msg || "Usuario o contraseña incorrectos" 
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-violet-50">
            <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md border-t-8 border-violet-600">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-gray-800">
                        Conf<span className="text-violet-600">Admin</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Gestión de Eventos y Conferencias</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2 uppercase text-sm">Email del Organizador</label>
                        <input 
                            type="email" 
                            placeholder="admin@eventos.com"
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="mb-8">
                        <label className="block text-gray-700 font-bold mb-2 uppercase text-sm">Clave de Acceso</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black py-3 rounded-lg uppercase tracking-wide transition-colors shadow-lg"
                    >
                        Ingresar al Portal
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login