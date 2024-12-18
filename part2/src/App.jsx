import { useEffect, useState } from "react"

import noteService from "./services/notes"
import loginService from "./services/login"

import Note from "./components/Note"
import Notification from "./components/Notification"
import Footer from "./components/Footer"
import LoginForm from "./components/LoginForm"
import NoteForm from "./components/NoteForm"

/*
* En esta aplicación el objetivo es registrar notas usando un formulario.
*/

const App = () => {

  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  /*
  * Se especifica un hook de estado para permitir el renderizado de un mensaje de error.
  */
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const getInitialNotes = () => {
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes))
  }
  useEffect(getInitialNotes, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const handleNoteChange = (event) => setNewNote(event.target.value)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (exception) {
      console.error(exception)
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }


  const addNote = (event) => {
    event.preventDefault();

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5, //Puede ser 1 ó 0, lo que pasa a boolean automaticamente.
    }

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
        console.error(error.message);
        setErrorMessage(`note '${note.content}' was already deleted from server`)
        setTimeout(setErrorMessage(null), 5000)
        setNotes(notes.filter(note => note.id !== id))
      })
  }



  /*
  * Ya que se define que las "notes" parten como un null,
  * se debe agregar un "return null" para que no se renderice nada la primera vez.
  */
  if (!notes) {
    return null;
  }
  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <Notification message={errorMessage} />

      <h1>Notes</h1>

      {
        user === null ?
          LoginForm({ username, password, handleLogin, setUsername, setPassword }) :
          <div>
            <p>{user.name} logged-in <button onClick={() => { handleLogout() }}>logout</button></p>
            {NoteForm({ newNote, addNote, handleNoteChange, handleLogout })}
          </div>
      }

      <div>
        <button onClick={() => { setShowAll(!showAll) }}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>{
        notesToShow.map((note) =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} />
        )
      }</ul>

      <Footer />
    </div>
  )
}

export default App