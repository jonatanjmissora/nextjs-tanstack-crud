# Como se usa:
##### Preparacion del proyecto una vez clonado con
	git clone https://github.com/jonatanjmissora/nextjs-tanstack-crud.git
##### instalar dependencias: 
	bun install
##### creamos las variables de entorno en .env
  	NEXT_PUBLIC_MONGODB_URI=
    NEXT_PUBLIC_MONGODB_DB=
	NEXT_PUBLIC_DEVELOPER_API=http://localhost:3001
	NEXT_PUBLIC_PRODUCTION_API=https://merry-uncatholical-kristie.ngrok-free.app
* creamos db.json en data/db.json con el siguiente formato:
      {
        todos: [
          {userId: number, id: number, title: string, completed: boolean},
          ...
          ]
      }
    la API correra en http://localhost:3001/todos

##### instalamos concurrently:
	bun add -D concurrently
##### agregamos al package.json el script para iniciar el proyecto y la API de json-server con un solo comando
	"dev:all": "concurrently \"bun dev\" \"bun x json-server -w data/db.json -p 3001\"",
##### iniciar API de json-server con y el proyecto con un solo comando:
	bun dev:all

---

# Hacer tunel para correr app
##### instalas el chocolatey: abres una powershell como administrador y ejecutas:
	Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
##### instalas ngrok: abres una nueva powershell como administrador y ejecutas:
	choco install ngrok
##### verificas que ngrok esta instalado en windsurf, cerrar y volver a abrir windsurf
	ngrok version
* inicias secion en ngrok, vas a autenticacion, y copias el token
##### ejecutas:
	ngrok config add-authtoken 32joMyUZLlYdj0x7W2Tdp6Nsogc_5qamnCuiTNPdXJtTsNDf8
* creas un dominio aleatorio en la pagina de ngrok, y ese va a ser el que usaremos en la aplicacion
* sobre los ... que aparecen en el dominio, le das a ejecutar endpoint
* copias el script, y le modificas el puerto a 3001 (es el que usa nuestra API)
* pegas en terminal, y te dara un url que usaremos en la aplicacion

---      

# Teoria:
##### instalamos:
	bun add axios @tanstack/react-query sonner mongodb
