'use client'

import config from '../../../config';
import axios, { AxiosResponse } from "axios";

import {Booking, Category, CreateBooking, CreateEvent, Event} from '@/app/models/Requests';

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

  export const getUserEvents = async (token: string): Promise<AxiosResponse<Event[]>> => {
    const response = await axios.get(
      `${config.api_base_url}/events/user`, {
        validateStatus,
        headers: {
            "Authorization": `Bearer ${token}`
        }
      }
    );
  
    return response;
  }

  export const getEventCategories = async (token: string): Promise<Category[]> => {
    let storedCategories: Category[] | null = JSON.parse(localStorage.getItem('eventcategories'));

    if (!storedCategories){
      const response : AxiosResponse<Category[]> = await axios.get(
        `${config.api_base_url}/events/categories`, {
          validateStatus,
          headers: {
              "Authorization": `Bearer ${token}`
          }
        }
      );

      storedCategories = response.data;
      localStorage.setItem('eventcategories', JSON.stringify(storedCategories));
    }

    return storedCategories;
  }

  export const createEvent = async (token: string, eventRequest: CreateEvent): Promise<AxiosResponse> => {
    const response = await axios.post(
      `${config.api_base_url}/events`, eventRequest, {
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

  export const deleteBooking = async (token: string, id: number): Promise<AxiosResponse> => {
    const response = await axios.delete(
      `${config.api_base_url}/events/reservation/${id}`, {
        validateStatus,
        headers: {
            "Authorization": `Bearer ${token}`
        }
      }
    );
  
    return response;
  }