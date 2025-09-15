"use client"

import { TodoType } from "../_lib/types"

export default function TodoItem({ todo }: { todo: TodoType }) {
	const handleCheck = async () => {}

	const handleDelete = async () => {}

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
