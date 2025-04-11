'use client'

import React, { useState } from 'react';
import { useRequireAuth } from '../../../hooks';
import { bookEvent } from '@/app/utils/api';
import {Attendee, CreateBooking} from '@/app/models/Requests';
import { useRouter } from 'next/navigation';
import NavbarPanel from '@/app/NavbarPanel';

export default function EventBookingPage ({ id }) {
  const [attendees, setAttendees] = useState<Attendee[]>([{ first_name: '', last_name: '' }]);
  const [error, setError] = useState<string>('')

  const token = useRequireAuth();
  const router = useRouter();

  const handleInputChange = (index:number, event:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newAttendees = [...attendees];
    newAttendees[index][name] = value;
    setAttendees(newAttendees);
  };

  const handleAddAttendee = () => {
    setAttendees([...attendees, { first_name: '', last_name: '' }]);
  };

  const handleRemoveAttendee = (index: number) => {
    const newAttendees = attendees.filter((_, i) => i !== index);
    setAttendees(newAttendees);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (token) {
      const booking: CreateBooking = {
        attendees
      };

      bookEvent(token, id, booking)
      .then(response => {
        if (response.status === 201){
          router.push('/events/bookings?message=Booking created');
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
  };

  return (
    // <div className="max-w-4xl mx-auto p-4">
    <div className="container mx-auto p-4">
      <NavbarPanel />
      {error && <p className="text-xl text-red-600">{error}</p>}
      <h2 className="text-2xl font-black mb-4 text-black">Book event</h2>
      <form onSubmit={handleSubmit}>
        {attendees.map((attendee, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={attendee.first_name}
              onChange={(e) => handleInputChange(index, e)}
              className="border border-black rounded p-2 w-full text-black"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={attendee.last_name}
              onChange={(e) => handleInputChange(index, e)}
              className="border border-black rounded p-2 w-full text-black"
              required
            />
            {attendees.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveAttendee(index)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleAddAttendee}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Attendee
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Booking
          </button>
        </div>
      </form>
    </div>
  );
}
