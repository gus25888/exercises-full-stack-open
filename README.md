# Notas de Curso FullStack

## Parte 1 - Introducción a React

---

### Creación de app

---

Usando Vite:

```sh
# Para npm 6.x (desactualizado, pero aun en uso por algunos):
npm create vite@latest 'projectName' --template react
```

```sh
# Para npm 7+ (el doble guion adicional, después de `projectName` es necesario):
npm create vite@latest 'projectName' -- --template react
```

### Componentes

---

Son funciones JS que definen un conjunto de etiquetas HTML los cuales se utilizan luego en la aplicación para mostrar valores llamados props.

```jsx
const Button = ({ onSmash, text }) => (
  <button onClick={onSmash}>{text}</button>
);
```

#### Consideraciones respecto a los componentes

---

- *__Deben__* definirse con mayúscula inicial. Esto también aplica si son definidos como un archivo separado, el cual debe nombrarse igual.
- *__Deben__* retornar un HTML válido que tenga etiquetas de apertura y cierre, como __div__.
- Si no es así, el componente completo se *__debe__* rodear de una etiqueta vacía:

```jsx
<>
// Aquí irán el resto de etiquetas...
</>
```

- Además, dentro del HTML en que se llamará a ese componente, *__debe__* renderizarse como un componente autocerrado:

```jsx
<History allClicks={allClicks} />
```

- *__Deben__* estar definidas como una función independiente, es decir, __NO__ deben definirse dentro de otro componente. El siguiente ejemplo es un __ERROR__.

```jsx
    /* NO DEFINAS COMPONENTES DENTRO DE OTRO COMPONENTE */
        const App = () => {
        const [value, setValue] = useState(10)

        const setToValue = newValue => {
            console.log('value now', newValue)
            setValue(newValue)
        }

        // Display es erróneo aquí.
        const Display = props => <div>{props.value}</div>

        return (
            <div>
            <Display value={value} />
            <Button handleClick={() => setToValue(1000)} text="thousand" />
            <Button handleClick={() => setToValue(0)} text="reset" />
            <Button handleClick={() => setToValue(value + 1)} text="increment" />
            </div>
        )
    }

```

- Las funciones usadas al llamar a un componente, *__deben__* ser la referencia de la misma, es decir solo su nombre. Por ejemplo:

```jsx
<Button handleClick={clickIncrement} text="increment" />
```

En caso de que se necesite enviar parámetros a la función, se puede agregar una anónima para que la encapsule. Por ejemplo:

```jsx
<Button handleClick={() => setToValue(value + 1)} text="increment" />
```

#### *Props*

---

Las props corresponden a valores que se pueden pasar al componente al usarlo.
Dentro de la etiqueta HTML (que tendrá el nombre de la función, ej. `History`) se indica la variable que se quiera enviar seguida de un igual entre llaves, con el valor a usar, el cual puede ser un primitivo, un objeto, o una función.

```jsx

//Puede definirse como un parámetro con ese nombre.
// const History = (props) => {
//     const allClicks = props.allClicks;

//O extraerse directamente usando la sintaxis de ES6.
const History = ({ allClicks }) => {
    if (allClicks.length === 0) {
        return (
            <div>
                the app is used by pressing the buttons
            </div>
        )
    }
    return (
        <div>
            button press history: {allClicks.join('')}
        </div>
    )
}

```

Y para usarlos se deben indicar con su nombre y luego el valor que tendrá la variable.

```jsx
<History allClicks={allClicks} />
```

El valor puede ser en duro, o una expresión JS o una función. En el primer caso solamente, puede ir sin llaves.

```jsx
const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name='Maya' age={26 + 10} />
    </div>
  )
}
```

### useState (Hook de Estado): Manejo del estado del componente

---

Permite asociar una variable y su función correspondiente a un componente, lo cual permite hacer modificaciones a la forma en que se comporta.

```jsx
import { useState } from 'react'

const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}

export default App
```

En el ejemplo, *counter* es la variable, y *setCounter* la función que la controla.
Esta desestructuración funciona ya que React siempre retorna esas dos cosas al invocar a useState.

Al llamar a useState, se le puede enviar un valor de "inicio" a la variable, el cual puede ser un primitivo, un array o un objeto.

El hecho de generar una variable asociada a useState, implica que el componente estará siempre "vigilado" por si tiene cambios.
Si eso ocurre, se procederá a renderizar nuevamente, es decir, se realizará un refresco del mismo.

> __IMPORTANTE:__ Una de las mejores prácticas en React es levantar el estado en la jerarquía de componentes. La documentación dice: "A menudo, varios componentes deben reflejar los mismos datos cambiantes. Recomendamos elevar el estado compartido a su ancestro común más cercano."

También, como parte de buenas prácticas se recomienda definir componentes pequeños que construyan algo más grande.

### Consideraciones generales con los hooks (Funciones React que inician con "use")

---

- *NO* se deben llamar dentro de loops, ifs o subfunciones. Solo se deben llamar desde dentro de la función que define un componente de React.
- *En* caso de tener que manejar varios estados, deben privilegiarse su manejo de forma separada.
- *Se* requiere generar __SIEMPRE__ copias de la información antes de guardarla como datos. Las actualizaciones de valores ocurren de forma asíncrona, por lo que el valor de una variable no puede ser modificado directamente, sino que se debe usar una variable separada que tenga el valor actualizado y luego ese usar para generar la modificación a través de la función asociada al generar el useState.
Por ejemplo, en el fragmento siguiente se genera la variable `updatedLeft` para ello.

```jsx
const App = () => {

    const [left, setLeft] = useState(0)
    const [right, setRight] = useState(0)
    const [allClicks, setAllClicks] = useState([])
    const [total, setTotal] = useState(0)

    const handleLeftClick = () => {
        setAllClicks(allClicks.concat('L'))
        const updatedLeft = left + 1;
        setLeft(updatedLeft)
        setTotal(updatedLeft + right)
    }
    const handleRightClick = () => {
        setAllClicks(allClicks.concat('R'))
        const updatedRight = right + 1;
        setRight(updatedRight)
        setTotal(left + updatedRight)
    }

    return (
        <div>
            {left}
            <Button handleClick={handleLeftClick} text='left' />
            <Button handleClick={handleRightClick} text='right' />
            {right}
            <p>Total: {total}</p>
            <History allClicks={allClicks} />
        </div>
    )
}
```

En caso de los objetos y los arrays, se debe generar uno nuevo basado en el original para poder usarlo en el useState. Por ej. aquí se extrae el contenido del objeto en uno nuevo, el que se usa en la función setClicks.

```jsx
const App = () => {
    const [clicks, setClicks] = useState({
        left: 0, right: 0
    })


    const handleLeftClick = () => {
        setClicks({
            ...clicks,
            left: clicks.left + 1
        })
    }

    const handleRightClick = () => {
        setClicks({
            ...clicks,
            right: clicks.right + 1
        })
    }

    return (
        <div>
            {clicks.left}
            <button onClick={handleLeftClick}>left</button>
            <button onClick={handleRightClick}>right</button>
            {clicks.right}
        </div>
    )
}
```

### Controladores de Eventos

---

Es la denominación que tienen las funciones asociadas a los eventos que ocurren en los diferentes elementos HTML.

Por ejemplo, un __*button*__ tiene la capacidad de recibir clicks, por lo que tiene un evento asociado __*onClick*__.

En React, se deben asociar de la siguiente manera:

```jsx
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const handleClick = () => {
    console.log('clicked')
  }

  return (
    <div>
      <div>{counter}</div>
      <button onClick={handleClick}>
        plus
      </button>
    </div>
  )
}
```

> __NOTA__: Es recomendado por React que las funciones asociadas a controladores de Eventos, se denominen handle*Event*

---

## Parte 2 - Comunicandose con el servidor

---

### Renderizado de múltiples elementos

---

Para el renderizado de elementos que son múltiples, se puede usar __map__ para "envolverlos" en la etiqueta correspondiente.

```jsx
    <ul>{
    notesToShow.map((note) =>
        <Note
        key={note.id}
        note={note}
        toggleImportance={() => toggleImportanceOf(note.id)} />
    )
    }</ul>
```

> __IMPORTANTE__: Se debe agregar una propiedad "key" que sea única, para que React pueda reconocer y asociar correctamente cada componente generado con el loop. Su valor debe ser un id generado de forma específica para ese componente, es decir, NO se debe usar el indice del array en que se encuentran, por ej.

### Implementación de formularios

---

Para la implementación de Formularios se debe generar asociación del mismo con el State de la app
considerando que cada input o elemento que se requiere monitorear por cambios,
debe tener una inicialización como una variable en el State asociado a su "value".

Ej.:

```HTML
<input value={newNote} onChange={handleNoteChange} />
```

> __IMPORTANTE__: Se debe especificar un evento "onChange" para que un input sea reconocido por React como uno que espera cambios. Si no se asume que es un "read-only"

### useEffect (Hook de Efecto) para manejar datos externos a la aplicación

---

Para poder obtener datos (y sincronizarlos) desde una entidad externa (llamada HTTP, por ej.) en un componente, se debe usar un Hook de tipo Efecto (useEffect).

Recibe dos parámetros:

1. La función que realiza la gestión externa.
2. Un array que contiene los elementos que podrían hacer que el Efecto vuelva a ejecutarse, en respuesta al cambio de alguno de ellos. Si se envía uno vacío, se indica que el Efecto, se ejecuta en conjunto con el renderizado del componente asociado, y solo se vuelve a ejecutar si hay un re-renderizado del mismo.
En caso de que sí venga con un array con algun valor, el cambio de ese valor (o valores) realizará un nuevo renderizado del efecto.

### Manejo de datos externos

---

Por ahora, se visto el uso de la librería *axios* (`npm install axios`) para el manejo de las peticiones necesarias: GET, POST, PUT y DELETE para obtener, crear, actualizar y borrar datos respectivamente.

Esto se genera dentro del directorio `services`:

```jsx
import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

const readAll = () => {
    return axios
        .get(baseUrl)
        .then(response => response.data)
}

const create = newObject => {
    return axios
        .post(baseUrl, newObject)
        .then(response => response.data)
}

const update = (id, newObject) => {
    return axios
        .put(`${baseUrl}/${id}`, newObject)
        .then(response => response.data)
}

const deleteRegister = (id) => {
    return axios
        .delete(`${baseUrl}/${id}`)
        .then(response => response.data)
}

export default {
    readAll,
    create,
    update,
    deleteRegister
}
```

El código anterior permite mantener aislado en un solo módulo la interacción con el servidor backend (el cual puede ser usando el package `json-server` o un backend propio, que es lo común). Luego, cada función se debe referenciar en el archivo `jsx` que renderiza la información, es decir, `app.jsx`:

```jsx

//Creación:
const App = (props) => {
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Lectura...
  const hook = () => {
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes))
  }
  useEffect(hook, [])

  const addNotes = () => {
    // ....
      noteService
        .create(noteObject)
        .then(returnedNote => {
          setNotes(notes.concat(returnedNote))
          setNewNote('')
        })
  }

// Actualización:

  //* Permite invertir el valor de important de la nota.
  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    //* Aquí se usa map para identificar la "note" modificada y cargarla al state de "notes"
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        console.error(error.message);

        setErrorMessage(`note '${note.content}' was already deleted from server`)
        setTimeout(setErrorMessage(null), 5000)
        setNotes(notes.filter(note => note.id !== id))
      })
  }
  //...
}

```

#### Uso de json-server

---

Es una librería que permite generar una instancia de backend de forma automática, basado en un archivo json. Esto permite generar una maqueta preliminar de la forma de acceder a los datos desde el frontend sin necesidad de desarrollar el backend con anterioridad.

Se instala usando el comando `npm i --save-dev json-server`, ya que se debería usar solo como una herramienta para el desarrollo y no en forma productiva.

Para su uso se debe generar un archivo json en la raíz del proyecto, llamado `db.json`, que contenga el listado de los datos a consultar y/o modificar.

Luego, se debe configurar un script adicional en `package.json` llamado `server`:

```json

{
  // ...
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "lint-fix": "eslint . --fix",
    "preview": "vite preview",
    "server": "json-server -p3001 --watch db.json",
    "test": "vitest run"
  },
  // ...
}
```

> __NOTA__: Desde la versión 1, se puede omitir el flag `--watch` ya que si json-server se aplica a un solo archivo, automáticamente especifica esa opción.

Con ello, al usar el comando `npm run server`, se podrá tener una instancia backend accesible bajo el puerto 3001.

### Estilos en React

---

- *De* forma separada:

    La forma más ordenada de realizarlo es a través de archivos independientes que contengan las reglas.
    Luego, se importan en la aplicación directamente por nombre.

    ```jsx
    import './index.css'
    ```

- *En* linea:

    Para ello se deben enviar las reglas CSS al componente como un objeto JS.
    Se deben modificar los nombres de cada estilo para que se adapten a camelCase, en lugar de kebab-case (uso de guiones para separación) usado en CSS.

    Ejemplo:

    ```css
    {
        color: green;
        font-style: italic;
        font-size: 16px;
    }
    ```

    Se debe transformar a:

    ```jsx
    {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16
    }
    ```

    Luego, se debe referenciar directamente el objeto definido dentro de la propiedad __*style*__. Ejemplo:

    ```jsx
        const footerStyle = {
            color: 'green',
            fontStyle: 'italic',
            fontSize: 16
        }
        return (
            <div style={footerStyle}>
                <br />
                <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
            </div>
        )
    ```

---

## Parte 3 - Programando un servidor con NodeJS y Express

---

Para esta sección revisar [notes-backend](https://github.com/gus25888/notes-backend)

### Express

---

Libreria usada para la generación de endpoints (GET, POST, PUT, PATCH) que permiten la consulta de información a la fuente de almacenamiento de datos, como una base de datos o realizar cargas de archivos, entre muchas otras tareas.

Se instala usando npm: `npm i express`

#### Uso básico

---

```js
const express = require('express')
const app = express()

let notes = [
    {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

/* Controladores de rutas de acceso: funciones get, post, etc.*/
app.get('/', (request, response) => {
    response.send('<h1>Hello world</h1>')
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    }
    else {
        response.status(404).end()
    }
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId()
    }

    notes = notes.concat(note)

    response.json(note)
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1;
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

#### Nodemon y su uso en desarrollo

---

Nodemon es un package que permite el reinicio de la aplicación cada vez que se detecta algún cambio en su código.

Como tal, este comportamiento, solo se requiere en ambiente de desarrollo, por lo que en su instalación se considera eso:

```sh
npm i nodemon --save-dev
```

### Uso de Middlewares

---

Son funciones usadas para manejar objetos de request (datos de la solicitud HTTP) y response (datos de la respuesta a la solicitud realizada).

Reciben 3 parámetros:

- *request*: Datos de la solicitud enviada al endpoint
- *response*: Datos a usar para la respuesta
- *next*: Función que pasa el control al siguiente Middleware.

Ejemplo:

```js
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// ...

// Luego, se llama de este manera:
app.use(requestLogger)
```

El json-parser (`app.use(express.json())`) toma los datos sin procesar de las solicitudes que están almacenadas en el objeto *request*, los parsea en un objeto de JavaScript y lo asigna al objeto request como una nueva propiedad body.

En la práctica, puedes utilizar varios middleware al mismo tiempo. Cuando tienes más de uno, se ejecutan uno por uno en el orden en el que se definieron en el código de la aplicación.

 Pueden ser invocados antes o después de los controladores de rutas de acceso. Lo primero es lo común, ya que la idea es que hagan gestiones en los datos ANTES que la información llegue al controlador. Usarlos después es, por ejemplo, para poder manejar una solicitud que no se encuentre dentro de los controladores de ruta definidos.

```js

/* Middleware para el manejo de endpoints no definidos */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

```

### CORS (Cross Origin Resource Sharing)

---

Parte de la implementación del protocolo HTTP dentro de los navegadores es permitir solo conexiones del mismo origen. En este caso, origen se refiere al conjunto de protocolo, host y puerto.

```http
http://example.com:80/index.html

protocol: http
host: example.com
port: 80
```

Si esto no es idéntico, se considera como una conexión de otro origen, lo que hace que el navegador revise el encabezado de la respuesta, denominado *Access-Control-Allow-Origin*. Si contiene '*' en la URL del HTML fuente, el navegador procesará la respuesta; de lo contrario, el navegador se negará a procesarla y generará un error.

Para poder resolver esta situación, se implementó CORS, que es un mecanismo que permite la transferencia segura de elementos entre dos origenes distintos.

En la práctica, se debe utilizar un package llamado *cors*, el cual se usa como un Middleware dentro del backend.

```sh
npm i cors
```

Y así se usa dentro del servidor express:

```js
const cors = require('cors')
const app = express()

app.use(cors())
```

### Archivos Estáticos

---

Express tiene la capacidad de responder a requests que necesiten archivos físicos. Esto permite levantar el __frontend__ desde el mismo servidor de backend.

Para lograrlo, primero se debe copiar el directorio `dist` generado desde el frontend, el cual contiene los archivos que componen la app dentro de la raíz del backend. Este directorio se genera al ocupar el comando `build`:

```sh
npm run build
```

Esto compila todo el HTML, CSS y JS en un archivo por separado para cada uno y lo guarda en el directorio dist., lo cual deja la app como una SPA (Single Page Application)

Luego, en el __backend__ se debe agregar un nuevo middleware de Express llamado `static` (que es el nombre genérico de los archivos físicos, ya sea CSS, JS, imágenes, etc.) e indicar la ruta en que se encuentran:

```js
app.use(express.static('dist'))
```

### Proxy

---

Como en este caso, el servidor frontend espera que la comunicación se realice por el puerto 5173 para obtener los recursos necesarios para poder obtener los datos que renderiza. Por tanto, como el backend responde en el puerto 3001, se debe indicar esa situación para que así Vite redirija las solicitudes a la ruta *api* hacia el puerto correcto.

Para ello, se debe modificar el archivo `vite.config.js`, agregando una propiedad `server:proxy` al `defineConfig` de la siguiente manera:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})

```

### Despliegue de la app a internet

---

Se usa un servicio cloud como fly.io

Dentro se debe configurar la aplicación backend (en primera instancia) con los cambios para que pueda servir archivos estáticos.

Al desplegar se debe considerar que se debe dejar especificado el puerto en que se levantará el backend indicandolo como parte de las variables de entorno del nuevo servicio.

Comandos más importantes de fly.io

```sh
fly launch (Inicializar un nuevo servicio a desplegar)
fly deploy (Desplegar la aplicación con los datos definidos)
fly logs (Revisar los logs del servicio)
fly scale count 1 (Para disminuir a 1 la cantidad de máquinas generadas por el despliegue)
```

### Depurar aplicaciones

---

#### Frontend

---

Uso de la sentencia `debugger;` en cualquier punto del código, pausará la ejecución y permitirá revisar el estado y valor de las variables de la aplicación en ese momento.

#### Backend

---

Uso del comando `node --inspect file.js` o `nodemon --inspect file.js` para permitir la misma revisión que con debugger.

### Uso de MongoDB como repositorio de datos

---

En MongoDB, los datos se guardan de forma no relacional identificados por un campo unico (_id) en Documents. Los Documentos pueden contener cualquier valor, asociado a una clave en una estructura similar a un objeto JS.

Un conjunto de Documentos se agrupan en Colecciones. La base de datos finalmente, guarda de una a muchas colecciones.

Se recomienda el uso del paquete `mongoose` (`npm install mongoose`) para realizar la conexión y gestión de datos de una BD Mongo, por su capa de abstracción (APIs) que facilita el manejo de la información.

### Uso de mongoose

---

Para la gestión con Mongoose, se usa los `schemas` para determinar el formato que tendrán los Documentos, indicando el nombre de cada clave y el tipo de dato que almacenará. Siempre deben contar con una clave `id` para su identificación.

Además, los `models` permiten darle funcionalidad al schema al generar una nueva *"clase"* con el nombre dado al Schema.

```js
const mongoose = require('mongoose')
const url = `mongodb+srv://${dbUser}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)

/* Conexión a mongoDB */
mongoose
    .connect(url)
    .then(result => console.log(`Connected to MongoDB`))
    .catch(error => console.log(`Error connecting to MongoDB`, error.message))

/** Preparación de esquema para indicar los nombres y tipos de los documentos que se obtendrán desde la BD conectada. */
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})


