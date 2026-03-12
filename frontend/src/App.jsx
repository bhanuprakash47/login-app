import { Component } from "react"
import {BrowserRouter,Route,Routes} from "react-router-dom"


import Signup from "./components/Signup"
import Login from "./components/Login"
import Home from "./components/Home"


class App extends Component{

  render(){
    return(
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    )
  }

}

export default App