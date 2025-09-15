"use server"

import axios from "axios"
import { TodoType } from "../_lib/types"

const API_URL = process.env.NEXT_PUBLIC_JSON_SERVER_URL

export const getTodos = async () => {
	await new Promise(resolve => setTimeout(resolve, 2000))
	try {
		// biome-ignore lint/style/noNonNullAssertion: <en una variable de entorno>
		const response = await axios.get(API_URL!)
		return response.data.sort((a: TodoType, b: TodoType) => b.id - a.id)
	} catch (error) {
		console.error("Error fetching todos:", error)
	}
}
