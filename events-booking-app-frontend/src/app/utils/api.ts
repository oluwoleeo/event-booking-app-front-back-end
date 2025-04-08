'use client'

import config from '../../../config';
import axios, { AxiosResponse } from "axios";

import {Event} from '@/app/models/Requests';

const validateStatus = (status: number) => status < 500;

export const getEvents = async (token: string): Promise<AxiosResponse<Event[]>> => {
    const response = await axios.get(
      `${config.api_base_url}/events`, {
        validateStatus,
        headers: {
            "Authorization": `Bearer ${token}`
        }
      }
    );
  
    return response;
  }