import { useState } from "react";

const Display = ({ counter }) => <div>{counter}</div>

const Button = ({ onSmash, text }) => (
  <button onClick={onSmash}>{text}</button>
);


const App = () => {
  /*
    * "counter" se inicia con el valor enviado por parámetro.
    * useState se usa para poder modificar el "estado" de la aplicación, estableciendo un valor inicial a la variable recibida y una función para poder modificar esa variable.
    * Cada vez que se realiza una llamada a la función obtenida desde useState (función setCounter) se realiza un renderizado completo de la App, lo cual refresca todos los componentes asociados.
  */
  const [counter, setCounter] = useState(0);
  console.log('rendering with counter value', counter)

  const increaseByOne = () => { console.log('increasing, value before', counter); setCounter(counter + 1) }

  const setToZero = () => { console.log('resetting to zero, value before', counter); setCounter(0) }

  const decreaseByOne = () => { console.log('decreasing, value before', counter); setCounter(counter - 1) }

  /*
   * Se puede enviar una función flecha anónima para la ejecución del evento correspondiente (Controlador de Eventos)
   * Se recomienda que se generen funciones específicas y luego se referencien en cada evento.
   * Solo deben referenciarse: NO se pueden ejecutar en ese punto.
  */
  return (
    <div>
      <Display counter={counter} />
      <Button onSmash={increaseByOne} text={'plus'} />
      <Button onSmash={setToZero} text={'zero'} />
      <Button onSmash={decreaseByOne} text={'minus'} />
    </div>
  )
}

export default App

//* Iteraciones de la función App para mostrar conceptos de React.

//* Versión inicial para poder ejemplificar los states de los components.

// const App = () => {
//   const [ counter, setCounter ] = useState(0)

//   setTimeout(
//     () => setCounter(counter + 1),
//     1000
//   )

//   return (
//     <div>{counter}</div>
//   )
// }

//* Ejemplo de muestra de variables en componentes.


// const Hello = ({ name, age }) => {
//   const bornYear = () => new Date().getFullYear() - age;

//   return (
//     <div>
//       <p>Hello {name}, you are {age} years old</p>
//       <p>So you were probably born in {bornYear()} </p>
//     </div>
//   )
// }

// const App = () => {
//   const name = 'Peter';
//   const age = 10;

//   return (
//     <div>
//       <h1>Greetings</h1>
//       <Hello name='Maya' age={26 + 10} />
//       <Hello name={name} age={age} />
//     </div>
//   )
// }

//* Ejemplo de muestra de variables tipo array en componentes. (No se pueden enviar directamente solo recibe variables "primitivas")

// const App = () => {
//   const friends = [
//     { name: 'Peter', age: 4 },
//     { name: 'Maya', age: 10 },
//   ]

//   return (
//     <div>
//       <p>{friends[0].name} {friends[0].age}</p>
//       <p>{friends[1].name} {friends[1].age}</p>
//     </div>
//   )
// }