/*
* Este proceso (set ('toJSON') ) permite personalizar el esquema y la forma en que devuelve los documentos desde Mongo.
* Mongoose requiere que cada documento, tenga su propio "id" por lo que se genera esa variable en cada uno
* basado en la propiedad de _id ya existente, pasando de ObjectId a string.
* Finalmente, se eliminan las propiedades no utilizadas.
*/
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

// Definición y exportación del modelo.
module.exports = mongoose.model('Note', noteSchema);


```

#### CRUD con mongoose

---

Para poder manejar esto, primero se debe generar una instancia del modelo definido para el Documento:

```js
const Note = mongoose.model('Note', noteSchema);
```

Sin embargo, se recomienda definir la conexión con mongo en un archivo separado, exportar el modelo:

```js
module.exports = mongoose.model('Note', noteSchema);
```

e importarlo en donde se implementarán los endpoints:

```js
const Note = require('./models/note')
```

Con el modelo definido, se puede instanciar para su uso.

##### Obtención de varios

---

```js
app.get('/api/notes', (request, response, next) => {
    Note
        .find({})
        .then(notes => {
            if (notes) {
                response.json(notes)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

```

##### Obtención de uno

---

```js
app.get('/api/notes/:id', (request, response, next) => {
    Note
        .findById(request.params.id)
        .then(noteObtained => {
            if (noteObtained) {
                response.json(noteObtained)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})
```

##### Creación

---

```js
app.post('/api/notes', (request, response, next) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const newNote = new Note({
        content: body.content,
        important: Boolean(body.important) || false,
    })

    newNote
        .save()
        .then(savedNote => response.json(savedNote))
        .catch(error => next(error))
})
```

##### Actualización

---

```js
app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body;

  /*
    Se genera un objeto plano con el nuevo contenido de la nota.
    NO SE USA una nueva instancia de Note para esto.
    Requiere:
      id Documento,
      nuevos valores a modificar
      opciones:
          new: true,           indica que el resultado de la operacion retornará la nota actualizada.
          runValidators: true, indica que se utilizará las validaciones definidas en el Schema
          context: 'query',    permite indicar que el contexto de la validacion afecta solo a esta operación.
  */
  const note = {
      content: body.content,
      important: body.important
  }

  Note
      .findByIdAndUpdate(request.params.id, note, { new: true, runValidators: true, context: 'query' })
      .then(updatedNote => { response.json(updatedNote) })
      .catch(error => next(error))
})


```

##### Borrado

---

```js
app.delete('/api/notes/:id', (request, response, next) => {
    Note
        .findByIdAndDelete(request.params.id)
        .then(result => { response.status(204).end() })
        .catch(error => next(error))
})
```

### Variables de entorno

---

Para la conexión de BD, es necesario que la URL de conexión esté guardada de forma separada y que __no__ sea respaldada en github.

Es por ello que se definen archivos *.env* para guardar esta información, en el formato siguiente:

```env
VARIABLE=VALOR_ASOCIADO
```

Para su acceso dentro de la aplicación, se debe usar el package `dotenv` (npm i dotenv).
Al inicio del archivo principal (index.js) de la aplicación se importa la función `config`.

Luego, se hace la referencia en una constante usando `process.env`. Por ej. para la variable MONGODB_URI

```js
require('dotenv').config()

const url = process.env.MONGODB_URI

```

Esto aplica para cualquier valor externo a la aplicación y que debe estar fuera del código fuente.

### Manejo de errores en Express

---

En express es posible definir middlewares de errores, los cuales son invocados desde cualquier endpoint usando la función next() y pasando el objeto de error como parámetro. La función next, se debe agregar como parámetro a cada endpoint.

El middleware en sí, debe estar incluido en el código, luego de la definición de TODOS los endpoints, es decir, al final del archivo, justo antes de la función que levanta la aplicación (función `listen`).

Ademas, debe tener estos 4 parametros, los cuales deben ser ordenados de la manera presentada, para ser identificado como un middleware de errores:

- *error*
- *request*
- *response*
- *next*

```js
app.get('/api/notes/:id', (request, response, next) => {
    Note
        .findById(request.params.id)
        .then(noteObtained => {
            if (noteObtained) {
                response.json(noteObtained)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// ...

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    /* Si no se encuentra alguna error específico, se maneja el error por el controlador de errores de Express.*/
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

```

### Validaciones en Mongoose

---

Las validaciones en Mongoose, se definen como parte del esquema. Existen validaciones integradas y personalizadas.

Las primeras solo se deben referenciar con su nombre y valor, como por ej. `required` o `minLength`.

Las últimas corresponden a funciones personalizadas, las cuales también tienen mensajes personalizados, se agregan como parte de la clave `validate` como un objeto compuesto de las propiedades `validator` y `message`, que contendrán las función validadora y el mensaje, respectivamente.

```js
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: [true, 'Name required'],
    },
    number: {
        type: String,
        minLength: 8,
        required: [true, 'Phone number required'],
        validate: {
            validator: (value) => /^\d{2,3}\-\d{5,}$/.test(value),
            message: (props) => `Phone number '${props.value}' is not valid. It must be 'xx-xxxxx' or 'xxx-xxxxx'`
        }
    },
})
```

### Lint

---

Consiste en una herramienta de análisis estático de software que detecta y marca errores de sintaxis, uso y estilo del código.
Ayuda a detectar errores de forma temprana en el código, antes de que se lleven a la ejecución y permite mantener una consistencia en la definición de los elementos que componen el código, por ej. la cantidad de espacio usado para separar las líneas de una función u objeto, el uso de punto y coma para las sentencias, entre muchas otras definiciones.

En el caso de JS, se usa __ESlint__. Para ello se instala como una dependencia de desarrollo y luego se inicializa en el proyecto.

```sh
npm install --save-dev eslint @stylistic/eslint-plugin-js
npx eslint --init
```

El paquete `stylistic` aplica una serie de reglas que permiten mantener la consistencia del estilo del código.
Este ultimo comando (`npx eslint --init`) genera un archivo `eslint.config.js`, en el que se indican todas las reglas que se aplicarán en el código del proyecto.

Las reglas a usar en el archivo obtenido se pueden obtener desde [aqui](<https://eslint.org/docs/latest/rules/>) en el caso de las *normales* y para las *stylistics* [aquí](<https://eslint.style/packages/js>)

---

#### Configuración de Prettier

[Prettier](https://prettier.io/docs/) es un formateador de código opinado, es decir, que tiene definido especificamente la forma en que se debe formatear los archivos, dejando muy poco margen a la personalización.

Se instala y configura con los siguientes comandos:

```sh
# Instalación
npm install --save-dev --save-exact prettier
# Crear el archivo de configuración
node --eval "fs.writeFileSync('.prettierrc','{}\n')"
# Crear el archivo para definir los archivos ignorados por Prettier.
node --eval "fs.writeFileSync('.prettierignore','# Ignore artifacts:\nbuild\ncoverage\n')"
```

Luego, para poder mantener el mismo formato que ESLint, se debe agregar las siguientes lineas a `.prettierrc`:

```js
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true
}
```

##### Integración de Prettier con ESLint

Es posible configurarlo para que funcione junto con ESlint, con el objetivo de eliminar completamente la necesidad de definir el formato del código a usar, manteniendo orden y consistencia en los archivos.

Se debe instalar el plugin `eslint-config-prettier` (`npm install --save-dev eslint-config-prettier`), y luego se debe modificar el archivo `.eslintrc.cjs` (o `eslint.config.js`, en caso de usar esa forma), agregando `prettier` como una nueva configuración dentro de la sección `extends`:

```js
{
  "extends": [
    // ...
    "plugin:prettier/recommended" //Agregar esto...
  ]
}
```

##### Uso de Prettier

Con las configuraciones aplicadas, para poder aplicar prettier se debe usar el comando `npx prettier . --write`.

Para su uso de forma más cómoda, se puede configurar como un nuevo script en `package.json`:

```json
{
  // ...
  "scripts": {
    // ...
    "prettier": "prettier . --write",
    "prettier-check": "prettier . --check",
  }
  //...
}
```

También se agregó un script con la opción `check` para permitir validar la aplicación de los formatos.

## Parte 4 - Probando servidores Express, administración de usuarios

---

### Estructura del proyecto backend

---

La forma de organizar los archivos considera la siguiente estructura propuesta, la cual se encuentra basada en las mejores prácticas definidas para backends desarrollados usando Express:

```md
├── index.js
├── app.js
├── dist
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js
```

Descripción de cada punto:

- *index.js*: Contiene el punto de acceso e inicio de la aplicación
- *app.js*: Contiene las definiciones de middlewares, inicio de la conexión de BD e importaciones necesarias para generar la aplicación Express
- __*dist*__: Contiene los archivos del frontend
- __*controllers*__: Contiene los endpoints (Routes) definidos para notes (GET,POST,PUT,DELETE)
- __*models*__: Contiene la definiciones de mongoose para note, definiendo el Schema y Model asociado.
- __*utils*__: Contiene las utilidades generales usadas en el proyecto:
  - *config.js* : el archivo de configuracion de variables de entorno
  - *logger.js* : el archivo que maneja la generación de logs
  - *middleware.js* : el archivo de los middlewares definidos para el uso general de la app:
    - acceso para endpoints desconocidos
    - gestor de errores
    - generación de info con detalles cuando se invocan los diferentes endpoints.
- *package.json* y *package-lock.json*: Contienen las definiciones de los comandos usados para el manejo de la aplicación y las dependencias del proyecto.
- *eslint.config.mjs*: Contiene las reglas usadas en el proyecto para eslint.

### Routers

---

Para modularizar el código, se generó dentro de *controllers* el archivo `notes.js`, que contiene una instancia de `Router` para poder definir los endpoints de notes.

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response, next) => { ... } )
notesRouter.post('/', (request, response, next) => { ... } )
notesRouter.delete('/:id', (request, response, next) => { ... } )
notesRouter.put('/:id', (request, response, next) => { ... } )

```

Este Router corresponde a una "mini-app" que permite realizar el enrutamiento y también la inclusión de middlewares en cada acceso. El Router generado es, a su vez, un middleware, lo cual permite incluirlo en la app a través de la función `use()`:

```js
const notesRouter = require('./controllers/notes')

const app = express()
.
.
.
app.use('/api/notes', notesRouter)
```

Al invocarlo desde la app, se indica a que dirección responderá el Router y siempre que se acceda a `/api/notes` el router responderá según el método utilizado. Es por ello que en cada método del Router, se define una ruta "vacía" ("/"), ya que la ruta se define una sola vez en `app.js`

Por tanto, esta forma de definirlo permite hacer que cada módulo (archivo js) maneje un conjunto de rutas relacionadas. Así, se requiere generar una nueva ruta, se puede generar un nuevo "controller", el cual contenga la lógica asociada.

### Formas de Exportación / Importación de Módulos

---

Para exportar funcionalidades desde cada archivo, se debe tener en cuenta, la cantidad de elementos a exportar, ya que de eso depende la forma más optima de hacerlo.

#### Exportación

---

En caso de que sean unas cuantas funciones, es posible utilizar un objeto JS para hacerlo. Por ej.:

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
```

Sin embargo, si es un solo elemento, lo más sencillo es igualar los exports a ese elemento:

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

// ...

module.exports = notesRouter
```

#### Importación

---

Para importarlos, en el primer caso, se debe desestructurar el objeto...

```js
const { info, error } = require('./utils/logger')

info('message')
error('error message')
```

... o usar con sintaxis de acceso a objetos.

```js
const logger = require('./utils/logger')

logger.info('message')

logger.error('error message')
```

En el segundo caso, se deben importar a una variable directamente:

```js
const notesRouter = require('./controllers/notes')

// ...

app.use('/api/notes', notesRouter)
```

### Test unitario de aplicaciones en Node

---

Existe una librería interna de Node `node:test`, la cual puede configurarse para realizar __tests unitarios__. Viene integrada con Node por lo que no requiere instalaciones adicionales.

#### Configuración

---

Modificar el script `test` en `package.json` a

```json
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "node --test",
  }
```

Luego, se deben generar archivos con extensión `.test.js` para que sean detectados por el script y ejecuten las condiciones de prueba definidas.

Al usar el comando, se aplican todas las pruebas definidas en los archivos con extensión `.test.js`.

Ejemplo:

Basado en esta función:

```js
const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length
}
```

Se genera las siguientes pruebas:

```js
const { test, describe } = require('node:test')
const assert = require('node:assert')

const average = require('../utils/for_testing').average

describe('average', () => {
  test('of one value is the value itself', () => {
    assert.strictEqual(average([1]), 1)
  })

  test('of many is calculated right', () => {
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5)
  })

  test('of empty array is zero', () => {
    assert.strictEqual(average([]), 0)
  })
})

```

En el script se importan tanto `node:test` como `node:assert`.

El primero para poder definir el test y luego usar *assert* para aplicar condiciones a un set de datos. Con las pruebas mostradas se espera encontrarse una igualdad por tipo y valor (===).

La función es ejecutada de forma directa, para comparar el resultado obtenido con el esperado.

Así, se puede ver que la prueba se define con la función `test`, la cual recibe dos parámetros: la descripción de lo que se va a probar, que es un string; y la función anónima que permite definir el código del que se compondrá la prueba. Normalmente, en este caso, se usa la función `assert` para ello.

Además, `describe` definida de la misma forma que `test`, permite realizar la agrupación por función de todas las pruebas a realizar.

##### Definición de ambientes distintos

---

Como parte de las definiciones necesarias para poder separar las condiciones que se requieren para pruebas se usa la variable de entorno `NODE_ENV`.

Se le debe asignar el valor *development*, *test* o *production* para los ambientes de __desarrollo__, __pruebas__ o __producción__, respectivamente.

Esto se implementa como parte de los scripts del proyecto en el `package.json`:

```json
{
  "name": "notes-backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    "test": "cross-env NODE_ENV=test node --test",
    .
    .
    .
  }
}
```

Adicionalmente, se instala el package `cross-env` (`npm i cross-env --save-dev`), como una dependencia de desarrollo para evitar los conflictos que genera la definicion de variables de entorno en Windows.

Con ello, es posible definir diferentes direcciones a las que apuntar a la base de datos, para NO afectar a los datos productivos mientras se realizan pruebas. Así, modificando el archivo `.env`...

```.env
MONGODB_URI=mongodb+srv://
PORT=3001

TEST_MONGODB_URI=mongodb+srv://
```

y el archivo `utils/config.js`:

```js
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
```

> __NOTA__: Se debe considerar que esta forma implementar la configuración de las variables de entorno para su uso dentro de los proyectos es similar a la utilizada (y recomendada) librería [`node-config`](https://github.com/node-config/node-config)

### Test de integración de aplicaciones en Node: Uso de Supertest

---

Se instala como una dependencia de desarrollo:

```sh
npm i supertest --save-dev
```

Este paquete permite generar la instancia de la aplicación Express, sin preocuparse de elegir el puerto a usar, ya que se usan puertos "internos" para el funcionamiento de la prueba solamente.

Esto además, permite probar directamente la funcionalidad sin necesidad de levantar el servidor completo y de forma automatizada.

```js
const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const Note = require('../models/note')
const app = require('../app')
const api = supertest(app)


const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

// Funcion que se ejecuta antes de cada prueba realizada.
beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    // Espera un código de exito
    .expect(200)
    /*
    En este punto se espera recibir un texto que contenga un 'application/json'.
    Se valida con un regex, debido a que la response contendrá,
     probablemente, otros caracteres extra.
  */
    .expect('Content-Type', /application\/json/)
})

// Se ejecuta al finalizar todos los tests
after(async () => {
  await mongoose.connection.close()
})
```

La función `beforeEach` permite generar acciones para asegurar que la base de datos se encuentre en el mismo estado para todos los tests que se realicen.

La función `after` permite definir una acción que se realizará después de ejecutar los tests definidos. En este caso, cerrar la conexión con MongoDB.

### Elegir los tests a aplicar

---

Independientemente, del tipo de test a realizar es posible omitirlos del conjunto de pruebas, ya que al usar el comando `npm test` se ejecutan todos los archivos terminados en `.test.js`.

- Forma 1:

    Agregar la función `only` a la prueba (test()) o a la suite (describe())::

    ```js
    test.only('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test.only('there are two notes', async () => {
        const response = await api.get('/api/notes')

        assert.strictEqual(response.body.length, 2)
    })
    ```

    y luego ejecutarlas con el comando `npm test -- --test-only`.

    Sin embargo, __NO__ se recomienda debido a que puede olvidarse quitarlas del código.

- Forma 2:

    Agregar la opción 'skip:true' a la prueba o a la suite:

    ```js
    describe('reverse', { skip: true }, () => {
        test('reverse of a', () => {
            const result = reverse('a')

            assert.strictEqual(result, 'a')
        })
    })
    ```

    que tiene el mismo problema que la Forma 1.

- Forma 3:

    Indicar en el comando a ejecutar los tests (o suites) que se desean ejecutar:

    ```sh
        #Por ruta relativa
        npm test -- tests/note_api.test.js
        #Por patrón de nombre
        npm test -- --test-name-pattern="the first note is about HTTP methods"
        npm run test -- --test-name-pattern="notes"
    ```

    > __IMPORTANTE__: Los dos guiones despues de `test` indican que es el final de las opciones a enviar a node, y que el resto de los argumentos del comando serán enviados al script como tal.

#### Ejecución de varias suites de prueba evitando concurrencia

---

Si se decide definir pruebas en múltiples archivos, debe notarse que por defecto cada archivo de prueba se ejecuta en su propio proceso (ver Modelo de ejecución de pruebas en la [documentación](https://nodejs.org/api/test.html#test-runner-execution-model)). La consecuencia de esto es que diferentes archivos de prueba se ejecutan al mismo tiempo. Dado que las pruebas comparten la misma base de datos, la ejecución simultánea puede causar problemas, que pueden evitarse ejecutando las pruebas con la opción `--test-concurrency=1`, es decir, definiéndolas para que se ejecuten secuencialmente.

### async / await

---

Es la forma recomendada de tratar con promesas. En lugar de usar la función `then()` de forma encadenada, se agrega `await` antes de la llamada a alguna función que retornará una promesa.

Se debe considerar que el uso de `await`, debe realizarse dentro de una función asíncrona, lo cual se denota con `async` antes de la función.

```js
const main = async () => {
  const notes = await Note.find({})
  console.log('operation returned the following notes', notes)

  const response = await notes[0].remove()
  console.log('the first note is removed')
}
```

#### Manejo de errores con async/await

---

Para ello, simplemente se debe agregar secciones `try/catch` en los puntos del código en que pueden ocurrir errores. El middleware de manejo de errores, se llama desde el bloque `catch`

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const newNote = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
  })

  try {
    const savedNote = await newNote.save()

    response.status(201).json(savedNote)
  } catch (exception) {
    next(exception)
  }

})
```

##### Omisión de bloques `try/catch`

---

Considerando que la estructura seguida por los endpoints que usan funciones que requieren `try/catch`, se genera una cantidad de código repetido debido a la misma estructura generada:

```js
  try {
    // Código...
  } catch (exception) {
    next(exception)
  }
```

Para ello existe una librería llamada __express-async-errors__ (`npm install express-async-errors`) que permite "omitir" esas declaraciones, manejando las excepciones por debajo y enviandolas automáticamente al middleware de errores.

Se usa dentro de la definición principal de la aplicación, importandola __ANTES__ que las rutas (Routes):

```js
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
require('express-async-errors')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const notesRouter = require('./controllers/notes')

const app = express()

```

Así, se pasa de esto:

```js
notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```

a esto:

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
```

#### Uso de async / await para múltiples registros

---

Para iniciar el proceso de las pruebas, se requiere borrar y luego cargar una lista de valores, lo cual usando promesas puede llevar a resultados inesperados, ya que las asincronía de los procesos, podría llevar a que se inicien las pruebas sin cargar los valores antes.

Por ello, se hace uso de `Promise.all()`, lo cual permite ejecutar un array de promesas de forma paralela. Así, se puede pasar de esto:

```js
  beforeEach(async () => {
    await Note.deleteMany({})

    let noteObject = new Note(helper.initialNotes[0])
    await noteObject.save()
    noteObject = new Note(helper.initialNotes[1])
    await noteObject.save()
  })

```

a esto:

```js
  beforeEach(async () => {
    await Note.deleteMany({})

    // Se generan un array con las notas a crear
    const noteObjects = helper.initialNotes.map(note => new Note(note))
    // Se genera un array con promesas de la creación de cada nota.
    const promiseArray = noteObjects.map(note => note.save())
    // Se espera a que todas se cumplan para continuar.
    await Promise.all(promiseArray)
  })
```

En caso de ser necesario un orden específico para las ejecución de las promesas, se debería usar `for...of`:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})
```

### Gestión de usuarios

---

En Mongo, ya que es una BD no relacional, no existe un mecanismo definido para relacionar los usuarios con los elementos que creen en la aplicación. En caso del ejemplo de la app de Notas, lo que se implementa es registrar la relación en ambas entidades: el Schema de Notes, tiene el usuario que lo creó:

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
```

A su vez, el Schema de User, contiene el listado de todas las notas que fueron creadas por el:

```js
const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})
```

Para el manejo de las passwords de forma segura, se debe guardar el hash de la misma. Para ello, se utiliza el paquete bcrypt (`npm i bcrypt`), el cual implementa el algoritmo [bcrypt](https://en.wikipedia.org/wiki/Bcrypt), que es considerado el estándar para esto.

#### Uso de bcrypt

---

bcrypt se usa en el endpoint requerido para poder guardar los nuevos usuarios:

```js
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', { content: 1, important: 1 })
  response.json(users)
})


usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
```

En la función `hash`, se indica el texto a encriptar y la cantidad de "iteraciones" que se le dará al algoritmo para generar el string hasheado. Esto es lo que se guarda en la base de datos y que después se utiliza para comprobar la coincidencia de la clave, es decir, se comparan *hashes*, nunca se sabe cuál es la clave del usuario.

### Llenado de datos

---

Considerando la relación que tienen los dos schemas definidos, se deben generar operaciones similares en ambos controllers para poder reflejar los valores de uno en otro.

Por tanto, se debe agregar la capacidad de que al llenar la nota se actualice el usuario con el ID obtenido:

```js
notesRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)

  const newNote = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
    user: user.id
  })

  const savedNote = await newNote.save()

  //Aquí se actualiza lo obtenido, sumandolo a lo ya existente.
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)

})
```

### Método `populate` de Mongoose para realizar uniones de colecciones

---

Como ambas colecciones tienen información la una de la otra, se debe usar el método `populate` para poder enlazar ambas.

> __NOTA__: Se debe tener en cuenta que Mongo es una BD NO relacional, por lo que a pesar de la unión que se hace con este método, no es posible asegurar que los datos estarán efectivamente relacionados, ya que el concepto de "transacción", que asegura tener los datos aislados y sin cambios, __NO__ aplica en Mongo.

```js
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', { content: 1, important: 1 })
  response.json(users)
})
```

A la función `populate`, se le envía el nombre de la propiedad, y las columnas que se deben mostrar de la misma (content e important) marcando con 1.

En caso de querer ocultar alguna columna, se marca con un 0.

La relación es posible de realizar por la definición de `type ObjectId` realizada en la propiedad `notes`

```js
  const userSchema = new mongoose.Schema({
    // ...
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
      }
    ],
  })
```

### Implementación de autenticación basada en tokens

---

Para ello se hace uso de la librería [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken) (`npm install jsonwebtoken`)

Esto se debe implementar como un nuevo `controller` que responda a la URI `/api/login`. Recibirá como parámetro `username` y `password`.

```js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  // Esta linea compara la clave enviado con el hash generado.
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
```

> __IMPORTANTE__: El `SECRET` usado junto con la función `jwt.sign()` corresponde a un texto cualquiera usado para poder encriptar el contenido del token. Es una variable que va registrada dentro de las variables de entorno en el archivo `.env`, y por tanto, permite generar la firma digital del token obtenido, ya que es un valor conocido solo por el servidor.

Luego, se implementa como una nueva ruta (`/api/login`) en `app.js`:

```js
// ....
const loginRouter = require('./controllers/login')

const app = express()

// ....

app.use('/api/login', loginRouter)

```

#### Uso de token para identificar usuarios e impedir la gestión, por si hay un token inválido

---

Se usa para ello el encabezado `Authorization` recibido en la request, con el tipo *Bearer*.

La modificación a realizar se aplica para el endpoint `POST`:

```js
const jwt = require('jsonwebtoken')

// ...
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  //...
})

```

`jwt.verify()`, permite validar que el token generado sea válido. Si no es así, se indica eso con código 401 (Unauthorized) y no se realizan más acciones.

> __NOTA__: Si la aplicación tiene múltiples interfaces que requieren identificación, la validación de JWT debe separarse en su propio middleware. También se podría utilizar alguna librería existente como [express-jwt](https://www.npmjs.com/package/express-jwt).

#### Duración del token generado

---

Para poder hacer que el token sea seguro, se debe definir un tiempo de expiración del mismo, lo que hará que el usuario deba generar uno nuevo cuando este caduque. Para ello se debe agregar la opción `expiresIn` en la función `jwt.sign()`

```js

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  // ...

  // Durará una hora el token
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})
```

Adicionalmente, cuando expire el token generará un error indicando esa situación, lo cual se debe agregar al middleware de manejo de errores, en conjunto con una opción para indicar que no hay un token válido.

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
  // ...

  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({error: 'token expired'})
  }

next(error)
}
```

> __IMPORTANTE__: Se debe tener en cuenta que la implementación de tokens debe ser realizada siempre usando un servidor con HTTPS, ya que el traspaso de información dentro del token, podría ser interceptado, a pesar de todas las medidas de encriptación tomadas dentro del servidor.
---

## Parte 5 - Probando aplicaciones React

---

### Integrar login en React

---

Para ello, se debe considerar agregar las siguientes partes:

1. __Servicio__: Agregar un servicio (`services/login.js`) que referencie al endpoint `login` desarrollado en el backend (en la parte 4 del curso)

    Para el __servicio__, simplemente se debe usar la librería axios (o el método que se use para poder consumir los endpoint s del backend) y enviar los parámetros necesarios como una llamada POST:

    ```js
    import axios from 'axios'
    const baseUrl = '/api/login'

    const login = async credentials => {
      const response = await axios.post(baseUrl, credentials)
      return response.data
    }

    export default { login }
    ```

1. __Formulario__: Agregar un formulario para poder ingresar los datos de usuario y contraseña.

    Esto se logra definiendo un componente (`components/LoginForm.jsx`) que contenga los campos necesarios y el botón para enviar la información.

    ```jsx
          const loginForm = ({ username, password, setUsername, setPassword, handleLogin }) => (
            <form onSubmit={handleLogin}>
              <div>
                username
                <input
                  type="text"
                  value={username}
                  name="Username"
                  onChange={({ target }) => setUsername(target.value)}
                />
              </div>
              <div>
                password
                <input
                  type="password"
                  value={password}
                  name="Password"
                  onChange={({ target }) => setPassword(target.value)}
                />
              </div>
              <button type="submit">login</button>
            </form>)

          export default loginForm

    ```

    Luego, ese componente se importa y se usa en `app.jsx`:

    ```jsx
    //...
    import LoginForm from "./components/LoginForm"

    const App = () => {
      // ...
      const [username, setUsername] = useState('')
      const [password, setPassword] = useState('')
      const [user, setUser] = useState(null)

      const getInitialNotes = () => {
        noteService
          .getAll()
          .then(initialNotes => setNotes(initialNotes))
      }
      useEffect(getInitialNotes, [])

      useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
        if (loggedUserJSON) {
          const user = JSON.parse(loggedUserJSON)
          setUser(user)
          noteService.setToken(user.token)
        }
      }, [])

      const handleLogin = async (event) => {
        event.preventDefault()

        try {
          const user = await loginService.login({ username, password })

          window.localStorage.setItem(
            'loggedNoteappUser', JSON.stringify(user)
          )
          noteService.setToken(user.token)
          setUser(user)
          setUsername('')
          setPassword('')

        } catch (exception) {
          console.error(exception)
          setErrorMessage('Wrong credentials')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }
      }

      const handleLogout = () => {
        window.localStorage.removeItem('loggedNoteappUser')
        setUser(null)
      }

      // ...

        return (
          <div>
            <Notification message={errorMessage} />

            <h1>Notes</h1>

            {
              user === null ?
                LoginForm({ username, password, handleLogin, setUsername, setPassword }) :
                <div>
                  <p>{user.name} logged-in <button onClick={() => { handleLogout() }}>logout</button></p>
                  {NoteForm({ newNote, addNote, handleNoteChange, handleLogout })}
                </div>
            }

          </div>
          // ...
        )
    }
    ```

    Las variables `username`, `password`, `user` se agregan al State de la app para poder generar la sesión nueva.

    > __NOTA__: Las funciones relacionadas con `window.localStorage` se explican más adelante en "Token de sesión persistente".

1. __Token__: Agregar el token de autenticación a los endpoints ya implementados en el directorio `service` que lo requieran.

    ```js
    import axios from 'axios'

    const baseUrl = '/api/notes'

    let token = null

    const setToken = (newToken) => {
        token = `Bearer ${newToken}`
    }

    const getAll = () => {
        const request = axios.get(baseUrl)
        return request.then(response => response.data)
    }

    const create = async newObject => {
        const config = {
            headers: { Authorization: token }
        }
        const response = await axios.post(baseUrl, newObject, config)
        return response.data
    }

    // ...

    export default { setToken, getAll, create /* ... */ }
    ```

### Renderizar de forma condicional (uso de operador &&)

---

Es común usar el operador `&&` en forma de "corto-circuito" para poder determinar si se renderiza un elemento:

```jsx
const App = () => {
  // ...

  const loginForm = () => (
    // ...
  )

  const noteForm = () => (
    // ...
  )

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      {user === null && loginForm()}
      {user !== null && noteForm()}

      </div>
  )
}

