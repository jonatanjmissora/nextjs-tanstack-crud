import { useMutation } from "@tanstack/react-query"
import { createTodo } from "./create-todo"
import { updateTodo } from "./update-todo"
import { useQueryClient } from "@tanstack/react-query"
import { TodoType } from "../_lib/types"
import { deleteTodo } from "./delete-todo"

export const useCreateTodo = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: createTodo,
		onMutate: async (newTodo: TodoType) => {
			await queryClient.cancelQueries({ queryKey: ["todos"] })
			const previousTodos = queryClient.getQueryData<TodoType[]>(["todos"])
			if (!previousTodos) return
			queryClient.setQueryData(["todos"], (oldTodos: TodoType[]) => [
				{ ...newTodo, title: `${newTodo.title} *` },
				...(oldTodos || []),
			])
			return { previousTodos }
		},
		onError: (_err, _newTodo, context) => {
			queryClient.setQueryData(["todos"], context?.previousTodos)
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

export const useUpdateTodo = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: updateTodo,
		// CON OPTIMISTIC
		onMutate: async (updatedTodo: TodoType) => {
			await queryClient.cancelQueries({ queryKey: ["todos"] })
			const previousTodos = queryClient.getQueryData<TodoType[]>(["todos"])
			if (!previousTodos) return
			queryClient.setQueryData(["todos"], (oldTodos: TodoType[]) =>
				oldTodos?.map(todo =>
					todo.id === updatedTodo.id
						? { ...updatedTodo, title: `${updatedTodo.title} *` }
						: todo
				)
			)
			return { previousTodos }
		},
		onError: (_err, _newTodo, context) => {
			queryClient.setQueryData(["todos"], context?.previousTodos)
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

export const useDeleteTodo = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: deleteTodo,
		onMutate: async (todo: TodoType) => {
			if (!todo?.id) return
			await queryClient.cancelQueries({ queryKey: ["todos"] })
			const todos = queryClient.getQueryData<TodoType[]>(["todos"])
			if (!todos) return
			const newTodos = todos.filter(t => t.id !== todo.id)
			queryClient.setQueryData(["todos"], newTodos)
			return { previousTodos: todos }
		},
		onError: (_err, _variables, context) => {
			queryClient.setQueryData(["todos"], context?.previousTodos)
		},
	})
}
