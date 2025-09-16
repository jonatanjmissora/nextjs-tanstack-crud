import { MongoNoteType } from "../_lib/types"
import { startTransition } from "react"
import { toast } from "sonner"
import {
	useUpdateMongoNote,
	useDeleteMongoNote,
} from "../_actions/mongo/mutation"

export const NoteItem = ({ note }: { note: MongoNoteType }) => {
	const { mutateAsync: updateNote, isPending: isUpdating } =
		useUpdateMongoNote()
	const { mutateAsync: deleteNote, isPending: isDeleting } =
		useDeleteMongoNote()

	const handleCheck = () => {
		const updatedNote = { ...note, pinned: !note.pinned }
		startTransition(() => {
			toast.promise(updateNote(updatedNote), {
				loading: "actualizando nota...",
				success: "nota actualizada exitosamente",
				error: "error al actualizar nota",
			})
		})
	}

	const handleDelete = async () => {
		startTransition(() => {
			toast.promise(deleteNote(note), {
				loading: "borrando nota...",
				success: "nota borrada exitosamente",
				error: "error al borrar nota",
			})
		})
	}

	return (
		<li className="grid grid-cols-[0.5fr_1fr_1fr_0.5fr] items-center py-2">
			<div className="flex items-center gap-2 ">
				<label htmlFor={note._id}>pin</label>
				<input
					name={note._id}
					type="checkbox"
					className={`size-5 ${isUpdating ? "cursor-not-allowed" : "cursor-pointer"}`}
					checked={note.pinned}
					onChange={handleCheck}
					disabled={isUpdating}
				/>
			</div>
			<span className=" ">{note.title}</span>
			<span className=" truncate ">{note.content}</span>
			<button
				className={` bg-red-500/20 text-white px-2 py-1 rounded  ${isDeleting ? "cursor-not-allowed" : "cursor-pointer"}`}
				disabled={isDeleting}
				onClick={handleDelete}
			>
				Delete
			</button>
		</li>
	)
}