```

Lo que significa es que si el lado izquierdo de la evaluación "AND" es "falsy", React funciona como si hubiera un `undefined`, es decir, omite renderizar algo.

En cambio, si es verdadero (truthy), ejecutará la función y mostrará el formulario.

### Token de sesión persistente (uso de localStorage)

---

Una forma de hacerlo (que en general se puede usar pero puede tener problemas de seguridad ya que es potencialmente vulnerable a [ataques XSS](https://owasp.org/www-community/attacks/xss/)) es el uso de `local-storage`.

local-storage es una BD de clave-valor, integrada en el navegador y que permite guardar información en forma de [DOMStrings](https://docs.w3cub.com/dom/domstring) los cuales se mantienen a pesar de realizar refrescos en la página. Son independientes por cada *origen* (suma de protocolo, dominio y puerto de una URL) usado.

Como se usa ese tipo de dato, se deben manipular como JSON, es decir, usar `JSON.stringify` para guardarlos y `JSON.parse` para leerlos.

```jsx
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      // ...
    } catch (exception) {
      // ...
    }
  }

```

También es necesario saber que para existen los métodos `window.localStorage.setItem('clave')` y `window.localStorage.removeItem('clave')` para dar valor a la clave enviada y eliminar la clave enviada, respectivamente. Adicionalmente, existe `window.localStorage.clear()` que borra todas las claves.

### props.children

---

Son las propiedades que puede tener cualquier elemento definido como el padre de otro.

Para definir un elemento padre, se debe definir usando etiquetas de apertura y cierre explicitas:

```jsx
<Togglable buttonLabel="reveal">
  <p>this line is at start hidden</p>
  <p>also this is hidden</p>
</Togglable>
```

Aquí todo lo que está dentro de `Togglable` se considera hijo (children).

Para poder definir correctamente los valores de un elemento hijo, existen las `props.children`, las cuales permiten pasar la información del hijo y no colisionar con las del padre.

Así se define un componente padre de forma completa:

```jsx
import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable

```

Estas propiedades `children` existen en todos los componentes definidos, sin embargo, son definidas como un array vacío. Esto en el caso de los elementos definidos de forma que son autocerrados:

```jsx
// Aquí props.children === []
<Note
  key={note.id}
  note={note}
  toggleImportance={() => toggleImportanceOf(note.id)}
/>

