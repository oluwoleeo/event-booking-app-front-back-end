'use client'

import config from '../../../config';
import {LoginRequest, SignupRequest} from '@/app/models/Requests';
import axios, { AxiosResponse } from "axios";

const validateStatus = (status: number) => status < 500;

export const login = async (loginRequest: LoginRequest): Promise<AxiosResponse> => {
  const loginResponse = await axios.post(
    `${config.api_base_url}/login`,
    loginRequest, {
      validateStatus
    }
  );

  return loginResponse;
}

export const signup = async (signupRequest: SignupRequest): Promise<AxiosResponse> => {
  const signupResponse = await axios.post(
    `${config.api_base_url}/signup`,
    signupRequest, {
      validateStatus
    }
  );

  return signupResponse;
}

export const logout = (): void => {
  localStorage.removeItem('token')
}

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token')
}
