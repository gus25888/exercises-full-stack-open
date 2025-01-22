import Counter from './components/Counter'
import CounterLR from './components/CounterLR'
import FormPersonalData from './components/FormPersonalData'

const App = () => {
  return (
    <>
      <div>
        <Counter />
      </div>
      <br />
      <br />
      <div>
        <CounterLR />
      </div>
      <br />
      <br />
      <div>
        <FormPersonalData />
      </div>
    </>
  )
}

export default App
