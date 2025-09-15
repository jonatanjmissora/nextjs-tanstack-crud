"use client"

import { useTodo } from "../_lib/todos-query"
import { startTransition, useState } from "react"
import { TodoType } from "../_lib/types"
import TodoItem from "./TodoItem"
import { toast } from "sonner"
import { useCreateTodo } from "../_actions/mutation"

export default function TodosList() {
	const [title, setTitle] = useState("")
	const {
		data: todos,
		error,
		isLoading,
		isRefetching,
		status,
		isFetching,
	} = useTodo()
	const { mutateAsync: createTodo } = useCreateTodo()

	const handleCreateTodo = async () => {
		const newTodo = {
			userId: 1,
			id: Date.now(),
			title,
			completed: false,
		}

		startTransition(async () => {
			toast.promise(createTodo({ newTodo }), {
				loading: "creando todo...",
				success: "todo creado exitosamente",
				error: "error al crear todo",
			})

			setTitle("")
		})
	}

	return (
		<div className="w-full h-full flex flex-col justify-start items-center">
			<div className="w-[700px] mx-auto flex gap-4 items-center p-4">
				<input
					className="border border-slate-600 bg-slate-600/20 rounded px-2 py-1"
					placeholder="Agregar todo"
					type="text"
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<button
					type="button"
					onClick={handleCreateTodo}
					className={`bg-slate-600/20 px-2 py-1 rounded `}
				>
					Enviar
				</button>
				{status === "pending" && <span>pending...</span>}
				{isFetching && <span>fetching...</span>}
				{isRefetching && <span>refetching...</span>}
			</div>

			{isLoading ? (
				<div className="mt-20 text-xl font-semibold">Loading...</div>
			) : error ? (
				<div>Error: {error.message}</div>
			) : (
				<ul className="mx-auto p-12 py-4 bg-slate-600/20 rounded-lg min-w-[700px] h-[700px] overflow-y-auto">
					{todos?.map((todo: TodoType) => (
						<TodoItem key={todo.id} todo={todo} />
					))}
				</ul>
			)}
		</div>
	)
}
