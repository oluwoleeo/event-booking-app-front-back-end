'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import { motion, AnimatePresence } from 'framer-motion'

export default function AuthForm() {
  const searchParams = useSearchParams()
  const showLogin = searchParams.get('showLogin');
  const [isLogin, setIsLogin] = useState(true)

  useEffect(() => {
    console.log(`GETS HERE 1! showLogin is ${showLogin}`)
    if (showLogin){
      console.log(`GETS HERE 2! showLogin is ${showLogin}`)
      setIsLogin(showLogin==='true');
    }
  }, [showLogin]);

  return (
    <div className="bg-black p-8 rounded-2xl shadow-lg w-full max-w-md">
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <LoginForm />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <SignupForm />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 text-center">
        {isLogin ? (
          <p>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => setIsLogin(false)}
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              onClick={() => setIsLogin(true)}
              className="text-blue-500 hover:underline"
            >
              Log In
            </button>
          </p>
        )}
      </div>
    </div>
  )
}