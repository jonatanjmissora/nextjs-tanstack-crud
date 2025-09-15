export type TodoType = {
	id: number
	userId: number
	title: string
	completed: boolean
}

export type MongoNoteType = {
	_id?: string
	title: string
	content: string
	author?: string
	pinned?: boolean
}
