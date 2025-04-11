'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRequireAuth } from '../../hooks';
import { getBookings } from '@/app/utils/api';
import { Booking } from '@/app/models/Requests';
import NavbarPanel from '@/app/NavbarPanel';
import BookingRecord from './components/BookingRecord';

export default function ViewBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = useRequireAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message')

  useEffect(() => {
    if (token) {
        getBookings(token)
        .then(response => {
            if (response.status === 200){
                setBookings(response.data)
            } else {
                setError(response.data.message);
                return;
            }
        }).catch(error => {
            if (error.response){
                setError(error.response.data?.message);
            } else {
                setError(error.message);
            }
            
            return;
        });
    }}, [token]);
    
    const handleViewBooking = (booking: Booking) => {
        // window.history.pushState({ booking }, '', `/events/bookings/${booking.id}`); doesn't persist on redirect
        localStorage.setItem('booking', JSON.stringify(booking));
        router.push(`/events/bookings/${booking.id}`);
    }

  return (
    <div className="container mx-auto p-4">
      <NavbarPanel />
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-xl text-red-600">{error}</p>}
      <h2 className="text-2xl font-bold mb-4 text-black">Your Bookings</h2>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map(booking => <BookingRecord key={booking.id} booking = {booking} handleViewBooking={() => handleViewBooking(booking)}/>)}
      </div>
    </div>
  );
};
