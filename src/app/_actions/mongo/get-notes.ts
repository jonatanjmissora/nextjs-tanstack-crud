"use server"

import { getCollection } from "@/app/_lib/mongo-connect"

import { MongoNoteType } from "@/app/_lib/types"

export const getMongoNotes = async (): Promise<MongoNoteType[]> => {
	await new Promise(resolve => setTimeout(resolve, 2000))
	console.log("GET new mongodb")
	const notesCollection = await getCollection("notes")
	const notes = await notesCollection.find().toArray()

	// Convert and validate MongoDB documents to ensure they match MongoNoteType
	const notesArray: MongoNoteType[] = notes.map(note => ({
		_id: note._id.toString(),
		title: note.title || "", // Provide default empty string if undefined
		content: note.content || "", // Provide default empty string if undefined
		author: note.author || "", // Provide default empty string if undefined
		pinned: note.pinned || false, // Provide default false if undefined
	}))

	return notesArray
}
