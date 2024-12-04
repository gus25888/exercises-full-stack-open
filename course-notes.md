# Notas de Curso de React

## Part 1 - Introducción a React

### Creacion de app

Usando Vite:

Para npm 6.x (desactualizado, pero aun en uso por algunos):

```command
npm create vite@latest part1 --template react
```

npm 7+ (el doble guion adicional es necesario):

```command
npm create vite@latest part1 -- --template react
```

### Componentes

Son funciones JS que definen un conjunto de etiquetas HTML los cuales se utilizan luego en la aplicación para mostrar valores llamados props.

```jsx
const Button = ({ onSmash, text }) => (
  <button onClick={onSmash}>{text}</button>
);
```

- Deben definirse con mayúscula inicial. Esto también aplica si son definidos como un archivo separado, el cual debe nombrarse igual.
- Deben retornar un HTML válido que tenga etiquetas de apertura y cierre, como __div__.
- Si no es así, el componente completo se debe rodear de una etiqueta vacía:

```jsx
<></>
```

- Además, dentro del HTML en que se llamará a ese componente, debe renderizarse como un componente autocerrado:

```jsx
<History allClicks={allClicks} />
```

- Deben estar definidas como una función independiente, es decir, *__NO deben definirse__* dentro de otro componente. El siguiente ejemplo es UN ERROR.

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

- Las funciones usadas al llamar a un componente, deben ser la referencia de la misma, es decir solo su nombre. Por ejemplo:

```jsx
<Button handleClick={clickIncrement} text="increment" />
```

En caso de que se necesite enviar parámetros a la función, se puede agregar una anónima para que la encapsule. Por ejemplo:

```jsx
<Button handleClick={() => setToValue(value + 1)} text="increment" />
```

#### *Props*

Las props corresponden a valores que se pueden pasar al componente al usarlo.
Dentro de la etiqueta HTML (que tendrá el nombre de la función, ej. History)
se indica la variable que se quiera enviar seguida de un igual entre llaves,
con el valor a usar, el cual puede ser un primitivo, un objeto, o una función.

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

> __IMPORTANTE:__ Una de las mejores prácticas en React es levantar el estado en la jerarquía de componentes.
La documentación dice: "A menudo, varios componentes deben reflejar los mismos datos cambiantes. Recomendamos elevar el estado compartido a su ancestro común más cercano."

También, como parte de buenas prácticas se recomienda definir componentes pequeños que construyan algo más grande.

### Consideraciones generales con los hooks (Funciones React que inician con "use")

- NO se deben llamar dentro de loops, ifs o subfunciones. Solo se deben llamar desde dentro de la función que define un componente de React.
- En caso de tener que manejar varios estados, deben privilegiarse su manejo de forma separada.
- Se requiere generar SIEMPRE copias de la información antes de guardarla como datos. Las actualizaciones de valores ocurren de forma asíncrona, por lo que el valor de una variable no puede ser modificado directamente, sino que se debe usar una variable separada que tenga el valor actualizado y luego ese usar para generar la modificación a través de la función asociada al generar el useState.
Por ejemplo, en el fragmento siguiente se genera la variable *updatedLeft* para ello.

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

> NOTA: Es recomendado por React que las funciones asociadas a controladores de Eventos, se denominen handle*Event*

_________________________________________________________________________________________________________________________

## Part 2 - Comunicandose con el servidor

### Renderizado de múltiples elementos

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

> IMPORTANTE: Se debe agregar una propiedad "key" que sea única, para que React pueda reconocer y asociar correctamente cada componente generado con el loop. Su valor debe ser un id generado de forma específica para ese componente, es decir, NO se debe usar el indice del array en que se encuentran, por ej.

### Implementación de formularios

Para la implementación de Formularios se debe generar asociación del mismo con el State de la app
considerando que cada input o elemento que se requiere monitorear por cambios,
debe tener una inicialización como una variable en el State asociado a su "value".

Ej.:

```HTML
<input value={newNote} onChange={handleNoteChange} />
```

> IMPORTANTE: Se debe especificar un evento "onChange" para que un input sea reconocido por React como uno que espera cambios. Si no se asume que es un "read-only"

### useEffect (Hook de Efecto) para manejar datos externos a la aplicación

Para poder obtener datos (y sincronizarlos) desde una entidad externa (llamada HTTP, por ej.) en un componente, se debe usar un Hook de tipo Efecto (useEffect).

Recibe dos parámetros:

1. La función que realiza la gestión externa.
2. Un array que contiene los elementos que podrían hacer que el Efecto vuelva a ejecutarse, en respuesta al cambio de alguno de ellos. Si se envía uno vacío, se indica que el Efecto, se ejecuta en conjunto con el renderizado del componente asociado, y solo se vuelve a ejecutar si hay un re-renderizado del mismo.
En caso de que sí venga con un array con algun valor, el cambio de ese valor (o valores) realizará un nuevo renderizado del efecto.