```

### Traspasar el manejo de las variables de estado a su componente

---

Para ello, simplemente se debe hacer que `useState()` sea determinado dentro del componente y ajustar de forma acorde la app. Esto puede ser realizado para variables que son solo afectadas directamente y depende solo del componente en que se renderizan.

```jsx
import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true
    })

    setNewNote('')
  }

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
```

En este caso, el componente recibe la función que permite generar el `submit` del formulario definido. La función `createNote` está definida en la app.jsx:

```jsx
  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })

  }


  // ...

  <div>
  <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
    <Togglable buttonLabel='new note' ref={noteFormRef}>
    <NoteForm createNote={addNote} />
    </Togglable>
  </div>
```

### Referencias a componentes (`ref` de React)

---

Esto hace uso del hook `useRef` de React, lo cual genera una `ref`. La ref generada constituye una variable que __no__ genera nuevos renderizados del componente al recibir cambios, y es seguido por React durante toda la vida del componente.

```jsx
import { useEffect, useState, useRef } from "react"

//...

const App = () => {
  const noteFormRef = useRef()

  const [loginVisible, setLoginVisible] = useState(false)
  const [notes, setNotes] = useState(null)

  // ...

    return (
    <div>
      <Notification message={errorMessage} />

      <h1>Notes</h1>

      {
        user === null ? loginForm() :
          <div>
            <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
            <Togglable buttonLabel='new note' ref={noteFormRef}>
              <NoteForm createNote={addNote} />
            </Togglable>
          </div>
      }

      // ...
    )
}
```

Dentro del código, al llamar `useRef()`, se retorna una variable, que es un objeto plano JS, el cual contiene la propiedad `current`, cuyo valor sea el enviado en la llamada a `useRef()`.

#### Uso de ref para poder acceder a variables internas de un componente

---

Si lo que se quiere lograr es manipular de forma dinámica el DOM de un página, la forma de realizar con React es usando una `ref`, a la cual se le asigne en el elemento a manipular.

Así ocurre en el ejemplo anterior en que se asigna como una propiedad de la etiqueta `Togglable`:

```jsx
<Togglable buttonLabel='new note' ref={noteFormRef}>
```

Luego, en la definición del componente, se debe indicar explicitamente, que se quiere "exponer" alguna función o comportamiento, ya que, por defecto en React, los componentes personalizados tienen sus propiedades __inaccesibles__ para cualquier otro componente. Esto se logra usando `forwardRef()` y `useImperativeHandle()`.

```jsx
import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

export default Togglable

```

`forwardRef()` permite pasar las referencias del padre a sus hijos, además, de pasar las props de la misma.
`useImperativeHandle()` permite limitar la cantidad de propiedades que se quieren exponer de un elemento, ya que estará limitado por lo que se retorne en el objeto dentro de esa función.

### prop-types: Validación de datos hacia componentes React

Es una librería que permite la validación de los props enviados a los componentes en React a nivel de Desarrollo.
Para su uso se debe instalar `npm install prop-types`.

Luego, se importa en el componente y se indica como un objeto las variables y sus restricciones correspondientes:

```jsx
import PropTypes from 'prop-types'

const LoginForm = ({ username, password, handleSubmit, handleUsernameChange, handlePasswordChange }) => {
  // ...
}

LoginForm.PropTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired
}

export default LoginForm
```

Detalles de su uso se pueden encontrar [aquí](https://www.dhiwise.com/post/solution-for-children-is-missing-in-props-validation-in)

### eslint en React

---

#### eslint versión 9.3 en adelante

---

Las aplicaciones creadas para React con Vite, ya vienen con eslint incorporado.

Por tanto, solo se debe modificar el archivo `eslint.config.js`, ubicado en la raíz del proyecto, agregando dos cosas

- Valor `ignores`: que permiten indicar qué archivos / directorios no serán considerados por eslint.

```js
  { ignores: ['node_modules', 'dist', 'vite.config.js'] },
```

- Valor `rules`: que permiten indicar reglas específicas a considerar dentro del proyecto.

```js
      'indent': [
        'error',
        2
      ],
      'linebreak-style': [
        'error',
        'unix'
      ],
      'quotes': [
        'error',
        'single'
      ],
      'semi': [
        'error',
        'never'
      ],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ],
      'no-console': 0,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 0,
      'no-unused-vars': 0
```

Con esto, el archivo quedará así:

```js
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['node_modules', 'dist', 'vite.config.js'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'indent': [
        'error',
        2
      ],
      'linebreak-style': [
        'error',
        'unix'
      ],
      'quotes': [
        'error',
        'single'
      ],
      'semi': [
        'error',
        'never'
      ],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ],
      'no-console': 0,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 0,
      'no-unused-vars': 0
    },
  },
]

```

#### Versiones anteriores de eslint

---

En caso de versiones anteriores, los `ignore` van en un archivo separado, llamado `.eslintignore`, en el que se ponen en cada línea los archivos y directorios a ignorar.

En el caso del archivo con las `rules`, se denominará `.eslintrc.cjs` y tendrá el siguiente formato:

```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 'always'
    ],
    'arrow-spacing': [
      'error', { 'before': true, 'after': true }
    ],
    'no-console': 0,
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 0,
    'no-unused-vars': 0
  },
}

```

### Prueba de aplicaciones React - Uso de Vitest y jsdom

---

> __IMPORTANTE__: La forma de definir la ubicación de las pruebas difiere algo en caso del Frontend. Es válido considerar que las pruebas se encuentren juntas con el componente que están probando, por lo que el archivo `test.js` que se genere quedará en el mismo directorio. Esto aplica para pruebas __unitarias__. Para pruebas de __integración__, ahí sí se vuelve a dejar todas las pruebas en un directorio `test`.

#### Instalaciones necesarias

---

Se requiere instalar las siguientes librerías de base: `vitest` y `jsdom`

`npm install --save-dev vitest jsdom`

También se hace necesario para poder renderizar componentes React, las librerías `react-testing-library` y `jest-dom`

`npm install --save-dev @testing-library/react @testing-library/jest-dom`

Además, se debe instalar la librería `user-event` para poder simular la interacción del usuario:

`npm install --save-dev @testing-library/user-event`

Luego, se puede instalar este plugin para evitar que eslint indique errores en las definiciones de funciones obtenidas desde las librerías de test (ya que no son importadas directamente en el archivo `.test.js`):

`npm install --save-dev eslint-plugin-vitest-globals`

Y se debe agregar las lineas siguientes en el archivo de eslint (`eslint.config.js`):

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    vitest-globals/env: true  //AGREGAR ESTO
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:vitest-globals/recommended', //AGREGAR ESTO
  ],
  // ...
}

```

