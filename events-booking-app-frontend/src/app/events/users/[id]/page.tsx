import UserEventsPage from "./UserEventsPage";


export default async function Page ({ params }: { params: Promise<{id: string}> } ){
    const { id } = await params;

    return <UserEventsPage id={id} />
}