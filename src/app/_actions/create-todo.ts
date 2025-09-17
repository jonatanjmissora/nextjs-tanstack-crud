"use server"

import { API_ENDPOINTS } from "../_config/api"
import { TodoType } from "../_lib/types"
import axios from "axios"

export const createTodo = async (newTodo: TodoType) => {
	try {
		const response = await axios.post(API_ENDPOINTS.TODOS, newTodo, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		return response.data
	} catch (error) {
		console.error("Error creating todo:", error)
		if (axios.isAxiosError(error)) {
			// Si es un error de Axios, podemos acceder a más detalles
			console.error("Detalles del error:", error.response?.data)
			throw new Error(error.response?.data?.error || "Error al crear el TODO")
		}
		throw new Error("Error desconocido al crear el TODO")
	}
}
