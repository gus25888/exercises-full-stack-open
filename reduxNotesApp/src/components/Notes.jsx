/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux'
import { updateNote } from '../reducers/noteReducer'

const Note = ({ note, handleClick }) => {
  return (
    <li onClick={handleClick}>
      {note.content}
      {note.important ? <strong> important</strong> : null}
    </li>
  )
}

const Notes = () => {

  const dispatch = useDispatch()
  const notes = useSelector(({ filter, notes }) => {
    if (filter === 'ALL') {
      return notes
    }

    return filter === 'IMPORTANT'
      ? notes.filter(note => note.important)
      : notes.filter(note => !note.important)
  })

  const changeNoteImportance = async (note) => {
    const changedNote = {
      ...note,
      important: !note.important
    }

    dispatch(updateNote(changedNote))
  }

  return (
    <ul>
      {notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => { changeNoteImportance(note) }}
        />
      )}
    </ul>
  )
}

export default Notes