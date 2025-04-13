'use client'

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import { createEvent, getEventCategories } from '@/app/utils/api';
import { useRequireAuth } from '../../hooks';
import { Category, CreateEvent } from '@/app/models/Requests';
import { useRouter } from 'next/navigation';
import NavbarPanel from '../../NavbarPanel';

export default function CreateEventPage(){
  const token = useRequireAuth();

  const router = useRouter();
  const [userId, setUserId] = useState<string | null>('');

  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [maxCapacity, setMaxCapacity] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>('');
  
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

  useEffect(() => {
    if (token){
        async function getCategories(token: string){
          setCategories(await getEventCategories(token));
        }
        
        getCategories(token);

        setUserId(localStorage.getItem('userid'));
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!eventName || !startDate || !endDate || !description || !category) {
      alert('Please fill in all required fields.');
      return;
    }

    const eventData: CreateEvent = {
      name: eventName,
      start_date: toMySQLDateTime(startDate),
      end_date: toMySQLDateTime(endDate),
      description,
      category,
      max_capacity: maxCapacity ? parseInt(maxCapacity, 10) : undefined
    };
    
    createEvent(token, eventData)
    .then(response => {
      if (response.status === 201){
        router.push(`/events/users/${userId}?message=Event created`);
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
  };

  return (
    <div className='container mx-auto p-4'>
      <NavbarPanel />
      {error && <p className="text-xl text-red-600">{error}</p>}
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full md:w-2/3 lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-center text-2xl font-bold mb-6 text-black" >Create Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Name */}
        <div>
          <label htmlFor="event_name" className="block text-sm font-medium text-gray-700">Event Name</label>
          <input
            id="event_name"
            type="text"
            value={eventName}
            maxLength={25}
            onChange={(e) => setEventName(e.target.value)}
            className="text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
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
            required
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
            // timeIntervals={1}
            showTimeSelect
            dateFormat="dd/MM/yyyy hh:mm aa"
            className="text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            minLength={5}
            maxLength={255}
            className="text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <Select
            id="category"
            value={category?.name}
            onChange={(selectedOption) => setCategory(selectedOption.name)}
            options={categories}
            className="mt-1 text-black"
            getOptionLabel={(option) => option?.name}
            getOptionValue={(option) => option?.name}
            required
          />
        </div>

        {/* Max Capacity */}
        <div>
          <label htmlFor="max_capacity" className="block text-sm font-medium text-gray-700">Max Capacity (optional)</label>
          <input
            id="max_capacity"
            type="number"
            value={maxCapacity}
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
            Create Event
          </button>
        </div>
      </form>
      </div>
      </div>
    </div>
  );
};