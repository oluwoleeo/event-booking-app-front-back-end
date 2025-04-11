'use client'

import React, { useEffect, useState } from 'react';
import { getAuthenticatedUser } from '@/app/utils/auth';
import { useRequireAuth } from '../../../hooks';
import NavbarPanel from '../../../NavbarPanel';
import {Event} from '@/app/models/Requests';
import EventCard from '../../components/EventCard';
import { getUserEvents } from '@/app/utils/api';

export default function UserEventsPage({ id }) {
    const token = useRequireAuth();
    const [username, setUsername] = useState<string | null>('');
    const [events, setEvents] = useState<Event[]>([]);
    const [error, setError] = useState<string>('');
    
    useEffect(() => {
        if (token) {
            async function getUsername(token: string){
                setUsername(await getAuthenticatedUser(token));
            }
            
            getUsername(token);

            getUserEvents(token)
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
          {error && <p className="text-xl text-red-600">{error}</p>}
          <NavbarPanel />
          <h2 className="text-2xl font-bold mb-4 text-black">{`${username}'s events`}</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {events.map(event => <EventCard key={event.id} event={event}/>)}
          </div>
        </div>
      );
}