'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from "@/app/contexts/AuthContext";
import { getAuthenticatedUser } from '@/app/utils/auth';

export default function NavbarPanel() {
  const router = useRouter();
  const { setToken } = useAuth();
  const {token} = useAuth();

  const [username, setUsername] = useState<string | null>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
      if (token) {
        async function getUsername(token: string){
          setUsername(await getAuthenticatedUser(token));
        }

        getUsername(token);
    }}, [token]);
  
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const actions = [
    { name: 'Create event', onClick: () => router.push('/events/create') },
    { name: 'Manage event', onClick: () => router.push('/events/manage') },
    { name: 'View bookings', onClick: () => router.push('/bookings') }
  ];

  const handleGoToEventsPage = () => router.push('/events')

  const handleLogout = () => {
    setToken(null);
    router.push('/');
  };

  return (
    <nav className="bg-gray-800 p-4 mb-3">
      <div className="container mx-auto flex justify-between items-center">
        {/* Application Name */}
        <div className="text-white text-lg font-bold cursor-pointer" onClick={handleGoToEventsPage}>Events Booking App</div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Welcome Message */}
          <span className="text-white hidden sm:inline">Hi, {username}!</span>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="text-white bg-red-500 hover:bg-red-700 px-3 py-1 rounded"
          >
            Logout
          </button>

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
            >
              Actions
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {action.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};