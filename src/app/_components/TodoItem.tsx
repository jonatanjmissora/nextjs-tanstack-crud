"use client"

import { startTransition } from "react"
import { useDeleteTodo, useUpdateTodo } from "../_actions/mutation"
import { TodoType } from "../_lib/types"
import { toast } from "sonner"

export default function TodoItem({ todo }: { todo: TodoType }) {
	const { mutateAsync: updateTodo } = useUpdateTodo()
	const { mutateAsync: deleteTodo } = useDeleteTodo()

	const handleCheck = async () => {
		const updatedTodo = { ...todo, completed: !todo.completed }
		startTransition(() => {
			toast.promise(updateTodo({ todo: updatedTodo }), {
				loading: "actualizando todo...",
				success: "todo actualizado exitosamente",
				error: "error al actualizar todo",
			})
		})
	}

	const handleDelete = async () => {
		startTransition(() => {
			toast.promise(deleteTodo({ todo }), {
				loading: "borrando todo...",
				success: "todo borrado exitosamente",
				error: "error al borrar todo",
			})
		})
	}

	return (
		<li className="grid grid-cols-[0.2fr_1fr_0.25fr] items-center gap-4 py-2">
			<input
				type="checkbox"
				className={`size-5`}
				checked={todo.completed}
				onChange={handleCheck}
				// disabled={isMutating}
			/>
			{todo.title}
			<button
				className={`bg-red-500/20 text-white px-2 py-1 rounded `}
				// disabled={isDeleting}
				onClick={handleDelete}
			>
				Delete
			</button>
		</li>
	)
}
