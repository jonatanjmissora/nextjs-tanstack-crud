import { useMutation } from "@tanstack/react-query"
import { createTodo } from "./create-todo"

export const useCreateTodo = () => {
	return useMutation({
		mutationFn: createTodo,
	})
}
