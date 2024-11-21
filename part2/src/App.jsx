import { useEffect, useState } from "react"

import Note from "./components/Note"
import Notification from "./components/Notification";
import noteService from "./services/notes";
import Footer from "./components/Footer"

/*
* En esta aplicación el objetivo es registrar notas usando un formulario.
* Las "notes" se obtienen desde un archivo externo (db.json),
* el cual se levanta como un backend local con la utilidad "json-server"
*/

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  /*
  * Se especifica un hook de estado para permitir el renderizado de un mensaje de error.
  */
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes))
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
        setErrorMessage(`note '${note.content}' was already deleted from server`)
        setTimeout(setErrorMessage(null), 5000)
        setNotes(notes.filter(note => note.id !== id))
      })
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => { setShowAll(!showAll) }}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>{
        notesToShow.map((note, id) =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} />
        )
      }</ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App