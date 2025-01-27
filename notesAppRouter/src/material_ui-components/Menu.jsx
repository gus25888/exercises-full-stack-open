import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import { Link } from "react-router-dom"

const Menu = ({ user }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          home
        </Button>
        <Button color="inherit" component={Link} to="/notes">
          notes
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        {user
          ? <em>{user} logged in</em>
          : <Button color="inherit" component={Link} to="/login">
            login
          </Button>
        }
      </Toolbar>
    </AppBar>
  )
}

export default Menu