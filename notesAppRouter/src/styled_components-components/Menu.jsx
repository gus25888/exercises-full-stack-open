import { Link } from "react-router-dom"
import { Navigation } from "./styles"

const Menu = ({ user }) => {
  const padding = {
    padding: 5
  }
  return (
    <Navigation>
      <Link style={padding} to="/">home</Link>
      <Link style={padding} to="/notes">notes</Link>
      <Link style={padding} to="/users">users</Link>
      {user
        ? <em>{user} logged in</em>
        : <Link style={padding} to="/login">login</Link>
      }
    </Navigation>
  )
}

export default Menu