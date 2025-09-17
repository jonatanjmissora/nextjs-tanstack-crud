"use server"

import axios from "axios"
import { TodoType } from "../_lib/types"
import { API_ENDPOINTS } from "../_config/api"

export const updateTodo = async (updatedTodo: TodoType) => {
	try {
		const response = await axios.put(
			API_ENDPOINTS.TODO_BY_ID(updatedTodo.id),
			updatedTodo,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
		return response.data
	} catch (error) {
		console.error("Error updating todo:", error)
		if (axios.isAxiosError(error)) {
			console.error("Detalles del error:", error.response?.data)
			throw new Error(
				error.response?.data?.error || "Error al actualizar el TODO"
			)
		}
		throw new Error("Error desconocido al actualizar el TODO")
	}
}
