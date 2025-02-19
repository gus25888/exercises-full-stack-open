import propTypes from 'prop-types'
import { useState } from 'react'

const NoteForm = ({ createNote }) => {

  const [newNote, setNewNote] = useState('')

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true
    })

    setNewNote('')
  }

  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <input
          placeholder='write note content here'
          value={newNote}
          onChange={(event) => { setNewNote(event.target.value) }} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

NoteForm.propTypes = {
  createNote: propTypes.func.isRequired
}
export default NoteForm