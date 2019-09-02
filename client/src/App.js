// libraries
import React from 'react'

// components
import TopBar from './Components/TopBar'
import MenuButtons from './Components/MenuButtons'
import Courses from './Views/Courses'

// styles
import './App.css'

function App() {
  return (
    <div className="App">
      <TopBar />
      <MenuButtons />
      <div className="pageContainer">
        <Courses />
      </div>
    </div>
  )
}

export default App
