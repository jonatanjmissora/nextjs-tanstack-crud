import { useQuery } from "@tanstack/react-query"
import { getMongoNotes } from "../_actions/mongo/get-notes"

export const useMongoNotes = () => {
	return useQuery({
		queryKey: ["mongo-notes"],
		queryFn: getMongoNotes,
		refetchOnWindowFocus: false,
		refetchInterval: 15 * 1000,
	})
}
