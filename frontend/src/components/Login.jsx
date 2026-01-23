import React from 'react'
import LiquidButton from './LiquadButton'
import { loginUser } from '../redux/slices/authSlice'
import { useState } from 'react'
import { useDispatch } from 'react-redux'


const Login = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'email') {
      setEmail(value)
    } else if (name === 'password') {
      setPassword(value)
    }
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser({ email, password }))
  }
  return (
    <div className='max-w-md mx-auto bg-gray-100 p-5 shadow-md rounded-md'>
      <h2>Login</h2>
      <form >
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" 
          id="email" 
          name="email" 
          required 
          onchange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input 
          type="password" 
          id="password"
          name="password" 
          required 
          onchange={handleChange}
          />
          
        </div>
        <LiquidButton text="Login"
          onClick={handleSubmit}
        />
      </form>
    </div>
  )
}

export default Login