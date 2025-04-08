'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from "@/app/contexts/AuthContext";

export const useRequireAuth = () => {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  return token;
};
