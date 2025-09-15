"use server"

import axios from "axios"
import { TodoType } from "../_lib/types"

const API_URL = process.env.NEXT_PUBLIC_JSON_SERVER_URL

export const deleteTodo = async ({ todo }: { todo: TodoType }) => {
	await new Promise(resolve => setTimeout(resolve, 2000))
	try {
		const response = await axios.delete(`${API_URL}/${todo.id}`)
		if (response.status === 200) {
			const id = Number(response.config.url?.split("/").pop())
			return Number.isNaN(id) ? null : id
		} else {
			return 0
		}
	} catch (error) {
		console.error("Error deleting todo:", error)
	}
}
