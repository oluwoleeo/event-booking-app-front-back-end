'use client'

import React, { useEffect, useState } from 'react';
import { useRequireAuth } from '../hooks';
import NavbarPanel from '../NavbarPanel';
import {Event} from '@/app/models/Requests';
import EventCard from './components/EventCard';
import { getEvents } from '@/app/utils/api';

export default function AllEventsPage() {
  const token = useRequireAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (token) {
        getEvents(token)
        .then(response => {
            if (response.status === 200){
                setEvents(response.data)
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

  return (
    <div className="container mx-auto p-4">
      <NavbarPanel />
      {error && <p className="text-xl text-red-600">{error}</p>}
      <h2 className="text-2xl font-bold mb-4 text-black">All Events</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {events.map(event => <EventCard key={event.id} event={event}/>)}
      </div>
    </div>
  );
};