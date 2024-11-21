# Notas de Curso de React

## Part 1

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

## Part 2

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
