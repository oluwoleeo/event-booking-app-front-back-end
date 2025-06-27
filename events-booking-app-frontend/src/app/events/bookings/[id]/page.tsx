import BookingDisplay from "./BookingDisplay";


export default async function BookingPage ({ params }: { params: Promise<{id: string}> } ){
    const { id } = await params;

    return <BookingDisplay id={id} />
}