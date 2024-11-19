import { useEffect, useState } from "react"
import axios from "axios"
import Note from "./components/Note"
import noteService from "./services/notes";

/*
* En esta aplicación el objetivo es registrar notas usando un formulario.
* Las "notes" se obtienen desde un archivo externo (db.json),
* el cual se levanta como un backend local con la utilidad "json-server"
*/

/*
* ***** Renderizado de múltiples elementos *****

* Para el renderizado de elementos que son múltiples,
* se puede usar "map" para "envolverlos" en la etiqueta correspondiente.
? Ver notesToShow.map más abajo.
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
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)

  /*
  * Obtención de notas desde json-server
  *
  * Para poder obtener datos (y sincronizarlos) desde una entidad externa (llamada HTTP, por ej.)
  * en un componente, se debe usar un Hook de tipo Efecto (useEffect).
  *
  * Recibe dos parámetros
  * 1. La función que realiza la gestión externa.
  * 2. Un array que contiene los elementos que podrían hacer que el Efecto vuelva a ejecutarse, en respuesta al cambio de alguno de ellos. Si se envía uno vacío, se indica que el Efecto, se ejecuta en conjunto con el renderizado del componente asociado, y solo se vuelve a ejecutar si hay un re-renderizado del mismo.
  *
  */
  const hook = () => {
    console.log(`effect`);

    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }
  useEffect(hook, [])


  const handleNoteChange = (event) => setNewNote(event.target.value)

  const addNote = (event) => {
    event.preventDefault();

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5, //Puede ser 1 ó 0, lo que pasa a boolean automaticamente.
    }

    /*
    * En el caso de envío de "notes" de forma local se usaría esto:

      setNotes(notes.concat(noteObject))
      setNewNote('')

    * Pero al usar json-server, se modifica a una llamada POST al servidor local
    * para cargar la información en db.json, por lo que al recibir respuesta correcta desde el server
    * se procede a generar el proceso de actualizar el listado de notas y limpiar el campo de texto.
    */
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })

  }

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
        alert(`the note '${note.content}' was already deleted from server`)
        setNotes(notes.filter(note => note.id !== id))
      })
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
        notesToShow.map((note, i) =>
          <Note
            key={i}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} />
        )
      }</ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App