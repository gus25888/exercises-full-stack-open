/* eslint-disable react/prop-types */
import React from 'react'
import { createStore } from 'redux';

const Display = ({ counter }) => <div>{counter}</div>

const Button = ({ onSmash, text }) => (
  <button onClick={onSmash}>{text}</button>
)

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default: return state
  }

}

const store = createStore(counterReducer)

const App = () => {

  return (
    <div>
      <Display counter={counter} />
      <Button onSmash={increaseByOne} text={'plus'} />
      <Button onSmash={setToZero} text={'zero'} />
      <Button onSmash={decreaseByOne} text={'minus'} />
    </div>
  )
}


export default App
