import React, { useState } from 'react'
import axios from 'axios'

import './App.css'

function App() {
  const [testText, setTestText] = useState('inital')

  const serverGET = async () => {
    try {
      const response = await axios.get('http://localhost:3001/test')
      setTestText(response.data.hello)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div onClick={serverGET} className="App">
      <p>{testText}</p>
    </div>
  )
}

export default App