* creamos el [_lib/tanstack-provider.tsx](#tanstack-providertsx)
### TODOS del json-server
* seteamos para desarrollo y produccion el [_config/api.ts](#_config/apits)
* creamos los [_lib/todos-query.ts](#todos-queryts)
* creamos el [_actions/todos-mutation.ts](#todos-mutationts) :
	* [_actions/get-todos.ts](#get-todosts)
    * [_actions/create-todo.ts](#create-todots) 
    * [_actions/update-todo.ts](#update-todots) 
    * [_actions/delete-todo.ts](#delete-todots)
### NOTAS MONGODB
* creamos el [_lib/mongo-connect.ts](#mongo-connectts)
* creamos el [_lib/mongo-query.ts](#mongo-queryts)
* creamos el [_actions/mongo/mongo-mutation.ts](#mongo-mutationts) :
	* [_actions/mongo/get-mongoNotes.ts](#get-mongoNotests)
	* [_actions/mongo/create-mongoNote.ts](#create-mongoNotets)
	* [_actions/mongo/update-mongoNote.ts](#update-mongoNotets)
	* [_actions/mongo/delete-mongoNote.ts](#delete-mongoNotets)
### 2 formas para el toast
* con un [id](#sonner_id)
* con un [promise](#sonner_promise)
  
---

### tanstack-provider.tsx
	"use client"
	
	export const TanstackProvider = ({
		children,
	}: {
		children: React.ReactNode
	}) => {
		const [queryClient] = useState(() => new QueryClient())

		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		)
	}

---

### api.ts
	const isProduction = process.env.NODE_ENV === "production"
	const API_URL = isProduction
		? `${process.env.NEXT_PUBLIC_PRODUCTION_API}/todos`
		: `${process.env.NEXT_PUBLIC_DEVELOPER_API}/todos`
	
	export const API_ENDPOINTS = {
		TODOS: API_URL,
		TODO_BY_ID: (id: number) => `${API_URL.replace(/\/$/, "")}/${id}`,
	}

---

### todos-query.ts
	export const useTodo = () => {
		return useQuery({
			queryKey: ["todos"],
			queryFn: getTodos,
			refetchOnWindowFocus: false,
			refetchInterval: 15 * 1000,
		})
	}

---

### todos-mutation.ts
	export const useCreateTodo = () => {
		const queryClient = useQueryClient()
		return useMutation({
			mutationFn: createTodo,
			onMutate: async (newTodo: TodoType) => {
				await queryClient.cancelQueries({ queryKey: ["todos"] })
				const previousTodos = queryClient.getQueryData<TodoType[]>(["todos"])
				if (!previousTodos) return
				queryClient.setQueryData(["todos"], (oldTodos: TodoType[]) => [
					{ ...newTodo, title: `${newTodo.title} *` },
					...(oldTodos || []),
				])
				return { previousTodos }
			},
			onError: (_err, _newTodo, context) => {
				queryClient.setQueryData(["todos"], context?.previousTodos)
			},
			//  SIN OPTIMISTIC
			//  reemplazar el onMutate por onSuccess
		})
	}
 
	export const useUpdateTodo = () => {
		const queryClient = useQueryClient()
		return useMutation({
			mutationFn: updateTodo,
			// CON OPTIMISTIC
			onMutate: async (updatedTodo: TodoType) => {
				await queryClient.cancelQueries({ queryKey: ["todos"] })
				const previousTodos = queryClient.getQueryData<TodoType[]>(["todos"])
				if (!previousTodos) return
				queryClient.setQueryData(["todos"], (oldTodos: TodoType[]) =>
					oldTodos?.map(todo =>
						todo.id === updatedTodo.id
							? { ...updatedTodo, title: `${updatedTodo.title} *` }
							: todo
					)
				)
				return { previousTodos }
			},
			onError: (_err, _newTodo, context) => {
				queryClient.setQueryData(["todos"], context?.previousTodos)
			},
	
			//  SIN OPTIMISTIC
			// reemplazar el onMutate por onSuccess
		})
	}

	export const useDeleteTodo = () => {
		const queryClient = useQueryClient()
		return useMutation({
			mutationFn: deleteTodo,
			onMutate: async (todo: TodoType) => {
				if (!todo?.id) return
				await queryClient.cancelQueries({ queryKey: ["todos"] })
				const todos = queryClient.getQueryData<TodoType[]>(["todos"])
				if (!todos) return
				const newTodos = todos.filter(t => t.id !== todo.id)
				queryClient.setQueryData(["todos"], newTodos)
				return { previousTodos: todos }
			},
			onError: (_err, _variables, context) => {
				queryClient.setQueryData(["todos"], context?.previousTodos)
			},
		})
	}

---

### get-todos.ts
	"use server"
	
	export const getTodos = async () => {
		await new Promise(resolve => setTimeout(resolve, 2000))
	
		try {
			const response = await axios.get(API_ENDPOINTS.TODOS)
			return response.data.sort((a: TodoType, b: TodoType) => b.id - a.id)
		} catch (error) {
			console.error("Error fetching todos:", error)
		}
	}

---

### create-todo.ts
	"use server"
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

---

### update-todo.ts
	"use server"
	export const updateMongoNote = async (note: MongoNoteType) => {
		await new Promise(resolve => setTimeout(resolve, 2000))
		try {
			const notesCollection = await getCollection("notes")
			// db validation
			const res = await notesCollection.updateOne(
				{ _id: new ObjectId(note._id) },
				{
					$set: { pinned: !note.pinned },
				}
			)
			if (res.modifiedCount !== 1) {
				return { success: false, data: null }
			}
	
			return {
				success: true,
				data: note,
			}
		} catch (error) {
			console.log("Error en el updateNote", error)
			return { success: false, data: null }
		}
	}	

---

### delete-todo.ts
	"use server"
	export const deleteTodo = async (todo: TodoType) => {
		try {
			const response = await axios.delete(API_ENDPOINTS.TODO_BY_ID(todo.id), {
				headers: {
					"Content-Type": "application/json",
				},
			})
	
			return response.status === 204 // 204 No Content es el código de éxito para DELETE
		} catch (error) {
			console.error("Error en deleteTodo:", error)
			if (axios.isAxiosError(error)) {
				console.error("Detalles del error:", error.response?.data)
				throw new Error(
					error.response?.data?.error || "Error al eliminar el TODO"
				)
			}
			throw new Error("Error desconocido al eliminar el TODO")
		}
	}

---

### mongo-connect.ts
	let client: MongoClient
	let clientPromise: Promise<MongoClient>
	
	declare global {
		// eslint-disable-next-line no-var
		var _mongoClientPromise: Promise<MongoClient> | undefined
	}
	const URI = process.env.NEXT_PUBLIC_MONGODB_URI!
	const DB = process.env.NEXT_PUBLIC_MONGODB_DB!
	const options = {}
	client = new MongoClient(URI, options)
	
	if (!URI) {
		throw new Error("Please add your MongoDB URI to the .env file")
	}
	
	try {
		if (process.env.NODE_ENV === "development") {
			// In development mode, use a global variable so that the MongoClient instance is not recreated.
			if (!global._mongoClientPromise) {
				client = new MongoClient(URI, options)
				global._mongoClientPromise = client.connect()
			}
			clientPromise = global._mongoClientPromise
		} else {
			// In production mode, it's best to not use a global variable.
			clientPromise = client.connect()
		}
	} catch (error) {
		if (error instanceof Error) console.log("ERROR", error.stack)
	} finally {
		await client.close()
		console.log("CLOSE")
	}
	
	async function getDatabase() {
		const client = await clientPromise
		return client.db(DB)
	}
	
	export async function getCollection(collectionName: string) {
		const db = await getDatabase()
		return db.collection(collectionName)
	}
	
	export default getDatabase

---

### mongo-query.ts
	export const useMongoNotes = () => {
		return useQuery({
			queryKey: ["mongo-notes"],
			queryFn: getMongoNotes,
			refetchOnWindowFocus: false,
			refetchInterval: 15 * 1000,
		})
	}

---

### mongo-mutation.ts
	export const useCreateMongoNote = () => {
		const queryClient = useQueryClient()
		return useMutation({
			mutationFn: createMongoNote,
			onMutate: async (newNote: MongoNoteType) => {
				await queryClient.cancelQueries({ queryKey: ["mongo-notes"] })
				const previousTodos = queryClient.getQueryData<MongoNoteType[]>([
					"mongo-notes",
				])
				if (!previousTodos) return
				queryClient.setQueryData(["mongo-notes"], (oldTodos: MongoNoteType[]) => [
					...(oldTodos || []),
					{ ...newNote, title: `${newNote.title} *` },
				])
				return { previousTodos }
			},
			onError: (_err, _newNote, context) => {
				queryClient.setQueryData(["mongo-notes"], context?.previousTodos)
			},
			//  SIN OPTIMISTIC
			// reemplazar el onMutate por onSuccess
		})
	}
	
	export const useUpdateMongoNote = () => {
		const queryClient = useQueryClient()
		return useMutation({
			mutationFn: updateMongoNote,
			// CON OPTIMISTIC
			onMutate: async (updatedNote: MongoNoteType) => {
				await queryClient.cancelQueries({ queryKey: ["mongo-notes"] })
				const previousNotes = queryClient.getQueryData<MongoNoteType[]>([
					"mongo-notes",
				])
				if (!previousNotes) return
				queryClient.setQueryData(["mongo-notes"], (oldNotes: MongoNoteType[]) =>
					oldNotes?.map(note =>
						note._id === updatedNote._id
							? { ...updatedNote, title: `${updatedNote.title} *` }
							: note
					)
				)
				return { previousNotes }
			},
			onError: (_err, _newNote, context) => {
				queryClient.setQueryData(["mongo-notes"], context?.previousNotes)
			},
	
			//  SIN OPTIMISTIC
			//  reemplazar el onMutate por onSuccess
		})
	}
	
	export const useDeleteMongoNote = () => {
		const queryClient = useQueryClient()
		return useMutation({
			mutationFn: deleteMongoNote,
			onMutate: async (deletedNote: MongoNoteType) => {
				await queryClient.cancelQueries({ queryKey: ["mongo-notes"] })
				const previousNotes = queryClient.getQueryData<MongoNoteType[]>([
					"mongo-notes",
				])
				if (!previousNotes) return
				queryClient.setQueryData(["mongo-notes"], (oldNotes: MongoNoteType[]) =>
					oldNotes?.filter(note => note._id !== deletedNote._id)
				)
				return { previousNotes }
			},
			onError: (_err, _deletedNote, context) => {
				queryClient.setQueryData(["mongo-notes"], context?.previousNotes)
			},
		})
	}

---

### get-mongoNotes.ts
	"use server"
	export const getMongoNotes = async (): Promise<MongoNoteType[]> => {
		await new Promise(resolve => setTimeout(resolve, 2000))
		console.log("GET new mongodb")
		const notesCollection = await getCollection("notes")
		const notes = await notesCollection.find().toArray()
	
		// Convert and validate MongoDB documents to ensure they match MongoNoteType
		const notesArray: MongoNoteType[] = notes.map(note => ({
			_id: note._id.toString(),
			title: note.title || "", // Provide default empty string if undefined
			content: note.content || "", // Provide default empty string if undefined
			author: note.author || "", // Provide default empty string if undefined
			pinned: note.pinned || false, // Provide default false if undefined
		}))
	
		return notesArray
	}

---

### create-mongoNote.ts
	"use server"
	export const createMongoNote = async (newNote: MongoNoteType) => {
		await new Promise(resolve => setTimeout(resolve, 2000))
		const user = "kp_36204bd6138c4b029b7f77d84fe30093"
	
		const note = {
			title: newNote.title,
			content: newNote.content,
			author: user,
			pinned: false,
		}
	
		try {
			const notesCollection = await getCollection("notes")
			const res = await notesCollection.insertOne(note)
			if (!res.insertedId.toString()) {
				return { success: false, data: null }
			}
			return {
				success: true,
				data: { ...note, _id: res.insertedId.toString() },
			}
		} catch (error) {
			console.log("Error en el createNote", error)
			return { success: false, data: null }
		}
	}

---

### update-mongoNote.ts
	"use server"
	export const updateMongoNote = async (note: MongoNoteType) => {
		await new Promise(resolve => setTimeout(resolve, 2000))
		try {
			const notesCollection = await getCollection("notes")
			// db validation
			const res = await notesCollection.updateOne(
				{ _id: new ObjectId(note._id) },
				{
					$set: { pinned: !note.pinned },
				}
			)
			if (res.modifiedCount !== 1) {
				return { success: false, data: null }
			}
	
			return {
				success: true,
				data: note,
			}
		} catch (error) {
			console.log("Error en el updateNote", error)
			return { success: false, data: null }
		}
	}

---

### delete-mongoNote.ts
	"use server"
	export const deleteMongoNote = async (note: MongoNoteType) => {
		await new Promise(resolve => setTimeout(resolve, 2000))
		try {
			const notesCollection = await getCollection("notes")
			const res = await notesCollection.deleteOne({ _id: new ObjectId(note._id) })
			if (res?.deletedCount !== 1) return { success: false, data: note }
			return { success: true, data: note }
		} catch (error) {
			console.log("Error en el deleteNote", error)
			return { success: false, data: note }
		}
	}

---

### sonner_id
	 const sonnerLoading = toast.loading("creando todo...")
	 try {
	    await createTodoMutation(newTodo, {
	        optimisticData: data =>
	            data && [
	                { ...newTodo, title: `${newTodo.title} (optimistic)` },
	                ...data,
	            ],
	    })
	    setTitle("")
	    toast.success("Todo creado exitosamente", { id: sonnerLoading })
	    } catch (error) {
	    console.error("Error creating todo:", error)
	    toast.error("Error creating todo", { id: sonnerLoading })
	    }

---

### sonner_promise
	startTransition(async () => {
	    toast.promise(createTodoProduction(newTodo, options), {
	        loading: "creando todo...",
	        success: "todo creado exitosamente",
	        error: "error al crear todo",
	    })
	
	    setTitle("")
	})


