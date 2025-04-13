'use client'

import NavbarPanel from "@/app/NavbarPanel";
import { useRouter } from 'next/navigation';
import { Event, Category, UpdateEvent } from '@/app/models/Requests';
import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '../../../../hooks';
import { updateEvent, getEventCategories } from '@/app/utils/api';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';

export default function UpdateEventPage({id, userId}:{id: string, userId: string}){
    const token = useRequireAuth();

    const [event, setEvent] = useState<Event | null>(() => JSON.parse(localStorage.getItem('event')));

    const [eventName, setEventName] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(new Date(event?.start_date));
    const [endDate, setEndDate] = useState<Date | null>(new Date(event?.end_date));
    const [description, setDescription] = useState<string | null>(null);
    const [category, setCategory] = useState<string | null>(null);
    const [maxCapacity, setMaxCapacity] = useState<string | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);

    const [error, setError] = useState<string>(null);
    const router = useRouter();

    useEffect(() => {
        if (token){
            async function getCategories(token: string){
              setCategories(await getEventCategories(token));
            }
            
            getCategories(token);
        }
      }, [token]);
      
    const toMySQLDateTime = (iso8601Date: Date) => {
        const pad = (n) => n.toString().padStart(2, '0');
        
        const year = iso8601Date.getUTCFullYear();
        const month = pad(iso8601Date.getUTCMonth() + 1);
        const day = pad(iso8601Date.getUTCDate());
        const hours = pad(iso8601Date.getUTCHours());
        const minutes = pad(iso8601Date.getUTCMinutes());
        const seconds = pad(iso8601Date.getUTCSeconds());
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if ((startDate && !endDate) || (endDate && !startDate)) {
          alert('Start Date must be provided if there is End Date and vice-versa.');
          return;
        }
    
        let eventData: UpdateEvent = {};

        if (eventName && eventName !== event?.name){
            eventData.name = eventName;
        }

        if (description && description !== event?.description){
            eventData.description = description;
        }

        if (category && category !== event?.category?.name){
            eventData.category = category;
        }

        if (startDate && startDate.getTime() !== new Date(event?.start_date).getTime()){
            eventData.start_date = toMySQLDateTime(startDate);
        }

        if (endDate && endDate.getTime() !== new Date(event?.end_date).getTime()){
            eventData.end_date = toMySQLDateTime(endDate);
        }

        if (maxCapacity){
            const max_capacity = parseInt(maxCapacity, 10);

            if (max_capacity && max_capacity !== event?.max_capacity){
                eventData.max_capacity = max_capacity;
            }
        }

        if(Object.keys(eventData).length > 0){
            updateEvent(token, id, eventData)
            .then(response => {
                if (response.status === 200){
                    router.push(`/events/users/${userId}?message=Event updated`);
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
        } else{
            setError('No updates made');
        }
    };

    
    return (
        <div className='container mx-auto p-4'>
            <NavbarPanel />
            {error && <p className="text-xl text-red-600">{error}</p>}
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full md:w-2/3 lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-center text-2xl font-bold mb-6 text-black" >Update Event</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Event Name */}
                    <div>
                        <label htmlFor="event_name" className="block text-sm font-medium text-gray-700">Event Name</label>
                        <input
                        id="event_name"
                        type="text"
                        defaultValue={event?.name}
                        maxLength={25}
                        onChange={(e) => setEventName(e.target.value)}
                        className="text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    
                    {/* Start Date */}
                    <div>
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
                        <DatePicker
                        id="start_date"
                        selected={startDate}
                        showIcon
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        showTimeSelect
                        dateFormat="dd/MM/yyyy hh:mm aa"
                        className="text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    
                    {/* End Date */}
                    <div>
                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
                        <DatePicker
                        id="end_date"
                        selected={endDate}
                        showIcon
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate || new Date()}
                        showTimeSelect
                        dateFormat="dd/MM/yyyy hh:mm aa"
                        className="text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    
                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                        id="description"
                        defaultValue={event?.description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        minLength={5}
                        maxLength={255}
                        className="text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>
                    </div>
                    
                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <Select
                        id="category"
                        defaultValue={event?.category}
                        onChange={(selectedOption) => setCategory(selectedOption.name)}
                        options={categories}
                        className="mt-1 text-black"
                        getOptionLabel={(option) => option?.name}
                        getOptionValue={(option) => option?.name}
                        />
                    </div>
                    
                    {/* Max Capacity */}
                    <div>
                        <label htmlFor="max_capacity" className="block text-sm font-medium text-gray-700"></label>
                        <input
                        id="max_capacity"
                        type="number"
                        defaultValue={event?.max_capacity}
                        onChange={(e) => setMaxCapacity(e.target.value)}
                        min={7}
                        className="text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    
                    {/* Submit Button */}
                    <div>
                        <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white p-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Update Event
                        </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    )
}