"use server"

import axios from "axios"
import { TodoType } from "../_lib/types"

const API_URL = process.env.NEXT_PUBLIC_JSON_SERVER_URL

export const updateTodo = async ({ todo }: { todo: TodoType }) => {
	await new Promise(resolve => setTimeout(resolve, 2000))
	try {
		const response = await axios.patch(`${API_URL}/${todo.id}`, todo)
		return response.data
	} catch (error) {
		console.error("Error updating todo:", error)
	}
}
