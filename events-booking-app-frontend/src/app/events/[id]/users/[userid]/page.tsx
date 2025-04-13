import UpdateEventPage from "./UpdateEventPage";

export default async function Page ({ params }: { params: Promise<{id: string, userid: string}> } ){
    const { id, userid } = await params;

    return <UpdateEventPage id={id} userId={userid} />
}