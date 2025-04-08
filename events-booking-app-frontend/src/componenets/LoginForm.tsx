'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {LoginRequest} from '@/app/models/Requests';
import { login } from '@/app/utils/auth';
import { useAuth } from "@/app/contexts/AuthContext";

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const { setToken } = useAuth();

  const [form, setForm] = useState<LoginRequest>({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    login(form)
    .then(
      loginResponse => {
        if (loginResponse.status === 200) {
          setToken(loginResponse.data.token);
      
          router.push('/events')
        } else {
          setError(loginResponse.data.message);
          return;
        }
      }
    ).catch(error => {
      if (error.response){
        setError(error.response.data?.message);
      } else {
        setError(error.message);
      }
      
      return;
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Login</h2>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-xl text-red-600">{error}</p>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Login
      </button>
    </form>
  )
}
