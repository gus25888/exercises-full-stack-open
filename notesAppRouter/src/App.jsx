/* eslint-disable react/prop-types */
import { useState } from 'react'

import {
  Routes,
  Route,
  Navigate,
  useMatch,
} from "react-router-dom"

//* Bootstrap
// import Notes from './bootstrap-components/Notes'
// import Login from './bootstrap-components/Login'
// import Notification from './bootstrap-components/Notification'
// import Menu from './bootstrap-components/Menu'

//* Material UI
// import { Container } from '@mui/material'
// import Notes from './material_ui-components/Notes'
// import Login from './material_ui-components/Login'
// import Notification from './material_ui-components/Notification'
// import Menu from './material_ui-components/Menu'


//* Styled-components
import { Page, Footer, } from './styled_components-components/styles'
import Notes from './styled_components-components/Notes'
import Login from './styled_components-components/Login'
import Menu from './styled_components-components/Menu'
import Notification from './styled_components-components/Notification'

const Home = () => (
  <div>
    <h2>TKTL notes app</h2>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
  </div>
)

const Note = ({ note }) => {
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}


const Users = () => (
  <div>
    <h2>TKTL notes app</h2>
    <ul>
      <li>Matti Luukkainen</li>
      <li>Juha Tauriainen</li>
      <li>Arto Hellas</li>
    </ul>
  </div>
)


const App = () => {

  const [notes, setNotes] = useState([
    {
      id: 1,
      content: 'HTML is easy',
      important: true,
      user: 'Matti Luukkainen'
    },
    {
      id: 2,
      content: 'Browser can execute only JavaScript',
      important: false,
      user: 'Matti Luukkainen'
    },
    {
      id: 3,
      content: 'Most important methods of HTTP-protocol are GET and POST',
      important: true,
      user: 'Arto Hellas'
    }
  ])


  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(note => note.id === Number(match.params.id))
    : null

  const login = (user) => {
    setUser(user)
    setMessage(`welcome ${user}`)
    setTimeout(() => {
      setMessage(null)
    }, 10000)
  }


  //* Bootstrap

  // return (
  //   <div className='container'>
  //     <Notification message={message} />
  //     <Menu user={user} />

  //     <Routes>
  //       <Route path="/notes/:id" element={<Note note={note} />} />
  //       <Route path="/notes" element={<Notes notes={notes} />} />
  //       <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
  //       <Route path="/login" element={<Login onLogin={login} />} />
  //       <Route path="/" element={<Home />} />
  //     </Routes>

  //     <footer>
  //       <br />
  //       <em>Note app, Department of Computer Science 2024</em>
  //     </footer>
  //   </div>
  // )


  //* Material UI

  // return (
  //   <Container>
  //     <Notification message={message} />
  //     <Menu user={user} />

  //     <Routes>
  //       <Route path="/notes/:id" element={<Note note={note} />} />
  //       <Route path="/notes" element={<Notes notes={notes} />} />
  //       <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
  //       <Route path="/login" element={<Login onLogin={login} />} />
  //       <Route path="/" element={<Home />} />
  //     </Routes>

  //     <footer>
  //       <br />
  //       <em>Note app, Department of Computer Science 2024</em>
  //     </footer>
  //   </Container>
  // )

  //* Styled-Components

  return (
    <Page>
      <Notification message={message} />
      <Menu user={user} />
      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />
        <Route path="/notes" element={<Notes notes={notes} />} />
        <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer>
        <em>Note app, Department of Computer Science 2022</em>
      </Footer>
    </Page>
  )

}

export default App