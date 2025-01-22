import { useState } from 'react'

/*
  Otro Hook personalizado,
  pensado para la gestión de Formularios
  Recibe el tipo de input y retorna una función
  que permite registrar el valor del campo
  a medida que va siendo modificado.

*/
export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

export default useField