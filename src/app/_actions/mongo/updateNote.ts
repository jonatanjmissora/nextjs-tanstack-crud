"use server"
import { getCollection } from "@/app/_lib/mongo-connect"
import { MongoNoteType } from "@/app/_lib/types"
import { ObjectId } from "mongodb"

export const updateMongoNote = async (note: MongoNoteType) => {
	await new Promise(resolve => setTimeout(resolve, 2000))
	try {
		const notesCollection = await getCollection("notes")
		// db validation
		const res = await notesCollection.updateOne(
			{ _id: new ObjectId(note._id) },
			{
				$set: { pinned: !note.pinned },
			}
		)
		if (res.modifiedCount !== 1) {
			return { success: false, data: null }
		}

		return {
			success: true,
			data: note,
		}
	} catch (error) {
		console.log("Error en el updateNote", error)
		return { success: false, data: null }
	}
}
