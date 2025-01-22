import { useState } from "react";

/*
 * Las props corresponden a valores que se pueden pasar al componente al usarlo.
 * Dentro de la etiqueta HTML (que tendrá el nombre de la función, ej. History)
 * se indica la variable que se quiera enviar seguida de un igual entre llaves,
 * con el valor a usar, el cual puede ser un primitivo, un objeto, o una función.
 *
 * Esta etiqueta debe ser cerrada por si misma. Ej. <History allClicks={allClicks} />

*/
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

const Button = ({ handleClick, text }) => (<button onClick={handleClick}>{text}</button>)

/*
 * Para el manejo de estados complejos,
 * se recomienda usar variables separadas para manejar partes de cada uno.
 */
const App = () => {
    /*
    * Los hooks (funciones que dicen "use"), NO se deben llamar dentro de loops, ifs o subfunciones.
    *  Solo se deben llamar desde dentro de la función que define un componente de React.
    */
    const [left, setLeft] = useState(0)
    const [right, setRight] = useState(0)
    const [allClicks, setAllClicks] = useState([])
    const [total, setTotal] = useState(0)

    /*
     * Se requiere generar SIEMPRE copias de la información antes de guardarla como datos.
     * Las actualizaciones de valores ocurren de forma asíncrona,
     * por lo que la cantidad de "left" no puede ser obtenida directamente,
     * sino que se debe usar una variable que tenga el valor actualizado.
    */
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


/*
 * Es posible manejarlos con un objeto y que los controladores de eventos se encarguen de que recarga el estado de la aplicación completo.

* Pero para este caso en particular, NO se recomienda, ya que no entrega beneficios respecto a hacerlo de forma separada.

* Este proceso de actualización debe realizarse copiando las propiedades a un nuevo objeto para que se tenga la certeza de la consistencia de los valores aplicados.

*  Los valores que NO son modificados, simplemente son copiados al nuevo objeto.

* Por eso, NO se debe ocupar incrementadores pre o postfijos (++) ya que se pueden generar errores de datos no esperados.
*/

/*
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
*/

export default App