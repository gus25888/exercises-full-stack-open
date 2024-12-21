import propTypes from 'prop-types'

const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'make not important' : 'make important'

  return (
    <li className='note'>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>)
}

Note.PropTypes = {
  note: propTypes.shape({
    content: propTypes.string.isRequired,
    important: propTypes.bool.isRequired
  }),
  toggleImportance: propTypes.func.isRequired
}
export default Note