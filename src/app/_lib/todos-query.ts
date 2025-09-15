import { useQuery } from "@tanstack/react-query"
import { getTodos } from "../_actions/get-todos"

export const useTodo = () => {
	return useQuery({
		queryKey: ["todos"],
		queryFn: getTodos,
		// refetchOnWindowFocus: false,
		refetchInterval: 15 * 1000,
	})
}
