import BookingDisplayPage from "./BookingDisplayPage";


export default async function Page ({ params }: { params: Promise<{id: string}> } ){
    const { id } = await params;

    return <BookingDisplayPage id={id} />
}