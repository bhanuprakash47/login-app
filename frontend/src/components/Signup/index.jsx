import {Navigate} from "react-router-dom"
import { Component } from "react"
import axios from "axios"

import "./index.css"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


class Signup extends Component{
    state={
       errorMsg:"",
       username:"",
       password:"",
       email:"",
       gender:"",
       phone:"",
       isRegistered:false
    }

    renderLogin=()=>{
        return this.setState({isRegistered:true})
    }   

    submitForm=async(event)=>{
            event.preventDefault()
            const {username,password,email,gender,phone}=this.state
            const  url=`${API_BASE_URL}/api/users/signup`

            if(!username||!password||!email||!gender||!phone){
                this.setState({errorMsg:"All Fields are Required"})
                return
            }

            const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if(!emailRegex.test(email)){
                this.setState({errorMsg:"Invalid Email"})
                return
            }

            const phoneRegex=/^\d{10}$/
            if(!phoneRegex.test(phone)){
                this.setState({errorMsg:"Invalid Phone Number"})
                return
            }   

            try{
                const response = await axios.post(url,{username,password,email,gender,phone})
                if(response.status===200||response.status===201){
                    this.setState({isRegistered:true})
                }
            }
            catch(e){
                this.setState({errorMsg:e.response?.data?.message||"Signup failed"})
            }


        }

    render(){
        const {isRegistered,errorMsg,username,password,email,gender,phone}=this.state

        if(isRegistered){
           return <Navigate to="/login"/>
        }   

        return(
            <div className="signup-container">
                <h1 className="heading">Please Signup below</h1>
                <form className="form-container" onSubmit={this.submitForm}>
                    <div className="input-container">
                        <label htmlFor="username" className="para">Username</label>
                        <input
                            id="username" 
                            type="text" 
                            value={username} 
                            className="input-el"
                            onChange={(e)=>this.setState({username:e.target.value})}
                        />
                    </div>
                     <div className="input-container">
                        <label htmlFor="email" className="para"  >Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            className="input-el"
                            onChange={(e)=>this.setState({email:e.target.value})}
                        />
                    </div>
                     <div className="input-container">
                        <label htmlFor="phone" className="para">Phone</label>
                        <input
                            id="phone" 
                            type="text"
                            value={phone}
                            className="input-el"
                            onChange={(e)=>this.setState({phone:e.target.value})}                        
                        />
                    </div>
                    <div className="input-container">
                        <h1 className="Gender">Select Gender</h1>
                        <label className="label-el">
                            <input
                                className="radio-input"
                                type="radio"
                                name="gender"
                                value="MALE"
                                checked={gender === "MALE"}
                                onChange={(e) => this.setState({ gender: e.target.value })}
                            />
                        Male
                        </label>    
                        <label className="label-el">
                            <input 
                                className="radio-input"
                                type="radio"
                                name="gender"
                                value="FEMALE"
                                checked={gender==="FEMALE"}
                                onChange={(e)=>this.setState({gender:e.target.value})}
                            />
                        FEMALE
                        </label>
                    </div>
                    <div className="input-container">
                        <label htmlFor="password" className="para">Password</label>
                        <input 
                            id="password"
                            className="input-el"
                            type="password"
                            value={password}
                            onChange={(e)=>this.setState({password:e.target.value})}
                        />
                    </div>
                    <button type="submit" className="button">Sign Up</button>
                    <p className="login-text">
                        Already have an account?{" "}
                        <button type="button" onClick={this.renderLogin} className="login-link-btn">Login</button>
                    </p>
                    {errorMsg ? <p className="err-msg">{errorMsg}</p>:<p className="err-msg"></p>}
                </form>
            </div>
        )
    }
}

export default Signup