### Manejo de datos externos

Por ahora, se visto el uso de la librería *axios* para el manejo de las peticiones necesarias: GET, POST, PUT y DELETE para obtener, crear, actualizar y borrar datos respectivamente.

```jsx
import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

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

### Estilos en React

- De forma separada:

    La forma más ordenada de realizarlo es a través de archivos independientes que contengan las reglas.
    Luego, se importan en la aplicación directamente por nombre.

    ```jsx
    import './index.css'
    ```

- En linea:

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

## Part 3 - Programando un servidor con NodeJS y Express

### Express

Libreria usada para la generación de endpoints (GET, POST, PUT, PATCH) que permiten la consulta de información a la fuente de almacenamiento de datos, como una base de datos o realizar cargas de archivos, entre muchas otras tareas.

Se instala usando npm

```sh
npm i express
```

#### Uso básico

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

Nodemon es un package que permite el reinicio de la aplicación cada vez que se detecta algún cambio en su código.

Como tal, este comportamiento, solo se requiere en ambiente de desarrollo, por lo que en su instalación se considera eso:

```sh
npm i nodemon --save-dev
```

### Uso de Middlewares

Son funciones usadas para manejar objetos de request (datos de la solicitud HTTP) y response (datos de la respuesta a la solicitud realizada).

Reciben 3 parámetros:

- request: Datos de la solicitud enviada al endpoint
- response: Datos a usar para la respuesta
- next: Función que pasa el control al siguiente Middleware.

Ejemplo:

```js
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

.
.
.
.
.

// Luego, se llama de este manera:
app.use(requestLogger)
```

El json-parser (`app.use(express.json())`) toma los datos sin procesar de las solicitudes que están almacenadas en el objeto *request*, los parsea en un objeto de JavaScript y lo asigna al objeto request como una nueva propiedad body.

En la práctica, puedes utilizar varios middleware al mismo tiempo. Cuando tienes más de uno, se ejecutan uno por uno en el orden en el que se definieron en el código de la aplicación.

 Pueden ser invocados antes o después de los controladores de rutas de acceso. Lo primero es lo común, ya que la idea es que hagan gestiones en los datos ANTES que la información llegue al controlador. Usarlos después es, por ejemplo, para poder manejar una solicitud que no se encuentre dentro de los controladores de ruta definidos.

## CORS (Cross Origin Resource Sharing)

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

## Archivos Estáticos

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

## Proxy

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

## Despliegue de la app a internet

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

## Depurar aplicaciones

### Frontend

Uso de la sentencia `debugger;` en cualquier punto del código, pausará la ejecución y permitirá revisar el estado y valor de las variables de la aplicación en ese momento.

### Backend

Uso del comando `node --inspect file.js` o `nodemon --inspect file.js` para permitir la misma revisión que con debugger.

## Uso de MongoDB como repositorio de datos

En MongoDB, los datos se guardan de forma no relacional identificados por un campo unico (_id) en Documents. Los Documentos pueden contener cualquier valor, asociado a una clave en una estructura similar a un objeto JS.

Un conjunto de Documentos se agrupan en Colecciones. La base de datos finalmente, guarda de una a muchas colecciones.

Se recomienda el uso del paquete `mongoose` (`npm install mongoose`) para realizar la conexión y gestión de datos de una BD Mongo, por su capa de abstracción (APIs) que facilita el manejo de la información.

### Uso de mongoose

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

### CRUD con mongoose

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

#### Obtención de varios

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

#### Obtención de uno

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

#### Creación

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

#### Actualización

```js
app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body;

    // Se genera un objeto plano con el nuevo contenido de la nota.
    // NO SE USA una nueva instancia de Note para esto.
    const note = {
        content: body.content,
        important: body.important
    }

    // Requiere id Documento, nuevos valores a modificar, opciones.
    // Las opciones new=true, indican que el resultado de la operacion retornará la nota actualizada.
    Note
        .findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => { response.json(updatedNote) })
        .catch(error => next(error))
})


```

#### Borrado

```js
app.delete('/api/notes/:id', (request, response, next) => {
    Note
        .findByIdAndDelete(request.params.id)
        .then(result => { response.status(204).end() })
        .catch(error => next(error))
})
```

## Variables de entorno

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

## Manejo de errores

En express es posible definir middlewares de errores, los cuales son invocados desde cualquier endpoint usando la función next() y pasando el objeto de error como parámetro. La función next, se debe agregar como parámetro a cada endpoint.

El middleware en sí, debe estar incluido en el código, luego de la definición de TODOS los endpoints, es decir, al final del archivo, justo antes de la función que levanta la aplicación (función `listen`).

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

    .
    .
    .
    .
    .

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
