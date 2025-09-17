const isProduction = process.env.NODE_ENV === "production"
const API_URL = isProduction
	? `${process.env.NEXT_PUBLIC_PRODUCTION_API}/todos`
	: `${process.env.NEXT_PUBLIC_DEVELOPER_API}/todos`

export const API_ENDPOINTS = {
	TODOS: API_URL,
	TODO_BY_ID: (id: number) => `${API_URL.replace(/\/$/, "")}/${id}`,
}
