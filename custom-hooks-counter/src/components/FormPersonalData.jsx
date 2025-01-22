
/*
import { useState } from "react"

const FormPersonalData = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [height, setHeight] = useState('')

  return (
    <div>
      <form>
        name:
        <input
          type='text'
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <br />
        birthdate:
        <input
          type='date'
          value={born}
          onChange={(event) => setBorn(event.target.value)}
        />
        <br />
        height:
        <input
          type='number'
          value={height}
          onChange={(event) => setHeight(event.target.value)}
        />
      </form>
      <div>
        {name} {born} {height}
      </div>
    </div>
  )
}
*/

import useField from '../hooks/useField'

const FormPersonalData = () => {
  const name = useField('text')
  const born = useField('date')
  const height = useField('number')

  /* En este punto, se aprovecha la "spread syntax"
    para asignar los valores de cada input,
    considerando que tienen el mismo
  */
  return (
    <div>
      <form>
        name:
        <input
          type={name.type}
          value={name.value}
          onChange={name.onChange}
        />
        <br />
        birthdate: <input {...born} />
        <br />
        height: <input {...height} />
      </form>
      <div>
        {name.value} {born.value} {height.value}
      </div>
    </div>
  )
}
export default FormPersonalData