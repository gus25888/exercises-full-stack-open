import { useState } from "react"

/*
* Es fundamental tener claro que los componentes deben ser definidos como funciones separadas.
* Hacer lo siguiente es erróneo y generará situaciones dificiles de depurar:

    //* Este es lugar correcto para definir un componente
    const Button = (props) => (
    <button onClick={props.handleClick}>
        {props.text}
    </button>
    )

    const App = () => {
    const [value, setValue] = useState(10)

    const setToValue = newValue => {
        console.log('value now', newValue)
        setValue(newValue)
    }

    //* No definas componentes adentro de otro componente
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


* En su lugar, se deben definir de forma separada como se ve más abajo:
*/
const Display = ({ value }) => (<div>{value}</div>)

const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>
        {text}
    </button>
)

const App = () => {
    const [value, setValue] = useState(10)

    const setToValue = (newValue) => {
        console.log('value now', newValue)
        setValue(newValue)
    }

    /*
    * Los controladores de eventos (onClick, por ej.) SIEMPRE deben ser una REFERENCIA a una función.
    * Cuando se detecte el evento asociado, se procederá a ejecutar la función referenciada.
    */
    return (
        <div>
            <Display value={value} />
            <Button handleClick={() => setToValue(1000)} text='thousand' />
            <Button handleClick={() => setToValue(0)} text='reset' />
            <Button handleClick={() => setToValue(value + 1)} text='increment' />
        </div>
    )
}

export default App