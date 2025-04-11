'use client'

import config from '../../../config';
import {LoginRequest, SignupRequest, User} from '@/app/models/Requests';
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

export const getAuthenticatedUser = async (token: string): Promise<string | null> => {
  let username: string | null = localStorage.getItem('username');

  if (!username){
    const response : AxiosResponse<User> = await axios.get(
      `${config.api_base_url}/user`, {
        validateStatus,
        headers: {
            "Authorization": `Bearer ${token}`
        }
      }
    );

    username = `${response.data.firstname} ${response.data.lastname}`;
    localStorage.setItem('username', username);
    localStorage.setItem('userid', response.data.id);
  }

  return username;
}
