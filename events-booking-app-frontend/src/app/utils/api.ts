'use client'

import config from '../../../config';
import axios, { AxiosResponse } from "axios";

import {Booking, CreateBooking, Event} from '@/app/models/Requests';

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

  export const bookEvent = async (token: string, id: number, bookingRequest: CreateBooking): Promise<AxiosResponse> => {
    const response = await axios.post(
      `${config.api_base_url}/events/${id}/reservation`, bookingRequest, {
        validateStatus,
        headers: {
            "Authorization": `Bearer ${token}`
        }
      }
    );
  
    return response;
  }

  export const getBookings = async (token: string): Promise<AxiosResponse<Booking[]>> => {
    const response = await axios.get(
      `${config.api_base_url}/events/reservations`, {
        validateStatus,
        headers: {
            "Authorization": `Bearer ${token}`
        }
      }
    );
  
    return response;
  }