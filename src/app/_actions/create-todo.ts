"use server"

import { TodoType } from "../_lib/types"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_JSON_SERVER_URL

export const createTodo = async ({ newTodo }: { newTodo: TodoType }) => {
	await new Promise(resolve => setTimeout(resolve, 2000))
	// biome-ignore lint/style/noNonNullAssertion: <env>
	const response = await axios.post(API_URL!, newTodo)
	return response.data
}
