'use client'

export default function BookingRecord({booking, handleViewBooking}){
    return (
        <div className="p-4 border border-gray-200 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleViewBooking}
          >
            <h3 className="text-lg font-medium text-black">{booking.event.name}</h3>
            <p className="text-gray-600">Start Date: {new Date(booking.event.start_date).toLocaleString()}</p>
            <p className="text-gray-600">Attendees: {booking.attendees.length}</p>
          </div>
    )
}