'use client'

import React, { useEffect, useState } from 'react';
import { useRequireAuth } from '../../hooks';
import { bookEvent, deleteEvent } from '@/app/utils/api';
import {Attendee, CreateBooking} from '@/app/models/Requests';
import { useRouter } from 'next/navigation';
import NavbarPanel from '@/app/NavbarPanel';
import { useSearchParams } from 'next/navigation';

export default function EventActionPage ({ id }) {
  const [attendees, setAttendees] = useState<Attendee[]>([{ first_name: '', last_name: '' }]);
  const [error, setError] = useState<string>('');
  const [userId, setUserId] = useState<string | null>('');

  const searchParams = useSearchParams();
  const eventName = searchParams.get('eventName');
  const canManage = searchParams.get('canManage');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = useRequireAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      setUserId(localStorage.getItem('userid'));
    }}, [token]);

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

  const handleDeleteEvent = () => {
      if (token) {
        deleteEvent(token, id)
        .then(response => {
          if (response.status === 200){
            router.push(`/events/users/${userId}?message=${response.data.message}`);
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
    }

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
    <div className="container mx-auto p-4">
      <NavbarPanel />
      {error && <p className="text-xl text-red-600">{error}</p>}
      {canManage && <div className="mb-10 flex items-center space-x-4">
          <button
            type="button"
            onClick={handleAddAttendee}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Update Event
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Event
          </button>
        </div>}
      <h2 className="text-2xl font-black mb-4 text-black">Create a booking for {eventName}</h2>
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
            className="bg-black text-white px-4 py-2 rounded hover:bg-green-700"
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
      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-black">Confirm Deletion</h3>
            <p className='text-black'>Are you sure you want to delete this event?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-2 px-4 py-2 bg-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
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
}
