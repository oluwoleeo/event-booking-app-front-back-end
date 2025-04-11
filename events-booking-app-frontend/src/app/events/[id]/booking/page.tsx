import BookEvent from "./BookEvent";

export default async function BookEventPage ({ params }: { params: Promise<{id: string}> } ){
    const { id } = await params;

    return <BookEvent id={id} />
}