Con esas instalaciones realizadas, (documentación [aquí](https://testing-library.com/)) se puede proceder a realizar las configuraciones para poder realizar las pruebas.

#### Configuración de las librerías de prueba

---

- Se debe agregar comando `vitest run`, bajo la denominación `test` en `package.json`

  ```json
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      // ...
      "test": "vitest run"
    },
  ```

- Agregar nuevo archivo `testSetup.js` en la raíz del proyecto, para hacer el setup de las pruebas:

  ```js
  import { afterEach } from 'vitest'
  import { cleanup } from '@testing-library/react'
  import '@testing-library/jest-dom/vitest'

  afterEach(() => {
    cleanup()
  })
  ```

  > __NOTA__: Al poner `globals: true` permite *omitir* la necesidad de importar palabras clave como `describe`, `test` y `expect` en las pruebas.

- Modificar archivo `vite.config.js` para utilizar el setup. Se debe agregar el objeto `test` al archivo para poder indicarlo:

  ```js
  export default defineConfig({
    plugins: [react()],
    server: {
      // ...
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './testSetup.js',
    }
  })

  ```

#### Implementación de las pruebas

---

Para implementar cualquier prueba se debe definir un archivo con el nombre del componente y la extensión `test.js`. Por ejemplo, el siguiente código prueba la renderización correcta del componente Note.

```js
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }


  const { container } = render(<Note note={note} />)


  const div = container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})

```

> __NOTA__: A pesar de que hay distintos métodos para encontrar elementos para su uso en pruebas, el uso de `container` es el más flexible, ya que la función `querySelector()` , que tienen disponible es idénticaa la usada en el desarrollo de una página web.

o de esta otra forma:

```js
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')


  expect(element).toBeDefined()
})
```

Luego, con el archivo definido, se puede ejecutar la prueba con el comando `npm test`.

> __NOTA__: Al igual que con las pruebas de backend, es posible usar el flag `--test-name-pattern 'test-name'`  en el comando `npm test --` para filtrar y aplicar solo las pruebas necesarias.

#### Cobertura de las pruebas (Coverage)

---

Para validar la cobertura que tienen las pruebas realizadas se debe usar el siguiente comando:

`npm test -- --coverage`

#### Elementos más importantes en la librería

---

- `render`: Permite mostrar el elemento dentro del navegador simulado.
- `screen`: Permite el acceso a la ventana definida dentro del navegador simulado. Dentro de él existe un objeto `window`, idéntico al de un navegador real, en donde se puede hacer búsqueda de elementos a través del DOM de la página.

  - `debug()`, que funciona como un `console.log` permitiendo mostrar todos los elementos generados en la ejecución de la prueba.
  - `getBy...()`, que permite buscar e identificar elementos dentro de la página creada para poder validarlos, similar a `querySelector()`. Se debe considerar que de las variedades a usar, hay que seleccionar el que sea más adecuado para la situación dependiendo de la definición del HTML que se busque. Más detalles [aquí](https://testing-library.com/docs/queries/about)

### Simulación de acciones del usuario con userEvent

---

La librería `user-event` tiene métodos con nombres similares (o idénticos) a los eventos de los elementos HTML, como click.

Para su uso, se debe generar una "session" que permita simular la creación de un usuario así:

```js
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'


test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  // vi.fn(), (de vitest) permite generar una función mock para simular la función que debería ir en el lugar, es decir, simular la creación de las funciones de dependencia del componente.
  const mockHandler = vi.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  // Esto crea la session del usuario
  const user = userEvent.setup()
  const button = screen.getByText('make not important')

  // Luego, el uso de `click` retona una promesa que simula ejecución del click.
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})

```

> __IMPORTANTE__: Considerando que las pruebas buscan probar interacciones de los elementos de una página, es necesario, la mayoría de veces, definir una class al elemento en sí, para poder encontrarlo más fácilmente.

### Pruebas de Extremo a Extremo (E2E) con Playwright

---

#### Instalación

---

Para poder usar [Playwright](https://playwright.dev/) se debe generar un proyecto node separado en el cual se definan las pruebas a realizar. Esto se logra usando el comando `npm init playwright@latest` dentro de un directorio nuevo separado del frontend y del backend.

Esto implica que el proyecto de pruebas funciona independiente. Por tanto, se deben levantar los dos proyectos para poder aplicar las pruebas.

#### Configuraciones del proyecto de pruebas

---

Con la implementación del comando `playwright`, se debe agregar las siguientes líneas al archivo `playwright.config.js`:

```js
module.exports = defineConfig({

  timeout: 3000,
  fullyParallel: false,
  workers: 1,
  // ...

  use: {
    baseURL: 'http://localhost:5173',
  }
})
```

- `timeout` permite determinar el tiempo que esperará Playwright para que cualquier elemento buscado dentro del frontend esté preparado para las acciones a probar.

- `fullyParallel` indica que se requiere que las pruebas se ejecuten de forma secuencial, debido a que la conexión a la base de datos, puede presentar problemas si se ejecuta en modo de paralelismo.

- `workers` indica la cantidad de procesos que se generarán para cada prueba.

- `user.baseURL` indica la URL a la que se apunta en las pruebas realizadas. Con ello, se puede indicar que el acceso a la raíz de la aplicación sea llamado solo con slash ('/')

Además, como es un proyecto Node, se deben definir los comandos que permitirán ejecutar las pruebas. Dentro de `package.json`:

```json
{
  // ...
  "scripts": {
    "test": "playwright test",
    "test:report": "playwright show-report"
  },
  // ...
}
```

> __NOTA__: La opción `show-report` levanta un servidor local que renderiza una página web con todos los datos compilados de las pruebas realizadas, lo cual se genera con cada ejecución de `playwright test`.

#### Opciones adicionales para el comando `npm test`

---

Adicionalmente, existen flags que se pueden indicar para poder modificar el comportamiento obtenido al ejecutar las pruebas.

- Si se quiere probar en un solo navegador, ya que, por defecto, Playwright prueba en 3 navegadores cada suite, se debe usar el flag `--project chromium`:

  `npm test -- --project chromium`

- Si se quiere levantar un entorno gráfico al realizar cada prueba, se debe usar el flag `--ui`:

  `npm run test -- --ui`

- Si se quiere ejecutar solo una prueba se puede indicar con el flag `-g`:

  `npm test -- -g "login fails with wrong password"`

- Si se quiere revisar una prueba en particular, para su ejecución paso a paso, se debe usar el flag `--debug`:

  `npm test -- -g "importance can be changed" --debug`

- Si se quiere dejar un rastro de la prueba realizada, se debe usar el flag `--trace on`

  `npm run test -- --trace on`

Por último, es posible [generar una nueva prueba](https://playwright.dev/docs/codegen-intro) grabando la interacción con el navegador al realizarla por una persona. Para ello, se puede usar `npx playwright codegen URL_A_PROBAR`, lo cual permitirá registrar todos los identificadores y acciones requeridas para poder repetir las acciones registradas.

#### Configuraciones para Frontend

---

En el Frontend, solo se debe levantar la aplicación en modo desarrollo, usando el comando `npm run dev`

#### Configuraciones para Backend

---

Se debe configurar un nuevo modo de inicio del backend para uso en pruebas. Por tanto, se debe agregar un nuevo script en `package.json`. La idea es que la app funcione como en modo productivo, pero apuntando a modo test.

```json
{
  // ...
  "scripts": {
    // ...
    "start:test": "NODE_ENV=test node index.js"
  },
  // ...
}
```

Este modo se debe usar al levantar el backend para las pruebas.

Adicionalmente, es conveniente generar un endpoint que permita limpiar la base de datos de pruebas, antes de realizar cada prueba. Esto se implementa generando un nuevo `controller` el cual responda solo cuando el ambiente utilizado sea el de pruebas:

```js
const resetRouter = require('express').Router()
const { User } = require('../models/user')
const Blog = require('../models/blog')

resetRouter.post('/', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = resetRouter
```

Luego, en `app.js` este endpoint se llama de forma condicional, solo cuando se use el ambiente `testing`:

```js
// ...

const loginRouter = require('./controllers/login')
const resetRouter = require('./controllers/reset')
const { requestLogger, unknownEndpoint, errorHandler, userExtractor } = require('./utils/middleware')

const app = express()

// ...
app.use('/api/users', usersRouter)
app.use('/api/blogs', userExtractor, blogsRouter)

if (process.env.NODE_ENV === 'testing') {
  app.use('/api/reset', resetRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)
// ...

```

#### Implementación de pruebas

---

Las pruebas como tal, serán definidas dentro del directorio `tests` y tendrán extensión `spec.js`. Por ejemplo para probar el acceso a la aplicación Notes:

```js
const { test, describe, expect } = require('@playwright/test')


describe('Note app', () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })
})

```

Para más ejemplos de tests realizados, se puede revisar el proyecto [`blogs-frontend`](https://github.com/gus25888/blogs-frontend/tree/main) en el directorio [`blogs-tests`](https://github.com/gus25888/blogs-frontend/tree/main/blogs-tests).

---

## Parte 6 - Gestión avanzada del estado - Uso de Redux

---

[Redux](https://redux.js.org/introduction/getting-started) es una librería que permite la gestión de estado de aplicaciones React de una forma más ordenada, basandose en los siguientes principios:

- __Estado Centralizado__: Se busca centralizar todos las variables de estado de una aplicación en repositorio único de una forma que sea predecible haciendo que sea sencillo seguir y depurar dónde y cuándo se realizó el cambio.

- __Inmutabilidad__: Para lograr que la aplicación sea predecible, se basa en el uso de variables inmutables para gestionar los estados. Esto se aplica haciendo que cada cambio a un objeto o a un array involucre copiar el mismo y luego asignarlo a la variable de estado correspondiente.

Se instala con el comando `npm install redux`

Para lograr que estos principios se cumplan se debe seguir unas reglas específicas y generar una forma consistente de definir cada variable de estado y su forma de ser actualizada, y además, hacer que esa actualización afecte a los componentes de la aplicación que corresponda. Esto se logra usando lo siguiente:

- __Acciones__ (Actions): Son objetos planos JS que contienen dos propiedades `type` y `payload`. Se pueden asociar con eventos que describen algo que ocurrió en la aplicación.

  - `type`: Corresponde a la descripción de la acción que se realizará lo que permitirá indicar *qué* es lo que está haciendo el cambio de la variable. Se definen normalmente con un texto en el formato `dominio o Categoria/nombreEvento`. Por ej. en una app que permite tener Listas de Actividades Pendientes (To Do's), un `type` sería el siguiente: `todos/todoAdded`.
  - `payload`: Corresponde al detalle de los valores que se asignarán a la variable de estado. Siguiendo el ejemplo anterior, el `payload` junto con el `type` sería el siguiente:

    ```js
    const addTodoAction = {
      type: 'todos/todoAdded',
      payload: 'Buy milk'
    }
    ```

- __Creadores de acciones__ (Action Creators): Son funciones que permiten "parametrizar" las acciones a crear al permitir enviar el payload y retornar la acción formateada. Ej.:

    ```js
    const addTodo = text => {
      return {
        type: 'todos/todoAdded',
        payload: text
      }
    }
    ```

  > __NOTA__: Se debe considerar que los `Creadores` deben quedar definidos en conjunto con los `Reductores`, es decir, en el __mismo archivo__.

- __Reductores__ (Reducers): Son funciones que reciben el `estado` de la aplicación y un objeto de `acción` y modifican el `estado` de la aplicación dependiendo de lo recibido. Por ejemplo:

  ```js
  const counterReducer = (state = 0, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return state + 1
      case 'DECREMENT':
        return state - 1
      case 'ZERO':
        return 0
      default: // if none of the above matches, code comes here
        return state
    }
  }
  ```

  Se basan en las reglas siguientes:

  - Solo hacen los cambios dependiendo del `estado` y la `acción` recibidos.
  - Solo deben hacer modificaciones a "copias" del `estado` recibido y luego esas deben usarse para actualizar el estado.
  - Siempre retornarán el `estado` actualizado.
  - Son funciones puras, que deben ser deterministas en su ejecución, es decir, para los mismos valores enviados siempre deben retornar el mismo resultado.

  > __IMPORTANTE__: Para organización de la estructura del código de la aplicación, quedarán guardados en un directorio llamado `reducers`.

- __Repositorio__ (Store): Es la sección centralizada en donde viven los estados de la aplicación. Son creados al usar la función `createStore` de Redux enviando como parámetro un `Reducer`:

  ```js
  import { createStore } from 'redux'

  const counterReducer = (state = 0, action) => {
    // ...
  }

  const store = createStore(counterReducer)
  ```

  Para poder obtener el Estado de la aplicación, se debe usar la función `getState()` y para poder modificarlo se usa la función `dispatch()`:

  ```js
  const store = createStore(counterReducer)
  console.log(store.getState()) // 0
  store.dispatch({ type: 'INCREMENT' })
  store.dispatch({ type: 'INCREMENT' })
  store.dispatch({ type: 'INCREMENT' })
  console.log(store.getState()) // 3
  store.dispatch({ type: 'ZERO' })
  store.dispatch({ type: 'DECREMENT' })
  console.log(store.getState()) // -1
  ```

  Además, existe la función `subscribe()`, que se utiliza para crear funciones callback que el store llama cuando cambia su estado.

  Así, por ejemplo, al añadir la siguiente función, todos los cambios en el store se imprimirían en la consola:

  ```js
  store.subscribe(() => {
    const storeNow = store.getState()
    console.log(storeNow)
  })
  ```

  El siguiente código imprimiría automáticamente cualquier cambio al state:

  ```js
  const store = createStore(counterReducer)

  store.subscribe(() => {
    const storeNow = store.getState()
    console.log(storeNow)
  })

  store.dispatch({ type: 'INCREMENT' })  // 1
  store.dispatch({ type: 'INCREMENT' }) // 2
  store.dispatch({ type: 'INCREMENT' }) // 3
  store.dispatch({ type: 'ZERO' }) // 0
  store.dispatch({ type: 'DECREMENT' }) // -1
  ```

> __IMPORTANTE__: Lo descrito anteriormente, en la actualidad no se define de esta manera ya que los desarrolladores de Redux, generaron RTK (Redux Toolkit), el cual realiza la definición de esta estructura de una forma más simplificada usando `configureStore()` en lugar de `createStore()`. Entonces el código anterior de definición, queda así:

```js
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: counterReducer })

console.log(store.getState()) // {value: 0}
```

Para más detalle, ver la sección Redux Toolkit

### Librerías asociadas a pruebas de Redux

---

Como parte de pruebas que se deban realizar dentro de una aplicación que use Redux, se recomienda usar la librería `jest`:

```sh
npm install --save-dev jest @babel/preset-env @babel/preset-react eslint-plugin-jest`
```

Luego, se debe generar un archivo `.babelrc`

```babelrc
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

Modificar el archivo `.eslint.config.js`:

```js
import jest from 'eslint-plugin-jest' //Agregar esta línea

export default [
    // ...
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.jest }, //Agregar esta línea
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      jest, //Agregar esta línea
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    // ...
]
```

y agregar el comando `jest` con el nombre `test` a los scripts del `package.json`.

También es relevante separar el reducer en un módulo independiente creado dentro del directorio `reducers`.

Adicionalmente, y con el objetivo de facilitar el poder mantener la inmutabilidad de los objetos de la aplicación, se debe instalar la librería [deep-freeze](https://www.npmjs.com/package/deep-freeze):

```sh
npm install --save-dev deep-freeze
```

Para detalles de las pruebas creadas se puede revisar el proyecto `reduxNotesApp` dentro de este repositorio.

### Formularios NO controlados

---

Se refieren a formularios creados sin asociarlos al state de la aplicación de forma directa.

Sus valores son enviados en conjunto con el submit del Form.

```jsx
const App = () => {
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value //Aquí se obtiene el valor del input identificado por "name".
    event.target.note.value = ''
    store.dispatch({
      type: 'NEW_NOTE',
      payload: {
        content,
        important: false,
        id: generateId()
      }
    })
  }

  const toggleImportance = (id) => {
    store.dispatch({
      type: 'TOGGLE_IMPORTANCE',
      payload: { id }
    })
  }
  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      <ul>
        {store.getState().map(note =>
          <li key={note.id} onClick={() => toggleImportance(note.id)}>
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        )}
      </ul>
    </div>
  )
}
```

Tienen la ventaja de que permiten una implementación más "sencilla" que los controlados ( que son los que están asociados a React por `useState()`), pero con ellos no es posible generar validaciones inmediatas en cada input o impedir que se active el botón de envío si no están los datos necesarios especificados.

### Compartir el "store" con los componentes de la aplicación (`React-redux`)

---

En Redux, el store, es un repositorio centralizado, por lo que es necesario darle acceso a todos los componentes que manejen algún valor de state para que pueden actualizarlo como estimen conveniente. Para ello existe la librería [*react-redux*](https://react-redux.js.org/introduction/getting-started) (`npm install react-redux`) que tiene varios *hooks* disponibles para hacer esta asociación.

Para poder usar los *hooks* se define que el `main.jsx` consistirá de un `Provider` el cual es el contenedor principal de la aplicación y que tiene en sus props el `store`, definido en el mismo módulo:

```jsx
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App from './App.jsx'
import noteReducer from '../reducers/noteReducer'

const store = createStore(noteReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider >
)
```

#### Hooks de react-redux: `useSelector`, `useDispatch`

---

`useDispatch()` o funciones dispatch: Proporciona acceso a cualquier componente de React a la función `dispatch` de redux-store definida en `main.jsx`. Esto permite que todos los componentes realicen cambios en el estado de Redux store.

```jsx
import { useSelector, useDispatch } from 'react-redux'

const App = () => {

  const dispatch = useDispatch()
  // ...

  const toggleImportance = (id) => {

    dispatch(toggleImportanceOf(id))
  }

  // ...
}
```

`useSelector()` o funciones de selector: Proporciona el acceso a cualquier componente a los datos almacenados dentro del store. Recibe una función como parámetro, la cual busca o selecciona datos del store de Redux.

```jsx
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  // ...

  const notes = useSelector((state) => {return state})
  // ...
}
```

En este ejemplo, se está la función enviada retorna el state completo. Sin embargo, normalmente, se debe retornar solo lo que realmente necesita el componente.

Con estos dos hooks, es posible realizar la modularización de la aplicación, dejando que cada componente maneje los datos del store que requiera y luego en el componente "App" solo se importan y utilizan.

### Manejo de estados complejos: uso de `combineReducers`

---

Dentro de una aplicación, es común tener que manejar varios valores de estado que se relacionan, de forma simúltanea, lo que involucra el uso de varios Reducers.

Para poder abordar esta situación está la función `combineReducers()`. Toma como parámetro, un objeto JS cuyas propiedades corresponderán a los valores del state, y los valores del objeto serán las funciones Reducer a utilizar. Retornará un nuevo reducer que responderá a los eventos de los Reducers enviados, pero como cada uno tiene condiciones distintas solo se activarán cuando estas se cumplan.

Se debe definir como parámetro para el `Provider`, por lo que se generará en donde se encuentre definido.

```jsx
import ReactDOM from 'react-dom/client'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import App from './App.jsx'
import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(reducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider >
)

```

Con esto el state definido contendrá dos propiedades, `notes` y `filter`, las cuales deben ser accedidas de esa manera dentro de cada componente. Por ej. el componente `Notes.jsx` quedará así:

```jsx
const Notes = () => {

  const dispatch = useDispatch()
  /*
    Aquí se extraen del state los valores de filter y notes para su uso directo
    y permitir filtrar las notas a mostrar dependiendo del filtro elegido.
  */
  const notes = useSelector(({ filter, notes }) => {
    if (filter === 'ALL') {
      return notes
    }

    return filter === 'IMPORTANT'
      ? notes.filter(note => note.important)
      : notes.filter(note => !note.important)
  })

  return (
    <ul>
      {notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => dispatch(toggleImportanceOf(note.id))}
        />
      )}
    </ul>
  )
}

```

### Redux Toolkit (RTK)

---

Es una librería que fue desarrollada por los mismos creadores de Redux, con el objetivo de simplificar el proceso de levantar el estado de la aplicación, que implica generar código repetitivo que sigue ciertos patrones para poder implementar las actions, reducers y la interacción con el state. Se instala con `npm install @reduxjs/toolkit`

#### configureStore

---

Permite crear el Store que contendrá el state de la aplicación y realiza la combinación de los Reducers de forma automática.
Esto se crea en un archivo independiente en `src/store.js`, importando los reducers a utilizar.

```jsx
import { configureStore } from '@reduxjs/toolkit'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})

export default store
```

Luego, se importa en `main.jsx`:

```jsx
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import App from './App'
import store from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider >
)
```

#### createSlice

---

Permite la creación de los Action Creators y los Reducers de una sola vez

```js

import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  {
    content: 'reducer defines how redux store works',
    important: true,
    id: 1,
  },
  {
    content: 'state of store can contain any data',
    important: false,
    id: 2,
  },
]

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    createNote(state, action) {
      const content = action.payload
      state.push({
        content,
        important: false,
        id: generateId(),
      })
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find(n => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
      return state.map(note =>
        note.id !== id ? note : changedNote
      )
    }
  },
})

export const { createNote, toggleImportanceOf } = noteSlice.actions
export default noteSlice.reducer

```

Se le envía un objeto en que se indica:

- *name*: nombre para poder identificar el reducer creado (`noteSlice.reducer`).
- *initialState*: Estado Inicial de la aplicación (`initialState`)
- *reducers*: los cuales se definen como un objeto en que se envía cada función de Action Creator (`createNote` y `toggleImportanceOf`), de lo cual la función `createSlice` se encarga de implementar automáticamente.

> __IMPORTANTE__: Además, es necesario notar que con el uso de `createSlice`, es posible realizar mutaciones directamente en el state, ya que RTK utiliza la librería [Immer](https://immerjs.github.io/immer/) que se encarga de generar una plantilla de la definición de un objeto, llevar los cambios realizados al mismo, y luego retornar una nueva instancia del objeto original con los cambios aplicados, lo cual permite realizar cambios de forma directa asegurando obtener un objeto inmutable cada vez.

##### Consideraciones con console.log con RTK

---

Considerando el uso de Immer, es necesario hacer una adecuación del state si es necesario mostrarlo por consola. Para ello, se debe usar la función `current` de RTK para poder obtener el estado actual del state.

```js
import { createSlice, current } from '@reduxjs/toolkit'
// ...
console.log(current(state))
```

#### Manejo de datos externos usando RTK

---

##### Obtención de datos

---

Para ello, se debe considerar la creación de un `service` que maneje las métodos HTTP que se implementen, usando los métodos ya vistos para ello usando la librería `axios`.

Luego, se debe generar un nuevo Creador de Acción, que permita "inicializar" los datos de la aplicación:

```js
// ...
const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    setNotes(state, action) {
      return action.payload
    }
  }
})

// ...
```

Luego, este Creador se debe usar dentro de `App.jsx` para obtener los datos y enviarlos al state:

```jsx
import { useEffect } from "react"
import { useDispatch } from "react-redux"
// ...
import noteService from "./services/notes"
import { setNotes } from "./reducers/noteReducer"


const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {

    noteService
      .getAll()
      .then((notes) => {
        dispatch(setNotes(notes))
      })
  }, [])

  return (
    </div>
    // ...
    </div>
  )
}

export default App
```

Se debe considerar que con este método soporta solo funciones síncronas, (no funciona el `async/await`). Para poder invocar funciones asíncronas, se debe usar Redux Thunk.

##### Creación de datos

---

Para la creación de datos, se debe realizar el llamado a la función de creación definida dentro del módulo que usa axios, dentro del componente que realizará la creación del registro, que normalmente será un Form.

```jsx
import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/noteReducer'

import noteService from '../services/notes'

const NewNote = (props) => {
  const dispatch = useDispatch()


  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''

    // Aquí se llama a la función que crea el registro en el backend.
    const newNote = await noteService.createNew(content)

    // El resultado se envía al store, con dispatch y llamando al Action Creator adecuado.
    dispatch(createNote(newNote))
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NewNote
```

##### Actualización y borrado de datos

---

Una lógica similar se debe implementar para la actualización o el borrado de datos, es decir, generar una función dentro del componente que realizará la acción correspondiente y generar una función que haga uso de la funcionalidad generada para la comunicación con el backend. Luego, el resultado de la llamada al backend, se envía al Creador de Acción correspondiente.

#### Redux Thunk, para uso de funciones asíncronas con RTK

---

El enfoque anterior no es el adecuado ya que requiere que las funciones estén embebidas en los componentes, lo cual no es una buena práctica. Por ello, y además, por el impedimento del uso de funciones asíncronas, se usa Redux Thunk.

Esto permite hacer uso de funciones asíncronas dentro de la lógica de Creadores de Acción y, en general, dentro de la gestión de los datos de la store.

Esto viene incluido de forma automática al usar la función `configureStore()` de RTK.

En el contexto de esta librería, *thunk* es una función que envuelve una expresión para demorar su evaluación, por ej:

```js
// calculation of 1 + 2 is immediate
// x === 3
let x = 1 + 2

// calculation of 1 + 2 is delayed
// foo can be called later to perform the calculation
// foo is a thunk!
let foo = () => 1 + 2
```

Lo que permite Redux Thunk, (que es un middleware agregado a RTK) es hacer que los Creadores de Acción retornen una función (asíncrona) en lugar de un objeto.
Los parámetros a enviar corresponden a los métodos de `dispatch` y `getState` de Redux.

Por ejemplo, para obtener los datos al iniciar la aplicación se puede generar una función que haga esa tarea dentro del archivo del Reducer, de forma separada de la generación del mismo:

```jsx
import { createSlice } from "@reduxjs/toolkit"
import noteService from '../services/notes'

const noteSlice = createSlice( {
  // ...
} )

// Funciones asíncronas retornadas para manejar la obtención, creación y actualización de datos:
export const initializeNotes = () => {
  return async (dispatch) => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

export const createNote = (content) => {
  return async (dispatch) => {
    const newNote = await noteService.createNew(content)
    dispatch(appendNote(newNote))
  }
}

export const updateNote = (note) => {
  return async (dispatch) => {
    const noteUpdated = await noteService.updateData(note, note.id)
    dispatch(toggleImportanceOf(noteUpdated))
  }
}

export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions
export default noteSlice.reducer
```

> __IMPORTANTE__: Considerar que cada función en sí, es síncrona y __RETORNA__ una función asíncrona.

Luego, se invoca cada función generada en el reducer, se utiliza donde corresponde usando dispatch para enviar su resultado al store. Por ej. en `App.jsx` para obtener los datos de la app, se hace dispatch del resultado de la función `initializeNotes()`:

```jsx
// ...
import { initializeNotes } from "./reducers/noteReducer"


const App = () => {
  const dispatch = useDispatch()

  useEffect(() => { dispatch(initializeNotes()) }, [])

  return (
    <div>
      <NewNote />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}
```

### React Query (o llamada actualmente TanStack Query)

---

Se instala con el comando `npm install @tanstack/react-query`

Es una [librería](https://tanstack.com/query/latest) enfocada en gestionar el *estado del servidor*, a través de una implementación simple de operaciones asícronas. Se puede pensar que permite generar un caché de los datos del servidor en el frontend.

No se debe considerar como una alternativa a Redux, sino que como un *complemento* a ella, ya que Redux permite el manejo más sencillo de estados propios del frontend como la gestión de los datos de los formularios. Se considera que son librerías de gestión del *estado del cliente*.

A pesar de que Redux, se puede usar para gestiones de datos asíncronos, es más complejo que con React Query.

Para más detalles, se puede ver [este link](https://tanstack.com/query/latest/docs/framework/react/guides/does-this-replace-client-state)

#### Implementación de React Query

---

Luego, de su instalación y teniendo un módulo que pueda manejar en sendas funciones los diferentes métodos HTTP (GET, POST, etc.), se debe proceder primero disponer de dos funciones necesarias en `main.jsx`: `QueryClient` y `QueryClientProvider`.

```jsx
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```

Luego, en `app.jsx` se debe utilizar dos funciones principales:

- `useQuery()`: Permite indicar un "origen de datos" (operación GET) indicando su nombre identificador, y la función que permite obtener los datos, con las propiedades `queryKey` y `queryFn`.

  Es importante notar que esta función como es asíncrona por defecto, posee la capacidad de realizar consultas por el estado de la obtención de datos, asociados a la variable a la que fue asignada. Por tanto al consultar a las siguientes propiedades se obtendrán distintos resultados:

  - `isPending` or `status === 'pending'` - La "query" no tiene datos aún
  - `isError` or `status === 'error'` - La "query" tuvo un error
  - `isSuccess` or `status === 'success'` - La "query" fue exitosa y hay datos disponibles

  Con ello, se pueden generar condiciones para impedir que la aplicación se renderice con los datos, y hacer que muestre información distinta acorde a la situación: Mostrar un mensaje de error si no se encontraron datos, por ejemplo.

- `useMutation()`: Permite definir una función para poder realizar las gestiones del "origen de datos" creado con `useQuery()`. Se le debe enviar la función que realiza la modificación de los datos (creación, borrado o actualización) en la propiedad `mutationFn` y además, generar una función para el parámetro `onSuccess` que permita definir qué se hará después de realizada la acción definida en mutationFn.

- `useQueryClient()`: Permite gestionar los datos ya obtenidos con `useQuery()` y que se encuentran en el frontend.

```jsx

const App = () => {
  const queryClient = useQueryClient()
  // ...
  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      // Esto actualiza el estado de los datos directamente en el frontend sin pedirlos al servidor.
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.concat(newNote))
    }
  })

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      // Esto genera una nueva obtención de datos haciendo una solicitud GET
      queryClient.invalidateQueries('notes')
    },
  })

  // ...

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes
  })
  // ...
}
```

Para más detalles revisar el archivo `App.jsx` dentro del directorio `query-notes` dentro de este proyecto.

### `useReducer`, para el manejo de estados internos con React Query

---

`useReducer()` es una de las utilidades de React base, que permite implementar reducers para el manejo de estado. Se recomienda que sean usados cuando alguna variable de estado, es modificada de varias formas distintas (3 o más) y funciona de forma muy similar a los implementados con Redux: se genera una función que recibe state y action, en donde el primero contiene los valores del estado y el segundo indica el tipo de modificación y valores a aplicar a la misma.

```jsx

import { useReducer } from 'react'

const counterReducer = (state, action) => {
  switch (action.type) {
    case "INC":
        return state + 1
    case "DEC":
        return state - 1
    case "ZERO":
        return 0
    default:
        return state
  }
}

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <div>
      <div>{counter}</div>
      <div>
        <button onClick={() => counterDispatch({ type: "INC"})}>+</button>
        <button onClick={() => counterDispatch({ type: "DEC"})}>-</button>
        <button onClick={() => counterDispatch({ type: "ZERO"})}>0</button>
      </div>
    </div>
  )
}

export default App

```

Para poder integrar el reducer creado, se usa `useReducer()`, enviando el Reducer y el valor inicial de la variable asociada al state creado. Retorna dos cosas: la variable asociada al `state` y el `dispatch`, que es la función que permite enviar los cambios a realizar a la variable en cuestión.

Al igual que los reducers ya vistos, al usar el `dispatch`, se requiere que se envien dos variables: el `state` actual y la `action` a aplicar. Esta última contendrá el valor a aplicar (`payload`) y el tipo de modificación a aplicar (`type`).

#### Usando `context` para evitar el "prop drilling"

---

La idea de usar Reducers es poder modularizar la aplicación, dejando en archivos separados el reducer de los componentes que lo utilicen. En caso de que se requiera que el state sea usado por un componente, debe venir como parte de sus props. Esto implica que todos los componentes que lo contengan, tendrían potencial acceso a la variable del state, lo cual no es deseable ya que no tienen la necesidad de ello. Esta situación se conoce como *prop drilling*.

Para evitarlo en React, existen los `contexts`, que corresponden a un tipo de estado global de la aplicación, al que cualquier componente hijo puede tener acceso al definir un state en su padre común sin importar qué tan larga sea la cadena de "herencia".

```jsx
import { createContext } from 'react'

const CounterContext = createContext()

export default CounterContext
```

Luego, en el componente padre (para el ejemplo, será App), se hace uso del context creado y se le envían las variables que se disponibilizarán:

```jsx
import CounterContext from './CounterContext'

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <CounterContext.Provider value={[counter, counterDispatch]}>
      <Display />
      <div>
        <Button type='INC' label='+' />
        <Button type='DEC' label='-' />
        <Button type='ZERO' label='0' />
      </div>
    </CounterContext.Provider>
  )
}
```

Luego, en el componente correspondiente se llaman con `useContext()`:

```jsx
import { useContext } from "react"
import CounterContext from "../CounterContext"

export const Button = ({ type, label }) => {
  // Se debe considerar que los valores vienen desde un array, por lo que vienen en orden.
  // Aquí por ej. dispatch es el segundo valor en el array, por lo que se desestructura solo ese valor.
  const [, dispatch] = useContext(CounterContext)

  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}
```

Idealmente, el módulo en que se defina el context debería tener la definición de los estados también. Esto con el objetivo de centralizar las definiciones de estado en donde se van a disponibilizar.

Con ello, es posible realizar las integración del context desde el `main.jsx`.

Para más detalles ver el directorio `hook-counter`

---

## Parte 7 - React router, custom hooks, estilando la aplicación con CSS y webpack

---

### React Router

---

Librería que permite la administración de la navegación en una aplicación React.

Se instalan con el comando:

```sh
npm install react-router-dom
```

Para su funcionamiento, la librería se sirve de la API History de HTML5 nativa de los navegadores actuales. Más detalles [aquí](https://css-tricks.com/using-the-html5-history-api/).

```jsx

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom"


// ...

const App = () => {

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/users">users</Link>
      </div>

      <Routes>
        <Route path="/notes" element={<Notes />} />
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <div>
        <i>Note app, Department of Computer Science 2024</i>
      </div>
    </Router>
  )
}

export default App

```

En el ejemplo anterior, se hace uso de `BrowserRouter` que permite generar la definición de las "rutas" de acceso de la aplicación, dentro de la etiqueta `Routes`. Cada `Route` se asocia a un `path` el cual determina el origen al que responderá y luego que `Element` se mostrará al acceder a el.

El elemento `Link` permite definir los path que tendrá la aplicación y a los cuales responderán las Routes. Son elementos "a href" pero con más capacidades de configuración y personalización.

#### Funciones relevantes dentro de React Router

---

Todas estas funciones se importan desde `react-router-dom`, al igual que en el ejemplo mostrado.

- `useParams`: Hook personalizado que permite tener acceso a todos los params recibidos desde una URL en un formato clave-valor.

```jsx

const Note = ({ notes }) => {
  // Aquí se obtiene el id de la ruta /notes/:id
  const id = useParams().id
  const note = notes.find(n => n.id === Number(id))
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}
```

- `useNavigate`: Hook personalizado que permite navegar en las rutas de la aplicación, de forma personalizada en respuesta a interacciones del usuario.

```jsx
const Login = (props) => {
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('mluukkai')

    /*
      En este punto, al recibir las credenciales del usuario mluukkai,
      se ingresa al home de la aplicación.
*/
    navigate('/')
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          username: <input />
        </div>
        <div>
          password: <input type='password' />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}
```

- `Navigate`: Componente que permite implementar un comportamiento similar a `useNavigate()`, es decir, redireccionar a una ruta dependiendo de la interacción del usuario. Sin embargo, la documentación recomienda NO usarla y preferir `useNavigate()`

```jsx
/*
  En este caso la Route /users está definida condicionalmente:
  Si se intenta acceder sin sesión (definida por la variable user)
  se redirigirá a la Route de login.
*/
  <Routes>
    <Route path="/notes/:id" element={<Note note={note} />} />
    <Route path="/notes" element={<Notes notes={notes} />} />
    <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
    <Route path="/login" element={<Login onLogin={login} />} />
    <Route path="/" element={<Home />} />
  </Routes>

```

- `useMatch`: Hook personalizado que permite obtener valores de una URL especifica (la enviada como parámetro a la función) y que responderá cuando se acceda a la ruta enviada.

```jsx
const App = () => {

  const [notes, setNotes] = useState([
    // ...
  ])


  const [user, setUser] = useState(null)

  /*
    En este ejemplo, se obtendrán datos de la URL específica
    que obtiene una sola nota. Se usa el id obtenido desde ahí
    para poder buscar y obtener esa única nota buscada.
*/
  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(note => note.id === Number(match.params.id))
    : null

  const login = (user) => {
    setUser(user)
  }
    // ...
  return (
    <div>
    // ...
    </div>
  )
}
```

Para más detalles revisar el directorio notesAppRouter.

### Hooks Personalizados

---

Una de las grandes ventajas de la especificación de Hooks es la capacidad de poder crear los propios, permitiendo definir "comportamientos" dentro del código, "ocultando" los detalles de cómo se hacen las modificaciones de los datos para visibilizar mejor qué es lo que hacen esos comportamientos.

Para definirlos, se requiere implementar una función cuyo nombre inicie con "use" y que se haga uso de algunos de los Hooks ya definidos por React (useState, useEffect, etc.).

Se debe considerar que NO pueden ser definidos dentro de Ciclos, Condicionales o en Funciones Anidadas.

Además, es posible definirlos de forma independiente en módulos, para aprovecharlos en diferentes lugares de la aplicación.

```jsx
const useCounter = () => {
  const [value, setValue] = useState(0)

  const increase = () => { setValue(value + 1) }
  const decrease = () => { setValue(value - 1) }
  const zero = () => { setValue(0) }

  return {
    value,
    increase,
    decrease,
    zero,
  }
}
```

Para usarlos, luego, se deben importar en el componente que lo requiera:

```jsx
import useCounter from '../hooks/useCounter'

const CounterLR = () => {
  const left = useCounter()
  const right = useCounter()

  return (
    <div>

      <button onClick={left.increase}>
        left | {left.value}
      </button>
      <button onClick={right.increase}>
        right | {right.value}
      </button>

    </div>
  )
}

```

En este caso, por ej. se muestra que el Hook puede ser utilizado más de una vez, ya que mantiene la misma independencia que los Hooks normales.

Para más detalles revisar el directorio custom-hooks-counter.

### Librerías para la integración de estilos CSS en React

---

Existen muchas librerías que permiten realizar estas tareas, por lo que se ha enfocado en las dos más populares, *Bootstrap* y *Material UI*. También se menciona una adicional llamada *styled-components* que tiene un enfoque distinto, al basarse en las [plantillas literales etiquetadas](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Template_literals#plantillas_etiquetadas) para agregar CSS a la aplicación.

#### React Bootstrap

---

Se instala con el comando `npm install react-bootstrap`.

Para implementarse, primero debe agregarse el archivo CSS que contiene todas las reglas definidas para el estilo Bootstrap. Esto se agrega en el archivo `index.html` ubicado en la raíz del proyecto:

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />


  <!-- Agregar esta línea -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous" />



  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vite + React</title>
</head>

<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>

</html>

```

Este archivo se encuentra alojado en un CDN, lo cual permite evitar tener inconsistencias de versiones y además de evitar tener que manejar un CDN propio.

Luego, se debe agregar la clase `container` al div generado para alojar el contenido de la aplicación, ubicado dentro de `App.jsx`:

```jsx
const App = () => {
  // ...

  return (
    <div className='container'> /* Agregar className container */
      <Notification message={message} />
      <Menu user={user} />

      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />
        <Route path="/notes" element={<Notes notes={notes} />} />
        <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <footer>
        <br />
        <em>Note app, Department of Computer Science 2024</em>
      </footer>
    </div>
  )
}
```

Luego, se debe importar el componente CSS de Bootstrap que se ha adaptado para ser un componente React, en el módulo a implementar. Por ej.: este componente para generar las Notificaciones de la aplicación.

```jsx
import Alert from 'react-bootstrap/Alert'

const Notification = ({ message }) => (
  <div>
    {
      (message && <Alert variant='success'>{message}</Alert>)
    }
  </div>
)
```

Cosas a notar:

- Se recomienda importar el componente especifico a utilizar en el módulo, en lugar de importar la librería completa (`import {Alert} from 'react-bootstrap'`), ya que genera una menor carga en el archivo a enviar al cliente.
- Cada componente Bootstrap tiene diferentes atributos (`variant`) que permiten implementar aspectos distintos al componente, dependiendo del valor que se les asigne.

Para más ejemplos, se pueden revisar los componentes creados en `notesAppRouter\src\bootstrap-components`.

Para más detalles, se encuentra la [documentación](https://react-bootstrap.github.io/docs/getting-started/introduction) de la librería, la cual contiene el detalle de los componentes que existen y como se usan.

#### Material UI

---

Se instala con el comando `npm install @mui/material @emotion/react @emotion/styled`.

Para usarlo, se debe modificar el div contenedor de `App.jsx` al componente `Container`:

```jsx
const App = () => {
  // ...

  return (
    <Container>
      <Notification message={message} />
      <Menu user={user} />

      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />
        <Route path="/notes" element={<Notes notes={notes} />} />
        <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <footer>
        <br />
        <em>Note app, Department of Computer Science 2024</em>
      </footer>
    </Container>
  )
}
```

Luego, se debe importar el componente CSS de Material UI que se ha adaptado para ser un componente React, en el módulo a implementar. Por ej.: este componente para generar las Notificaciones de la aplicación.

```jsx
import Alert from '@mui/material/Alert'

const Notification = ({ message }) => (
  <div>
    {
      (message && <Alert severity='success'>{message}</Alert>)
    }
  </div>
)
```

Cosas a notar:

- A diferencia de Bootstrap, no es necesario importar el archivo CSS en `index.html`
- Se debe importar el componente especifico a utilizar en el módulo: `import Alert from '@mui/material/Alert'`
- Cada componente de Material UI, tiene diferentes atributos (`severity`) que permiten implementar aspectos distintos al componente, dependiendo del valor que se les asigne.

Para más ejemplos, se pueden revisar los componentes creados en `notesAppRouter\src\material_ui-components`.

Para más detalles, se encuentra la [documentación](https://mui.com/material-ui/getting-started/) de la librería, la cual contiene el detalle de los componentes que existen y como se usan.

#### Styled-Components

---

Se instala con el comando `npm install styled-components`.

Para usarlo, se debe generar un archivo JS con objetos que contengan las definiciones de CSS en formato de texto plano, usando la referencia a la función `styled` de `styled-components`:

```js
import styled from 'styled-components'

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

const Input = styled.input`
  margin: 0.25em;
`

const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`

const Navigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`

const Footer = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`

export {
  Button,
  Input,
  Page,
  Navigation,
  Footer,
}
```

Luego, estas variables de tipo Componente, se usan en el componente correspondiente. Por ej.:

```jsx
const App = () => {
  // ...
  return (
    <Page>
      <Notification message={message} />
      <Menu user={user} />
      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />
        <Route path="/notes" element={<Notes notes={notes} />} />
        <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer>
        <em>Note app, Department of Computer Science 2022</em>
      </Footer>
    </Page>
  )
}


// ...

import { Link } from "react-router-dom"
import { Navigation } from "./styles"

const Menu = ({ user }) => {
  const padding = {
    padding: 5
  }
  return (
    <Navigation>
      <Link style={padding} to="/">home</Link>
      <Link style={padding} to="/notes">notes</Link>
      <Link style={padding} to="/users">users</Link>
      {user
        ? <em>{user} logged in</em>
        : <Link style={padding} to="/login">login</Link>
      }
    </Navigation>
  )
}

export default Menu
```

Cosas a notar:

- A diferencia de Bootstrap, no es necesario importar el archivo CSS en `index.html`
- Cada componente se genera basado en etiquetas HTML directas.

Para más ejemplos, se pueden revisar los componentes creados en `notesAppRouter\src\styled_components-components`.

Para más detalles, se encuentra la [documentación](https://styled-components.com/docs/basics#getting-started) de la librería, la cual contiene el detalle de los componentes que existen y como se usan.

### Webpack

---

Se debe instalar con el comando `npm install --save-dev webpack webpack-cli`.

Para más detalles, se puede revisar su [documentación](https://webpack.js.org/api/)

Para ejemplo, se puede revisar el directorio `bundle-example`.

Especificamente, se debe revisar los archivos `webpack.config.js`, que contiene detalles de la config. necesaria para poder hacer el bundle de la aplicación.

También es importante considerar que se debe generar un script en `package.json`, llamado `build` que aplique el comando `webpack --mode=production` para poder aplicar lo definido en el config.

Otro script a generar es `start` con el comando `webpack serve --mode=development`, lo que permite generar builds de forma automática en memoria para poder recargar la aplicación mientras se encuentran realizando modificaciones a la misma durante el desarrollo. Estas builds no quedan registradas en el directorio registrado de salida de la build.

#### Descripción de configuración de webpack

---

La configuración se define en el archivo `webpack.config.js` en la raíz del proyecto. Dentro es posible definirla como un objeto, que es lo que se hace normalmente para una nueva aplicación.

Sin embargo, al usar una función es posible utilizar ciertas características específicas en la configuración de webpack, como por ejemplo, diferenciar entre ambientes de desarrollo y productivos.

##### Parámetros de entrada de función config (webpack)

---

Esta función denominada `config` puede recibir dos parámetros:

- __env__: Objeto que contiene las variables de entorno de webpack, los cuales son enviados en conjunto con el comando que invoca a webpack, asociado al flag `--env`. Por ejemplo, el siguiente código asigna el NODE_ENV, al invocar a webpack.

```sh
npx webpack --config-node-env production   # process.env.NODE_ENV = 'production'
```

- __argv__: Objeto que contiene argumentos (flags) que tiene definido webpack. Especificamente, la propiedad `mode`, permite indicar el tipo de ambiente en que se generará el build de la aplicación.

##### Salida de función config (webpack)

---
Esta función debe retornar un objeto con los parámetros necesarios para poder realizar la build. Se describen cada una de las propiedades del objeto obtenido desde la función:

- __entry__: Define el "punto de entrada" de la aplicación. Desde aquí, webpack genera un árbol de dependencias de todos los módulos involucrados en el funcionamiento del código de la aplicación y que serán agrupados en el archivo resultado del proceso de Bundle.

- __output__: Define la ubicación del código resultante del proceso de Bundle. Debe ser definido como una ruta ABSOLUTA, por lo que se usar path.resolve de Node para generarlo desde una ubicación relativa. `__dirname` corresponde al directorio en que se ubica este archivo.

- __module__: Define los "loaders" que se utilizarán en el proceso de Bundle. Esto permite indicar a webpack qué archivos necesitan ser preprocesados y cómo deben serlo, antes de poder incluirlos en el archivo final.
  Cada loader está definido en el array de "rules". Se compone de las propiedades:
  - __test__: indica a qué tipo de archivos se aplica.
  - __loader__: indica qué librería hará el procesamiento de esos archivos. Deben incluirse en el proyecto, según corresponda.
  - __option__: indica qué parámetros se usarán en el "loader".
    - *presets*: corresponde a los plugins usados como parte del loader. En este caso, son los necesarios para poder transpilar jsx a js versión ES5, que es la versión base soportada por todos los navegadores modernos.
  - __use__: indica qué otros loaders se usarán para generar archivos válidos para el bundle final. Estos archivos serán incluidos en conjunto con main.js que se generará por el bundle.

- __devServer__: Contiene el objeto que permite definir los parámetros para el proceso de generación del bundle mientras se encuentra en desarrollo. Esto generará un bundle dinámico, similar al `npm run dev` de una aplicación hecha con vite.

- __devtool__: Contiene el valor (`'source-map'`) que permite indicar si se generará una asociación entre el bundle y el archivo original del código fuente, en caso de necesitar revisar la línea específica de código en que ocurre un error. Esto se conoce como *Source Maps*. En caso de tener levantada la aplicación con el script `start`, es necesario realizar un reinicio de webpack para que tome efecto esta propiedad.

- __plugins__: Contiene la definición de un array que contendrá el listado de las configuraciones de plugins necesarios para implementar comportamientos personalizados en la configuración de Webpack.

#### Minificación del código

---

Considerando que el proceso de bundle toma todas las dependencias de la aplicación, incluyendo lo que viene en node_modules, ocurrirá que el archivo js resultante, se vuelva muy pesado, lo cual puede no es conveniente para la aplicación funcionando de forma productiva.

Es por ello que webpack implementa un minificador para poder quitar todos los comentarios del código, y cambiar los nombres de las variables a una sola letra, con el objetivo de hacer lo más pequeño posible el archivo resultante.

Para lograrlo, se debe modificar la opción usada en el comando `webpack serve --mode=development` para que sea `production` en lugar de `development`.

#### Configuración para variables de entorno de distintos ambientes

---

Para poder definir variables de entorno que tengan en cuenta uso de valores distintos entre `development` y `production`, se debe usar dentro de la configuración de webpack un plugin definido dentro del mismo webpack, llamado `webpack.DefinePlugin`. Dentro se configuran los nombres de las variables que tendrán valores distintos dependiendo del ambiente.

> IMPORTANTE: Se debe considerar que los valores a usar en cada variable, son determinados durante la compilación y son interpretados de forma literal. Esto implica que si se requiere, por ej. que el valor sea un string, se debe indicar los caracteres de comillas para que sean agregados. Otra forma es usar la función `JSON.stringify()` para asegurar que la variable tenga el valor formateado correctamente.

#### Instalaciones necesarias para generar una aplicación React desde cero, y poder generar el bundle con Webpack

---

```sh
# Librería React
npm install react react-dom
#Para poder hacer uso de funciones async
npm install core-js regenerator-runtime
# Para poder hacer el bundle de la aplicación
npm install --save-dev webpack webpack-cli
#Para poder hacer bundle de archivos jsx. Además, poder transpilarlo a ES5.
npm install --save-dev @babel/core babel-loader @babel/preset-react @babel/preset-env
#Para poder generar el css de la aplicación y poder incluirlo en el archivo main.js.
npm install --save-dev style-loader css-loader
#Para poder generar builds de la aplicación de forma automática cuando estamos en modo desarrollo.
npm install --save-dev webpack-dev-server
```

### Polyfills

---

Son funcionalidades (librerías normalmente) que permiten "parchar" comportamientos no disponibles en navegadores antiguos para poder utilizar código más reciente en ellos.

Como la definición es muy amplia, dependerá mucho de la funcionalidad que se quiera suplir el Polyfill que se requerirá.

Uno de los más completos es el de Babel, llamado [Babel/Polyfill](https://babeljs.io/docs/babel-polyfill/)

También está el que permite usar Promesas en Internet Explorer, llamado [Promise-Polyfill](https://www.npmjs.com/package/promise-polyfill)

En caso de necesitar consultar por Polyfills existentes, se puede consultar [aqui](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills)

Para poder validar si alguna caracteristica de JS es soportada por el navegador, se puede consultar [caniuse.com](https://caniuse.com/)

### Uso de clases en React

---

Esta es la forma en que se desarrollaba con React para las versiones anteriores a 16.8, __NO ES RECOMENDADO GENERAR NUEVOS APLICACIONES EN REACT USANDO ESTA FORMA__, a pesar de que es soportado en versiones modernas y NO se tiene planes de dejarlo obsoleto.

Consiste en la definición de componentes basado en la herencia desde `React.Component`.

Se define una nueva clase en que se define un constructor sencillo, que llama a `super(props)` para poder enviar las props y se define un `state` que es un estado único para el componente. El state es un objeto JS cuyas propiedades corresponderán a los distintos estados definidos con `useState()` usando la forma moderna.

Para poder manejar las interacciones con los estados, existen las siguientes funciones, que deben definirse como métodos de la clase. Son denominadas __métodos de ciclo de vida del componente__.

- `render()`: Es el único método requerido en una clase Componente de React. Cuando se invoca, debería examinar los valores de `this.props` y `this.state` y debería retornar un Componente React; múltiples Componentes o Fragmentos en un Array; Números o Strings, que se renderizan como nodos de textos en el DOM; o Booleanos, *null* o *undefined*, que permiten omitir el renderizado del componente. `render()` debe ser una función pura, es decir, NO modifica el state y retorna lo mismo con cada invocación.

- `constructor()`: Este método es llamado antes de que se agregue el componente al DOM de la página. Se utiliza para permitir inicializar el state del componente con el objeto que contendrá cada variable del mismo. Solo aquí se puede usar `this.state` directamente, en los otros métodos debe usarse `this.setState()`. Además, se usa para poder asociar los "manejadores de eventos" a la instancia del componente. Dentro se debe invocar a `super(props)` en la primera línea.

- `componentDidMount()`: Método invocado cuando se agrega el componente al DOM de la página, es decir, en el primer render del componente. En este punto se deberían definir las inicializaciones necesarias de datos o de conexiones a BD.
- `componentDidUpdate()`: Método invocado cuando se realiza una modificación en el componente. Es aquí donde se debe realizar la obtención de datos y las actualizaciones del state. Es en este punto que se deben realizar comparaciones de las props existentes con las anteriores, para validar si es necesario la obtención de datos externos. Para manipular el state, se debe usar `this.setState()`.

- `componentWillUnmount()`: Método invocado cuando se elimina el componente del DOM de la página. Este método se usa para limpiar los cambios realizar como parte del método `componentDidMount` como por ejemplo, realizar la desconexión de la BD. Si este método se invoca significa que el componente no se renderizará más, por lo que cualquier llamado a `setState()` podría no tener los resultados esperados.

Para un ejemplo, se puede revisar el componente `App` dentro del directorio anecdotes-react-classes

## Parte 8 - GraphQL

> NOTA: Para la revisión de la implementación completa, se debe revisar los directorios phonebook-be-graphql y phonebook-fe-graphql.

GraphQL consiste en una forma distinta de obtener información desde un backend. A diferencia de REST, lo que se indica en una petición GraphQL es los datos que se requieren obtener basado en la definición de Esquema y Consultas definida. Siempre se envía una petición POST, con un JSON que indique las claves de los datos que se desean obtener siguiendo la jerarquía definida por el Esquema.

Por ej.:

```json
/* Datos de Request */
query FetchBlogsQuery {
  user(username: "mluukkai") {
    followedUsers {
      blogs {
        comments {
          user {
            blogs {
              title
            }
          }
        }
      }
    }
  }
}

/* Datos de Response */
{
  "data": {
    "followedUsers": [
      {
        "blogs": [
          {
            "comments": [
              {
                "user": {
                  "blogs": [
                    {
                      "title": "Goto considered harmful"
                    },
                    {
                      "title": "End to End Testing with Cypress is most enjoyable"
                    },
                    {
                      "title": "Navigating your transition to GraphQL"
                    },
                    {
                      "title": "From REST to GraphQL"
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Esquemas

Consiste en la definición de los nombres de las claves y los tipos de datos que tendrá cada una.

```js
type Person {
  name: String!
  phone: String
  street: String!
  city: String!
  id: ID!
}
```

Los tipos de datos que existen son:

- __Int__: Entero de 32-bits
- __Float__: un valor decimal.
- __String__: Secuencia de caracteres UTF‐8 .
- __Boolean__: true o false.
- __ID__: Identificador único generado por el motor de GraphQL, sin embargo, es un String al final.

Estos tipos básicos se llaman __escalares__. Existen también los tipos "custom" que son tipos generados basados en los otros, como por ejemplo, crear un tipo Date.

### Modificadores de Tipo

Desde los tipos se pueden generar derivados de los mismos, que cambian el formato que tendrán los datos.

- __Listas__: Denotadas con corchetes (`[]`) indican que el resultado a obtener es una lista de valores.
- __Not Null__: Denotadas con un signo de exclamación (`!`) indican que el dato al que acompañan no puede ser igual a NULL.
- __Enums__: Denotadas con llaves (`{}`), indican un conjunto de valores que delimitan los posibles a asignar a una variable.

### Consultas

Las consultas (querys) determinan las "operaciones" que se podrán realizar al endpoint definido, es decir, qué datos se podrán obtener al consultar al endpoint. Cada una de ellas se asocia a un `resolver` (ver más adelante).

```js
type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

### apollo-server

Es el package más popular para poder implementar un servidor de GraphQL en Node.

```sh
# Se instala la versión 4 que es la actual, las anteriores ya fueron deprecadas
npm install @apollo/server graphql

# Versión anterior y ya deprecada
# npm install apollo-server graphql
```

### Implementación de servidor de Graph QL

Para implementarlo, se debe definir los `typeDefs` (Esquemas) y los `resolvers` (Querys). Estas ultimas consisten en funciones que rellenan los valores de un campo definido en el esquema.

El `ApolloServer` se crea usando tanto los typeDefs como los resolvers. Luego, se procede a levantar el servidor en modo stand-alone.

```js
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]

const typeDefs = `#graphql
  type Person {
    name: String!
    phone: String
    street: String!
    city: String!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`
// En este punto, el parámetro args, contiene los parámetros enviados a la consulta.
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
```

### Petición y respuesta desde GraphQL

Con esa definición una request válida se haría enviando un POST a `http://localhost:4000` con el body siguiente:

```json
query {
  allPersons {
    name
    street
    city
  }
}
```

Lo cual obtendrá esta response:

```json
{
  "data": {
    "allPersons": [
      {
        "name": "Arto Hellas",
        "street": "Tapiolankatu 5 A",
        "city": "Espoo"
      },
      {
        "name": "Matti Luukkainen",
        "street": "Malminkaari 10 A",
        "city": "Helsinki"
      },
      {
        "name": "Venla Ruuska",
        "street": "Nallemäentie 22 C",
        "city": "Helsinki"
      }
    ]
  }
}
```

Otro ejemplo, que usa parámetros para poder filtrar la información obtenida:

```json
// request
query {
  findPerson(name: "Matti Luukkainen") {
    name
    phone
    street
    city
  }
}

// response
{
  "data": {
    "findPerson": {
      "name": "Matti Luukkainen",
      "phone": "040-432342",
      "street": "Malminkaari 10 A",
      "city": "Helsinki"
    }
  }
}
```

Cada resolver cuenta con 4 parámetros. Estos se pueden revisar [aquí](https://the-guild.dev/graphql/tools/docs/resolvers#resolver-function-signature).

#### Alias y multiples querys

Se debe considerar que es posible enviar más de una solicitud de campos en una sola request.

```json
// request
query {
  personCount,
  allPersons(phone:YES) {
    name
    phone
    address {
      city
      street
    }
  }
}

// response
{
  "data": {
    "personCount": 3,
    "allPersons": [
      {
        "name": "Arto Hellas",
        "phone": "040-123543",
        "address": {
          "city": "Espoo",
          "street": "Tapiolankatu 5 A"
        }
      },
      {
        "name": "Matti Luukkainen",
        "phone": "040-432342",
        "address": {
          "city": "Helsinki",
          "street": "Malminkaari 10 A"
        }
      }
    ]
  }
}

```

Además, que es posible usar más de una vez la misma query, dándole un alias:

```json
// request
query {
  havePhone: allPersons(phone: YES){
    name
  }
  phoneless: allPersons(phone: NO){
    name
  }
}

// response
{
  "data": {
    "havePhone": [
      {
        "name": "Arto Hellas"
      },
      {
        "name": "Matti Luukkainen"
      }
    ],
    "phoneless": [
      {
        "name": "Venla Ruuska"
      }
    ]
  }
}
```

### Resolver predeterminado

Para cada esquema se define de forma automática, un resolver que retorna la clave consultada.

```js

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => persons.find(p => p.name === args.name)
  },
  /* Esto es un ejemplo de como es por debajo definido.
  Aquí root hace referencia a los valores en sí del esquema consultado.
  */
  Person: {
    name: (root) => root.name,
    phone: (root) => root.phone,
    street: (root) => root.street,
    city: (root) => root.city,
    id: (root) => root.id
  }
}
```

Por tanto, en caso de necesitar modificar este comportamiento, se puede definir un resolver específico que cambie la información obtenida al consultar cualquier campo, por ej.:

```js
Person: {
  street: (root) => "Manhattan",
  city: (root) => "New York"
}
```

Esto es útil en caso de que se quiera generar un objeto especial de resultado, en lugar del obtenido normalmente. Si se quisiera, por ej., mostrar los campos `street` y `city` dentro de un objeto `address`, se debe manipular el objeto Person para que use un resolver distinto:

```js

// ...

const typeDefs = `#graphql
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`


const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    }
  }
}

```

### Mutaciones

Son las operaciones necesarias para poder modificar datos en GraphQL.

Para implementarlas se deben generar como un nuevo tipo dentro del esquema, en donde se debe indicar los datos que deben enviarse y son requeridos (indicando si son NO nulos) y además, el tipo de datos que se retornará:

```js

const typeDefs = `#graphql
  // ...

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
  }
`
```

Definir la función que hará la mutación. Dentro de la función se debe utilizar alguna utilidad para poder el ID y asegurar que sea único. Para lo último se utiliza `uuid` (`npm i uuid`)

```js
  const { v1: uuid } = require('uuid')

  // ...

  Mutation: {
    addPerson: (root, args) => {
      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }
```

En caso de querer modificar datos, se hace un proceso similar, es decir, modificar el esquema Mutations, indicando los campos a enviar y el campo a retornar y luego, agregar la operación como un nuevo resolver.

```js
  const typeDefs = `#graphql
    // ...
    type Mutation {
      addPerson(
        name: String!
        phone: String
        street: String!
        city: String!
      ): Person
      editNumber(
        name: String!
        phone: String!
      ): Person
    }
  `

  const resolvers = {
    Query: {
      // ...
    },
    Mutation: {
      // ...
      editNumber: (root, args) => {
        const person = persons.find(p => p.name === args.name)
        if (!person) {
          return null
        }

        const updatedPerson = { ...person, phone: args.phone }
        persons = persons.map(p => p.name === args.name ? updatedPerson : p)
        return updatedPerson
      }
    }
  }
```

#### Uso de las mutaciones

Para poder aplicar la mutación y generar un nuevo registro, se debe usar la siguiente "consulta":

```json
mutation {
  addPerson(
    name: "Pekka Mikkola"
    phone: "045-2374321"
    street: "Vilppulantie 25"
    city: "Helsinki"
  ) {
    name
    phone
    address{
      city
      street
    }
    id
  }
}
```

lo cual genera la siguiente response:

```json
{
  "data": {
    "addPerson": {
      "name": "Pekka Mikkola",
      "phone": "045-2374321",
      "address": {
        "city": "Helsinki",
        "street": "Vilppulantie 25"
      },
      "id": "da4b0470-faec-11ef-b6d1-d3e14af5b04d"
    }
  }
}

```

### Manejo de errores

Se debe considerar que al hacer una query se debe indicar los campos que se desea obtener de alguno que NO sea de tipo escalar, ya que es un error no indicarlo y la response será un error que indicará esa situación.

Por ej. la query siguiente usa el campo `state` que no es válido dentro de `address`:

```json

query {
  allPersons {
    name
    phone
    address {
      state
    }
  }
}

```

La response obtenida indica esta situación:

```json
{
  "errors": [
    {
      "message": "Cannot query field \"state\" on type \"Address\". Did you mean \"street\"?",
      "locations": [
        {
          "line": 6,
          "column": 7
        }
      ],
      "extensions": {
        "code": "GRAPHQL_VALIDATION_FAILED",
        "stacktrace": [
          // ...
        ]
      }
    }
  ]
}
```

Esta implementación es automática gracias a `apollo-server` y la definición del esquema de GraphQL, sin embargo, cuando se trata de una mutación, se requiere aplicar validaciones manuales para restringir valores más complejos.

Para ello, se hace uso del manejo de errores de GraphQL:

```js

const { GraphQLError } = require('graphql')

// ...

  Mutation: {
    addPerson: (root, args) => {
      if (persons.find(p => p.name === args.name)) {
        throw new GraphQLError('Name must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }

```

### Enums

Corresponden a un conjunto de valores que se pueden usar para restringir un campo.

Se definen dentro del esquema usando la palabra `enum`:

```js
// ...


const typeDefs = `#graphql
  enum YesNo {
    YES
    NO
  }

  type Address {
    street: String!
    city: String!
  }
  // ...

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }

`

// ...

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: (root, args) => {
      if (!args.phone) {
        return persons
      }
      const byPhone = (person) =>
        args.phone === 'YES' ? person.phone : !person.phone
      return persons.filter(byPhone)
    },

    // ...
  }
  // ...
}
```

El enum mostrado en el ejemplo, luego es usado en la query allPersons para poder indicar si se quiere filtrar las personas dependiendo si tienen teléfono.

### Variables en consultas

Normalmente, se requerirá enviar información de forma dinámica para poder aplicar los filtros correspondientes en una consulta. Esto se logra usando la sintaxis `$variable` dentro de la consulta. El valor de esta variable se envía de forma separada en un objeto llamado `variables`, en el que se indica el nombre de la variable como clave y su valor se asignará a la misma.

```json
// Request
mutation {
  editAuthor(name: $nombre, setBornTo: $year) {
    name
    born
  }
}

// Variables
{
  "nombre": "Perico",
  "year": 1968
}
```

### Uso de GraphQL en React

Para ello, se recomienda usar una librería que permite omitir los detalles de la comunicación entre el cliente y servidor, esta es [`@apollo/client`](https://www.npmjs.com/package/@apollo/client). Documentación [aquí](https://www.apollographql.com/docs/react)

#### Preparación inicial

Se instalan los siguientes packages: `npm install @apollo/client graphql`.

Aquí `@apollo/client`, permite el manejo de cache, de estado local, de errores y la capa de la Vista basado en React. `graphql`, por otro lado, permite parsear las querys de tipo GraphQL.

Luego, se genera un nuevo cliente de Apollo (cliente que se usa para poder conectarse desde el Frontend con el backend de GraphQL) , el cual se disponibiliza para toda la aplicación dentro del `main.jsx`, a través del uso de `ApolloProvider`, el cual funciona de forma similar al `Context.Provider`, usado anteriormente.

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'

import './index.css'
import App from './App.jsx'


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000',
  })
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
```

#### Realización de consultas

Para ello se usa el hook personalizado `useQuery` de Apollo Client, el cual permite tomar un string que contenga una consulta en formato GraphQL, y retorna un objeto con el resultado obtenido (`data`) desde el servidor GraphQL, en conjunto con propiedades que permiten determinar si la query aún está cargando (`loading`), o tuvo un error (`error`).

```js

import { gql, useQuery } from '@apollo/client';

const ALL_PERSONS = gql`
query {
  allPersons  {
    name
    phone
    id
  }
}
`

const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }
  if (result.error) {
    return <div>Error detected... Review console.</div>
  }
  return (
    <div>
      {result.data.allPersons.map(p => p.name).join(', ')}
    </div>
  )
}

```

#### Uso de Variables en consultas

Considerando la necesidad que hay de filtrar información para obtenerla desde las querys definidas, GraphQL define la forma para enviarlas así:

- Se le da un nombre a la consulta, por ej. `findPersonByName`

- Se indica con un signo $ más el nombre de la variable dentro de los parámetros de la query, el cual luego se usa dentro de la query asociandolo al parámetro que se envía a la función.

```json
query findPersonByName($nameToSearch: String!) {
  findPerson(name: $nameToSearch) {
    name
    phone
    address {
      street
      city
    }
  }
}

```

- Para invocar la query definida se usa `useLazyQuery()` la cual permite hacer la llamada a la query de forma manual, a diferencia de `useQuery()` que lo hace automáticamente.

```js

import { useState, useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'


const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

const Persons = ({ persons }) => {
  // useLazyQuery, retorna un array con la función que permite invocar la query y result, que es el resultado de la ejecución de la misma.
  const [getPerson, result] = useLazyQuery(FIND_PERSON)
  const [person, setPerson] = useState(null)


  const showPerson = (name) => {
    // Se debe enviar un objeto con la propiedad "variables", que contendrá un objeto cuyas propiedades serán los nombres de las variables y su valor será el valor de las mismas.

    getPerson({ variables: { nameToSearch: name } })
  }


  useEffect(() => {
    if (result.data) {
      setPerson(result.data.findPerson)
    }
  }, [result])


  if (person) {
    return (
      <div>
        <h2>{person.name}</h2>
        <div>{person.address.street} {person.address.city}</div>
        <div>{person.phone}</div>
        <button style={{ marginLeft: '2px' }} onClick={() => setPerson(null)}>close</button>
      </div>
    )
  }

  return (
    <div>
      <h2>Persons</h2>
      {persons.map(p =>
        <div key={p.name}>
          {p.name} {p.phone}

          <button onClick={() => showPerson(p.name)} >
            show address
          </button>
        </div>
      )}
    </div>
  )

}


```

La ventaja de obtener los datos usando `useLazyQuery()` es que los valores son dejados en caché, por lo que si se detecta que el ID obtenido del dato es el mismo que ya existe, la request no se realiza y se obtiene la información desde el caché. Esto también ocurre al obtener un nuevo dato que referencia al mismo ID: se obtiene la información desde el servidor y se guarda en la caché para evitar nuevas consultas futuras.

### Mutaciones: Creación

Al igual que para las consultas, las variables son definidas con el signo $. Para aplicarlas se genera la query correspondiente y se usa el hook `useMutation()`. Aquí se muestra un formulario de ejemplo que usa este hook:

```js

import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const CREATE_PERSON = gql`
mutation createPerson($name: String!, $street: String!, $city: String!, $phone: String) {
  addPerson(
    name: $name,
    street: $street,
    city: $city,
    phone: $phone
  ) {
    name
    phone
    id
    address {
      street
      city
    }
  }
}
`

const PersonForm = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')


  const [ createPerson ] = useMutation(CREATE_PERSON)

  const submit = (event) => {
    event.preventDefault()


    createPerson({  variables: { name, phone, street, city } })

    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          name <input value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone <input value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <div>
          street <input value={street}
            onChange={({ target }) => setStreet(target.value)}
          />
        </div>
        <div>
          city <input value={city}
            onChange={({ target }) => setCity(target.value)}
          />
        </div>
        <button type='submit'>add!</button>
      </form>
    </div>
  )
}

export default PersonForm

```

#### Mutaciones:  Manejo de caché

Considerando que las querys mantienen en caché la información que obtienen, es necesario hacer que la vuelvan a obtener. Esto se puede lograr de las siguientes maneras:

1. Agregar "polling" a las consultas: Permite realizar automáticamente la query en un intervalo definido:

```js
  const result = useQuery(ALL_PERSONS, {
    pollInterval: 2000
  })
```

Esto tiene el problema de que se realizan llamadas innecesarias al servidor, considerando la cantidad de veces que tendrías que obtener la información.

1. Agregar el parámetro `refetchQueries` a la mutation aplicada:

```js
const ALL_PERSONS = gql`
  query  {
    allPersons  {
      name
      phone
      id
    }
  }
`

const PersonForm = (props) => {
  // ...

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [ { query: ALL_PERSONS } ]
  })

}
```

Con esta opción se evita el tráfico innecesario, pero no se actualiza la información para otros usuarios.
Sin embargo, es posible enviar un listado de querys para permitir ejecutar varias a la vez.

```js
  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [ { query: ALL_PERSONS }, { query: OTHER_QUERY }, { query: ... } ] // pass as many queries as you need
  })
```

#### Mutaciones: Manejo de errores

Para ello, se debe usar la propiedad `onError` del useMutation:

```js

const PersonForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')


  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: ALL_PERSONS }],
    onError: (error) => {
      // const errors = error.graphQLErrors[0].extensions.error.errors
      // const messages = Object.values(errors).map(e => e.message).join('\n')
      const messages = error.graphQLErrors[0].message
      setError(messages)
    }
  })

  // ...
}
```

En este caso, `setError` es una función implementada en App.jsx, que muestra el valor enviado como una notificación.

### Mutaciones: Edición

Para la edición se hace un proceso similar que para la creación: definir la query a utilizar para la modificación de datos, definir el formulario necesario y aplicar `useMutation()` para poder invocar la mutación.

```js

import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'

const EDIT_NUMBER = gql`
  mutation editNumber($name: String!, $phone: String!) {
    editNumber(name: $name, phone: $phone)  {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`

const PhoneForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')


  const [changeNumber, result] = useMutation(EDIT_NUMBER)

  const submit = (event) => {
    event.preventDefault()


    changeNumber({ variables: { name, phone } })

    setName('')
    setPhone('')
  }

  useEffect(() => {
    if (result.data && result.data.editNumber === null) {
      setError('person not found')
    }
  }, [result.data])  // eslint-disable-line


  return (
    <div>
      <h2>change number</h2>

      <form onSubmit={submit}>
        <div>
          name <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone <input
            value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <button type='submit'>change number</button>
      </form>
    </div>
  )
}

export default PhoneForm

```

Las consideraciones a tener en cuenta son:

1. El caché se actualiza automáticamente al hacer la modificación, debido a la existencia de una modificación en el ID, por lo que no es necesario hacer un "refresco" de los datos.
1. Para GraphQL el hecho de NO encontrar algún valor para poder realizar la actualización no constituye un error, por tanto, en caso de querer validar esa situación se debe hacer referencia al resultado de la operación (variable `result` obtenida del `useMutation()`). Si el resultado es `null`, quiere decir que no hubo coincidencias para poder hacer la modificación, lo que permite mostrar un error de ser necesario. Como el dato depende de una entidad externa, esa evaluación se asocia a un `useEffect()`.

### Uso de GraphQL con Mongoose (MongoDB)

Para ello, al igual que para las definiciones de tipo REST, es necesario:

- generar los procesos de conexión con la BD, es decir, instalar las dependencias (`npm i mongoose dotenv`)
- crear el archivo `.env` que contiene las variables de entorno con los datos de conexión
- definir los `schemas` de cada entidad (modelos)

Con eso implementado es posible asociar los `resolvers` con los métodos definidos por cada modelo, lo que permite obtener y gestionar los datos desde y hacia la BD de Mongo.

Por ej. Esquema de Persona:

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  phone: {
    type: String,
    minlength: 5
  },
  street: {
    type: String,
    required: true,
    minlength: 5
  },
  city: {
    type: String,
    required: true,
    minlength: 3
  },
})

module.exports = mongoose.model('Person', schema)
```

Asociado a ese esquema sus resolvers serían estos:

```js

// ...

const Person = require('./models/person')

// ...

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),
    allPersons: (root, args) => {
      if (!args.phone) {
        return Person.find({})
      }

      /*
      * El operador $exists, busca si el campo indicado (phone) está incluido dentro del esquema buscado. * * Esto implica que es posible que tenga valor null, y aún así lo incluya en el resultado.
      */
      return Person.find({ phone: { $exists: args.phone === 'YES' } })
    },
    findPerson: async (root, args) => Person.findOne({ name: args.name }),
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    }
  },
  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args })
      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone

      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError('Editing number failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return person
    }
  }
}

```

Se debe considerar que se modifican las funciones `resolver`, para que todas sean asíncronas considerando la obtención de datos desde una Entidad Externa.

### Integración de GraphQL con login de usuarios

Considerando que el login implica operaciones similares a la generación de un esquema para otras operaciones, se debe realizar un proceso similar al descrito en la sección anterior. Además, por el uso de tokens se requiere instalar JWT (`npm install jsonwebtoken`).

> IMPORTANTE: Para este ejemplo, NO se incluye una password como parte de la creación del usuario. La password usada es siempre `secret`.

Esquema de Mongoose:

```js

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person'
    }
  ],
})

module.exports = mongoose.model('User', schema)

```

Modificaciones al schema de GraphQL:

```js

type User {
  username: String!
  friends: [Person!]!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
}

type Mutation {
  // ...
  createUser(
    username: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}

```

Resolvers implementados: Considerar que esto requiere que haya un SECRET definido en .env (JWT_SECRET)

```js

const jwt = require('jsonwebtoken')

Mutation: {
  // ..
  createUser: async (root, args) => {
    const user = new User({ username: args.username })

    return user.save()
      .catch(error => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      })
  },
  login: async (root, args) => {
    const user = await User.findOne({ username: args.username })

    if ( !user || args.password !== 'secret' ) {
      throw new GraphQLError('wrong credentials', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
  },
},

```

Adicionalmente, como el login es algo que se requiere para toda request que se realice al backend, es necesario agregar el token obtenido. Para ello, se agrega la propiedad `context` al `startStandaloneServer()`, lo cual permite identificar al usuario ingresado trayendo sus datos y así compartiendolos con todos los `resolvers`.

>IMPORTANTE: Se genera una función separada para generar el `context` con el objetivo de permitir reconocer las importaciones realizadas.

```js
// ...

const jwt = require('jsonwebtoken')

const User = require('./models/user')

// ...
const authContext = async ({ req, res }) => {
  const auth = req ? req.headers.authorization : null
  if (auth && auth.startsWith('Bearer ')) {
    const decodedToken = jwt.verify(
      auth.substring(7), process.env.JWT_SECRET
    )
    const currentUser = await User
      .findById(decodedToken.id).populate('friends')
    return { currentUser }
  }
}

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: authContext,
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

```

El valor del usuario que se encuentra en el `context` del servidor, puede ser accedido al usar el tercer parámetro en cualquier `resolver`. Si no hay usuario logueado, ese valor será igual a `null`.

```js
const resolvers = {
  Query: {
    // ...
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  //  ...
}
```

Para validar que el usuario que hace la operación se encuentra autenticado, se obtienen los datos desde el `context`. En caso de encontrarse con un `null`, se lanza un error:

```js

Mutation: {

    addPerson: async (root, args, context) => {
      const person = new Person({ ...args })

      const currentUser = context.currentUser


      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      try {
        await person.save()

        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      } catch (error) {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return person
    },
  //...
}

```

#### Modificaciones al Frontend para poder usar el login de usuarios

Se debe generar un formulario de login, el cual se difiere de las otras versiones con React en el uso de `useMutation()`, para poder llamar a la mutation correspondiente, y en el uso de `useEffect()`.

Mutation usada:

```js
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
```

Formulario generado:

```js
import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })


  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('phonenumbers-user-token', token)
    }
  }, [result.data]) // eslint-disable-line

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm

```

#### Logout y limpieza de caché

En conjunto con dar la posibilidad de cerrar sesión se debe considerar que se debe limpiar el caché de ApolloClient, para evitar que datos que requieren sesión iniciada sean visibles cuando no hay una. Para ello, se debe usar el método `resetStore()`:

```js
const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)

  const client = useApolloClient()

  if (result.loading)  {
    return <div>loading...</div>
  }


  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }


  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={setToken} setError={notify} />
      </>
    )
  }

  return (
    <>
      <Notify errorMessage={errorMessage} />

      <button onClick={logout}>logout</button>
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </>
  )
}

```

#### Envío de token en el encabezado de la request

Para poder lograr agregar el token en cada request se modifica la forma en que se levanta el ApolloClient usado a nivel global en la aplicación. En este caso, se genera el link de acceso del cliente (`httpLink`) y luego este se suma al link de autenticación (`authLink`), el cual extrae el token de autenticación desde el localStorage y lo agrega a los `headers` de cada solicitud.

```js
// ...

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import App from './App'


const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('phonenumbers-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})

createRoot(document.getElementById('root')).render(
  // ...
)
```

#### Actualización de caché luego de crear nuevos registros

La opción utilizada anteriormente era usar la opción `refetchQueries` dentro de las propiedades de la llamada a `useMutation()`. Sin embargo, este tiene el inconveniente de que genera una nueva request por cada invocación.

```js
// ...
  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [  {query: ALL_PERSONS} ],
    onError: (error) => {
      const errors = error.graphQLErrors[0].extensions.error.errors
      const messages = Object.values(errors).map(e => e.message).join('\n')
      setError(messages)
    }
  })
// ...
```

Otra opçión es usar la propiedad `update` a la cual se le envía una función, que permite gestionar manualmente el caché asociado. Esta función recibe el caché y la response como parámetros.

```js
// ...

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
        return {
          allPersons: allPersons.concat(response.data.addPerson),
        }
      })
    },
  })

// ...
```

En este punto se debe comentar que `updateQuery()` toma el resultado (response) de la query enviada como primer parámetro (`ALL_PERSONS`) y se usa como parámetro de la función enviada como segundo parámetro. Aquí se desestructura (desde `data`) el valor `allPersons` y se le agrega los datos obtenidos de la response obtenida resultado de `useMutation()`.

El manejo de caché de forma consistente es imperativo para poder evitar errores complejos de detectar. Se debe conocer las necesidades de la aplicación para determinar la mejor manera de manejar el caché. Es posible que sea necesario usar uno u otro método, o a veces no usar caché.

Esto último se logra indicando un valor `no-cache` a la propiedad `fetchPolicy` usado en el hook `useQuery()`, lo cual se puede configurar de forma individual para cada query o de forma completa a todo el ApolloServer.
