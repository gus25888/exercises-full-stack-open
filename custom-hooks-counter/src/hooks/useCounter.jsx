import { useState } from 'react'
/*
  Hook personalizado, (denominado con el prefijo "use")
  en donde se utiliza useState() para definir el manejo con diferentes funciones
  de un valor en el State.

*/
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

export default useCounter