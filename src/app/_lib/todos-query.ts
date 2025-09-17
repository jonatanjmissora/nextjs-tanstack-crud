import { useQuery } from "@tanstack/react-query"
import { getTodos } from "../_actions/get-todos"

export const useTodo = () => {
	const { data, error, isError, isLoading, isRefetching, status, isFetching } = useQuery({
		queryKey: ["todos"],
		queryFn: getTodos,
		refetchOnWindowFocus: false,
		refetchInterval: 15 * 1000,
	})
	return { todos: data || [], error, isError, isLoading, isRefetching, status, isFetching }
}
