import { useNavigate } from "react-router-dom"
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

const Login = ({ onLogin }) => {
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    onLogin('mluukkai')
    navigate('/')
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <TextField label='username' type="text" />
        </div>
        <div>
          <TextField label='password' type="password" />
        </div>
        <Button variant='contained' color="primary" type="submit">login</Button>
      </form>
    </div>
  )
}

export default Login