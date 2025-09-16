"use client"

import { MongoNoteType } from "../_lib/types"
import { startTransition, useState } from "react"
import { toast } from "sonner"
import { useCreateMongoNote } from "../_actions/mongo/mutation"
import { useMongoNotes } from "../_lib/mongo-query"
import { NoteItem } from "./MongoItem"

export default function MongoList() {
	const [title, setTitle] = useState("")
	const [content, setContent] = useState("")
	const {
		data: notes,
		error,
		isLoading,
		status,
		isFetching,
		isRefetching,
	} = useMongoNotes()
	const { mutateAsync: createNoteMutation, isPending } = useCreateMongoNote()

	const handleCreateTodo = async () => {
		const newNote: MongoNoteType = {
			title,
			content,
		}
		startTransition(async () => {
			toast.promise(createNoteMutation(newNote), {
				loading: "creando note...",
				success: "note creado exitosamente",
				error: "error al crear note",
			})
			setTitle("")
			setContent("")
		})
	}

	return (
		<div className="w-full h-full flex flex-col justify-start items-center">
			<div className="w-[700px] mx-auto flex gap-4 items-center p-4">
				<input
					className="border border-slate-600 bg-slate-600/20 rounded px-2 py-1"
					placeholder="titulo"
					type="text"
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<input
					className="border border-slate-600 bg-slate-600/20 rounded px-2 py-1"
					placeholder="content"
					type="text"
					value={content}
					onChange={e => setContent(e.target.value)}
				/>
				<button
					onClick={handleCreateTodo}
					className={`bg-slate-600/20 px-2 py-1 rounded ${isPending || title.trim() === "" || isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
					disabled={isPending || title.trim() === "" || isLoading}
				>
					Enviar
				</button>
				{status === "pending" && <span>pending...</span>}
				{isFetching && <span>fetching...</span>}
				{isRefetching && <span>refetching...</span>}
			</div>

			{isLoading ? (
				<div className="mt-20 text-xl font-semibold">Loading...</div>
			) : error ? (
				<div>Error: {error.message}</div>
			) : (
				<ul className="mx-auto p-12 py-4 bg-slate-600/20 rounded-lg min-w-[700px] h-[700px] overflow-y-auto">
					{notes?.map((note: MongoNoteType) => (
						<NoteItem key={note._id} note={note} />
					))}
				</ul>
			)}
		</div>
	)
}
