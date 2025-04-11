'use client'

import { Booking } from '@/app/models/Requests';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavbarPanel from '@/app/NavbarPanel';
import { useRequireAuth } from '../../../hooks';
import { deleteBooking } from '@/app/utils/api';

export default function BookingDisplayPage({ id }){
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string>(null);
  const router = useRouter();
  const token = useRequireAuth();

  useEffect(() => {
    const storedBooking: Booking | null = JSON.parse(localStorage.getItem('booking') ?? '');
    
    if (storedBooking) {
        setBooking(storedBooking);
    } else {
        router.push('/events/bookings');
    }
  }, [router]);
  
  const handleDelete = () => {
    if (token) {
      deleteBooking(token, id)
      .then(response => {
        if (response.status === 200){
          router.push(`/events/bookings?message=${response.data.message}`);
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
    }

    localStorage.removeItem('booking');
  }

  return (
    <div className="container mx-auto p-4">
      <NavbarPanel />
      {error && <p className="text-xl text-red-600">{error}</p>}
      <h2 className="text-2xl font-bold mb-4 text-black">Events booking {booking?.id} for {booking?.event.name}</h2>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {booking?.attendees.map((attendee, index) => (
          <div key={index} className='p-4 border border-gray-200 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow'>
            <p className="text-black px-4 py-2">Ticket ID: {attendee.ticket_id}</p>
            <p className="text-black px-4 py-2">Name: {`${attendee.first_name} ${attendee.last_name}`}</p>
          </div>
            ))}
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete Booking
      </button>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-black">Confirm Deletion</h3>
            <p className='text-black'>Are you sure you want to delete this booking?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-2 px-4 py-2 bg-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
