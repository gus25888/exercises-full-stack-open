import { useState } from "react";
import Note from "./components/Note"

/*
* En esta aplicación el objetivo es registrar notas usando un formulario.
* Las "notes" se obtienen desde lo definido en Main.
*
*/




/*
* ***** Renderizado de múltiples elementos *****

* Para el renderizado de elementos que son múltiples,
* se puede usar "map" para "envolverlos" en la etiqueta correspondiente.
! IMPORTANTE: Se debe agregar una propiedad "key" que sea única, para que React pueda reconocer y asociar correctamente cada componente generado con el loop. Su valor debe ser un id generado de forma específica para ese componente, es decir, NO se debe usar el indice del array en que se encuentran, por ej.

*/

/*
* ***** Implementación de formularios *****

* Para la implementación de Formularios se debe generar asociación del mismo con el State de la app
* considerando que cada input o elemento que se requiere monitorear por cambios,
* debe tener una inicialización como una variable en el State asociado a su "value".
* Ej.: <input value={newNote} onChange={handleNoteChange} />


! IMPORTANTE: Se debe especificar un evento "onChange" para que un input sea reconocido por React como uno que espera cambios. Si no se asume que es un "read-only"
*/

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)

  const addNote = (event) => {
    event.preventDefault();

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: notes.length + 1
    }

    setNotes(notes.concat(noteObject))
    setNewNote('')
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => { setShowAll(!showAll) }}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>{
        notesToShow.map(note => <Note key={note.id} note={note} />)
      }</ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App