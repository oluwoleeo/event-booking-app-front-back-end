'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from "@/app/contexts/AuthContext";

const ActionPanel = () => {
  const router = useRouter();
  const { setToken } = useAuth();

  const handleCreateEvent = () => {
    router.push('/events/create');
  };

  const handleManageEvents = () => {
    router.push('/events/manage');
  };

  const handleViewBookings = () => {
    router.push('/bookings');
  };

  const handleLogout = () => {
    setToken(null);
    router.push('/');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-black mb-4">Actions</h2>
      <div className="space-y-4">
        <button
          onClick={handleCreateEvent}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Create Event
        </button>
        <button
          onClick={handleManageEvents}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Manage My Events
        </button>
        <button
          onClick={handleViewBookings}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          View My Bookings
        </button>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ActionPanel;
