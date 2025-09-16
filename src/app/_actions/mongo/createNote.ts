"use server"
import { getCollection } from "@/app/_lib/mongo-connect"
import { MongoNoteType } from "@/app/_lib/types"

export const createMongoNote = async (newNote: MongoNoteType) => {
	await new Promise(resolve => setTimeout(resolve, 2000))
	const user = "kp_36204bd6138c4b029b7f77d84fe30093"

	const note = {
		title: newNote.title,
		content: newNote.content,
		author: user,
		pinned: false,
	}

	try {
		const notesCollection = await getCollection("notes")
		const res = await notesCollection.insertOne(note)
		if (!res.insertedId.toString()) {
			return { success: false, data: null }
		}
		return {
			success: true,
			data: { ...note, _id: res.insertedId.toString() },
		}
	} catch (error) {
		console.log("Error en el createNote", error)
		return { success: false, data: null }
	}
}
