import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios  from 'axios';
import { Component } from 'react';

import "./index.css"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

class Home extends Component {
    state={
        isLoggedOut:false
    }

   
    logout=()=>{
        Cookies.remove("jwt_token")
        this.setState({isLoggedOut:true})
    }

    deleteAccount=async()=>{
        const confirmDelete=window.confirm(
            "This will permanently delete your account. Continue?"
        )

        if(!confirmDelete) return

        const url=`${API_BASE_URL}/api/users/delete`
        const jwtToken = Cookies.get("jwt_token")
        try{
            await axios.delete(url,{
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })
            Cookies.remove("jwt_token",{path:"/"})
            this.setState({isLoggedOut:true})
        }
        catch(e){
            console.log("delete account error:",e)
            alert("Failed to delete account")
        }
    }
    
    render(){
        const {isLoggedOut}=this.state
        if(isLoggedOut){
            return <Navigate to="/login" replace/>
        } 

        const jwtToken = Cookies.get("jwt_token");
            if (!jwtToken){
                return <Navigate to="/login"/>
            }


        return (
            <div className="home-container">
            <div className="home-header">
                <h1>Welcome to Home</h1>
                <p>Your application's home page</p>
                <div className='buttons-container'>
                    <button type='button' className='logout-btn' onClick={this.logout}>Logout</button>
                    <button type='button' className='delete-btn'onClick={this.deleteAccount} >Delete Account</button>
                </div>
            </div>
            </div>
         )
    }
   
}

export default Home;
