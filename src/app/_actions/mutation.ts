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
		onSuccess: async (newTodo: TodoType) => {
			const todos = queryClient.getQueryData<TodoType[]>(["todos"])
			if (!todos) return
			const newTodos = [newTodo, ...(todos || [])]
			queryClient.setQueryData(["todos"], newTodos)
			// await queryClient.invalidateQueries({ queryKey: ["todos"] })
		},
	})
}

export const useUpdateTodo = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: updateTodo,
		onSuccess: async (updatedTodo: TodoType) => {
			const todos = queryClient.getQueryData<TodoType[]>(["todos"])
			if (!todos) return
			const newTodos = todos?.map(todo =>
				todo.id === updatedTodo.id ? updatedTodo : todo
			)
			queryClient.setQueryData(["todos"], newTodos)
			// await queryClient.invalidateQueries({ queryKey: ["todos"] })
		},
	})
}

export const useDeleteTodo = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: deleteTodo,
		onSuccess: deletedTodoId => {
			if (deletedTodoId === 0) return
			const todos = queryClient.getQueryData<TodoType[]>(["todos"])
			if (!todos) return
			const newTodos = todos.filter(todo => todo.id !== deletedTodoId)
			queryClient.setQueryData(["todos"], newTodos)
			// await queryClient.invalidateQueries({ queryKey: ["todos"] })
		},
	})
}
