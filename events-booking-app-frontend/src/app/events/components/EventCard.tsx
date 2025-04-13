'use client'

import { Event } from '@/app/models/Requests';
import { useRouter } from 'next/navigation';

export default function EventCard({event, isCreatedByUser}: {event: Event, isCreatedByUser?: boolean}) {
    const router = useRouter();
    
    const handleEventActions = () => {
        if (isCreatedByUser){
            localStorage.setItem('event', JSON.stringify(event));
            router.push(`/events/${event.id}?eventName=${event.name}&canManage=true`);
        } else{
            router.push(`/events/${event.id}?eventName=${event.name}`);
        }
    };

    return (
        <div className="relative group cursor-pointer h-full">
            <div className="overflow-hidden rounded-lg shadow-lg transition-transform transform group-hover:scale-105 h-full flex flex-col">
                <div className="p-4 bg-white flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
                    <p className="text-gray-600">{event.description}</p>
                    <p className="text-gray-600 mb-4">{event.category?.name}</p>
                </div>
            </div>
            <div className="absolute inset-0 bg-white p-4 opacity-0 group-hover:opacity-100 inset-shadow-indigo-500 transition-opacity z-10" onClick={handleEventActions}>
                <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-gray-600">{event.category?.name}</p>
                <p className="text-gray-600">Start Date: {new Date(event.start_date).toLocaleString()}</p>
                <p className="text-gray-600">End Date: {new Date(event.end_date).toLocaleString()}</p>
                <p className="text-gray-600">Max Capacity: {event.max_capacity}</p>
            </div>
        </div>
      )
    }