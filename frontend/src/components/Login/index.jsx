import { Component } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie"
import axios  from "axios";
import "./index.css"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 


class Login extends Component{
  state={email:"",password:"",errMsg:"",isLoggedIn:false,isNavigateToSignup:false}

  componentDidMount() {
  const token = Cookies.get("jwt_token");
    if (token) {
      this.setState({ isLoggedIn: true });
    }
  }


  callLogin=async(event)=>{
    event.preventDefault()
    const {email,password}=this.state
    const url=`${API_BASE_URL}/api/users/login`
    if (!email || !password){
      this.setState({errMsg:"All Fields are Required"})
      return
    }
    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/   
    if(!emailRegex.test(email)){
      this.setState({errMsg:"Invalid Email"})
      return
    } 
    
    

    try{
        const response = await axios.post(url,{email,password})
        if(response.status===200 || response.status===201){
          const jwtToken=response?.data?.accessToken
          Cookies.set("jwt_token",jwtToken,{expires:1/24})
          this.setState({isLoggedIn:true})
        }
    }
    catch(e){
      this.setState({errMsg:e?.response?.data?.message||"Login Failed"})
    }
  }

  renderSignup=()=>{
    return this.setState({isNavigateToSignup:true})
  }

  render(){
    const {email,password,errMsg,isLoggedIn,isNavigateToSignup}=this.state


    if(isLoggedIn){
      return <Navigate to="/"/>
    }

    if(isNavigateToSignup){
      return <Navigate to="/signup"/>
    }

 

    return(
      <div className="login-container">
        <h1 className="login-heading">Login to Access  Routes</h1>
      <form className="login-form-container" onSubmit={this.callLogin}>
        <div className="input-container">
          <label htmlFor="email" className="para">Email</label>
          <input
              id="email" 
              type="email" 
              value={email} 
              className="input-el"
              onChange={(e)=>this.setState({email:e.target.value})}
          />
      </div>
      <div className="input-container">
        <label htmlFor="password" className="para">Password</label>
        <input
            id="password" 
            type="password" 
            value={password} 
            className="input-el"
            onChange={(e)=>this.setState({password:e.target.value})}
        />
      </div>
      <button type="submit" className="login-btn">Login</button>
      <p className="signup-text">
        Don't have an account?{" "}
        <button type="button" onClick={this.renderSignup}  className="signup-link-btn">Signup</button>
      </p>
      {errMsg ? <p className="err-msg">{errMsg}</p>:<p className="err-msg"></p>}
      </form>
      </div>
    )
  }
}

export default Login