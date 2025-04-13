'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SignupRequest } from '@/app/models/Requests';
import { signup } from '@/app/utils/auth';

export default function SignupForm() {
  const router = useRouter()
  const [form, setForm] = useState<SignupRequest>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: ''
  })
  const [error, setError] = useState<string>('');
  const [confirmpassworderror, setConfirmPasswordError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "confirmpassword"){
      let text = "Passwords does not match";
      
      if (form.password === e.target.value) {
        text = "";
      }

      setConfirmPasswordError(text);
    }
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password === form.confirmpassword) {
      // delete form.confirmpassword;

      signup(form)
      .then(
        signupResponse => {
            if (signupResponse.status !== 201) {
                setError(signupResponse.data.message)
                return
            }

            router.push('/?showLogin=true&message=Account created successfully. Log in.');
        }
      ).catch(error => {
        if (error.response){
          setError(error.response.data?.message);
        } else {
          setError(error.message);
        }
        
        return;
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Sign Up</h2>

      {error && <p className="text-xl text-red-600">{error}</p>}

      <input
        type="text"
        minLength={2}
        maxLength={25}
        name="firstname"
        placeholder="First Name"
        value={form.firstname}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="text"
        minLength={2}
        maxLength={25}
        name="lastname"
        placeholder="Last Name"
        value={form.lastname}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="email"
        maxLength={50}
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="password"
        minLength={7}
        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      
      <input
        type="password"
        placeholder="Confirm Password"
        onChange={handleChange}
        name="confirmpassword"
        value={form.confirmpassword}
        className="w-full border p-2 rounded"
        required
      />
      
      {confirmpassworderror && (<p className="text-red-500 text-sm">{confirmpassworderror}</p>)}

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Sign Up
      </button>
    </form>
  )
}
