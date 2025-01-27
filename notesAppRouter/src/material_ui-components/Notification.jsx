import Alert from '@mui/material/Alert'


const Notification = ({ message }) => (
  <div>
    {
      (message && <Alert severity='success'>{message}</Alert>)
    }
  </div>
)

export default Notification