import EventBookingPage from "./EventBookingPage";

export default async function EventBooking ({ params }: { params: Promise<{id: string}> } ){
    const { id } = await params;

    return <EventBookingPage id={id} />
}