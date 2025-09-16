import { MongoNoteType } from "@/app/_lib/types"
import { createMongoNote } from "./createNote"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateMongoNote } from "./updateNote"
import { deleteMongoNote } from "./deleteNote"

export const useCreateMongoNote = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: createMongoNote,
		onMutate: async (newNote: MongoNoteType) => {
			await queryClient.cancelQueries({ queryKey: ["mongo-notes"] })
			const previousTodos = queryClient.getQueryData<MongoNoteType[]>([
				"mongo-notes",
			])
			if (!previousTodos) return
			queryClient.setQueryData(["mongo-notes"], (oldTodos: MongoNoteType[]) => [
				...(oldTodos || []),
				{ ...newNote, title: `${newNote.title} *` },
			])
			return { previousTodos }
		},
		onError: (_err, _newNote, context) => {
			queryClient.setQueryData(["mongo-notes"], context?.previousTodos)
		},
		//  SIN OPTIMISTIC
		// onSuccess: async (newTodo: TodoType) => {
		// 	await queryClient.cancelQueries({ queryKey: ["todos"] })
		// 	const todos = queryClient.getQueryData<TodoType[]>(["todos"])
		// 	if (!todos) return
		// 	const newTodos = [newTodo, ...(todos || [])]
		// queryClient.setQueryData(["todos"], newTodos)
		// await queryClient.invalidateQueries({ queryKey: ["todos"] })
		// },
	})
}

export const useUpdateMongoNote = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: updateMongoNote,
		// CON OPTIMISTIC
		onMutate: async (updatedNote: MongoNoteType) => {
			await queryClient.cancelQueries({ queryKey: ["mongo-notes"] })
			const previousNotes = queryClient.getQueryData<MongoNoteType[]>([
				"mongo-notes",
			])
			if (!previousNotes) return
			queryClient.setQueryData(["mongo-notes"], (oldNotes: MongoNoteType[]) =>
				oldNotes?.map(note =>
					note._id === updatedNote._id
						? { ...updatedNote, title: `${updatedNote.title} *` }
						: note
				)
			)
			return { previousNotes }
		},
		onError: (_err, _newNote, context) => {
			queryClient.setQueryData(["mongo-notes"], context?.previousNotes)
		},

		//  SIN OPTIMISTIC
		// onSuccess: async (updatedTodo: TodoType) => {
		// await queryClient.cancelQueries({ queryKey: ["todos"] })
		// 	const todos = queryClient.getQueryData<TodoType[]>(["todos"])
		// 	if (!todos) return
		// 	const newTodos = todos?.map(todo =>
		// 		todo.id === updatedTodo.id ? updatedTodo : todo
		// 	)
		// 	queryClient.setQueryData(["todos"], newTodos)
		// await queryClient.invalidateQueries({ queryKey: ["todos"] })
		// },
	})
}

export const useDeleteMongoNote = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: deleteMongoNote,
		onMutate: async (deletedNote: MongoNoteType) => {
			await queryClient.cancelQueries({ queryKey: ["mongo-notes"] })
			const previousNotes = queryClient.getQueryData<MongoNoteType[]>([
				"mongo-notes",
			])
			if (!previousNotes) return
			queryClient.setQueryData(["mongo-notes"], (oldNotes: MongoNoteType[]) =>
				oldNotes?.filter(note => note._id !== deletedNote._id)
			)
			return { previousNotes }
		},
		onError: (_err, _deletedNote, context) => {
			queryClient.setQueryData(["mongo-notes"], context?.previousNotes)
		},
	})
}
