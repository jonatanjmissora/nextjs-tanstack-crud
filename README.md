Como se usa:
==========
Preparacion del proyecto una vez clonado
1- instalar dependencias: bun install
2- creamos las variables de entorno en .env
    NEXT_PUBLIC_JSON_SERVER_URL=http://localhost:3001/todos
    NEXT_PUBLIC_MONGODB_URI=
    NEXT_PUBLIC_MONGODB_DB=
3- creamos db.json en data/db.json con el siguiente formato:
      {
        todos: [
          {userId: number, id: number, title: string, completed: boolean},
          ...
          ]
      }
    
    la API correra en http://localhost:3001/todos

3.25- instalamos concurrently:
"bun add -D concurrently"
3.5- agregamos al package.json el script para iniciar el proyecto y la API de json-server con un solo comando
"dev:all": "concurrently \"bun dev\" \"bun x json-server -w data/db.json -p 3001\"",
4- iniciar API de json-server con y el proyecto con un solo comando:
    bun dev:all
