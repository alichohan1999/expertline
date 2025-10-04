import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewPostForm from "./NewPostForm";

export default async function NewPostPage() {
	const session = await getServerSession(authOptions);
	
	if (!session?.user) {
		redirect("/");
	}

	return <NewPostForm />;
}