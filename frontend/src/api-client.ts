import { RegisterFormData } from "./pages/Register"
import { SignInFormData } from "./pages/SignIn";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || " ";

 //this code defines register functin to handle user registration, sending post request
export const register = async(formData: RegisterFormData)=>{
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        credentials:"include", //include the cookies with request
        headers:{
            "Content-Type":"application/json"
        },
        //sends the user data as json string in request body
        body: JSON.stringify(formData)
    })

    const responseBody = await response.json();

    if(!response.ok){
        throw new Error(responseBody.message)
    }
};

export const signIn = async(formData: SignInFormData)=>{
     const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(formData)
     })

     const responseBody = await response.json();
     if(!response.ok){
        throw new Error(responseBody.message)
     }


     //this responsebody contains the server's response 
     return responseBody; 
}

export const validateToken = async ()=>{
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: "include" 
    })

    if(!response.ok){
        throw new Error("token invalid ")
    }
    return response.json() 
}

export const signOut = async()=>{
    const response =await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST", //since we are providing an empty token, which will ensure in logging out 
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Error during the signout attempt");
    }
}


export const addMyHotel = async(hotelFormData : FormData)=>{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method: "POST",
        credentials: "include",
        body: hotelFormData
    });

    if(!response.ok){
        throw new Error("Failed to add hotel");
    }
    
    
    //understand why this is returned 
    return response.json(); 
}