"use server"
import { getCollection } from "@/app/_lib/mongo-connect"
import { MongoNoteType } from "@/app/_lib/types"
import { ObjectId } from "mongodb"

export const deleteMongoNote = async (note: MongoNoteType) => {
	await new Promise(resolve => setTimeout(resolve, 2000))
	try {
		const notesCollection = await getCollection("notes")
		const res = await notesCollection.deleteOne({ _id: new ObjectId(note._id) })
		if (res?.deletedCount !== 1) return { success: false, data: note }
		return { success: true, data: note }
	} catch (error) {
		console.log("Error en el deleteNote", error)
		return { success: false, data: note }
	}
}
