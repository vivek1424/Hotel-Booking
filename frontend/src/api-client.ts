import { RegisterFormData } from "./pages/Register"
import { SignInFormData } from "./pages/SignIn";
import {HotelSearchResponse, HotelType, paymentIntentResponse, UserType} from '../../backend/src/shared/types';
import { BookingFormData } from "./forms/BookingForm/BookingForm";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || " ";


export const fetchCurrentUser = async():Promise<UserType>=>{
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        credentials: "include"
    })
    if(!response.ok){
        throw new Error("Error fetching user")
    }
    return response.json();
}


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

export const fetchMyHotels = async(): Promise<HotelType[]>=>{
    const response= await fetch(`${API_BASE_URL}/api/my-hotels`, {
        credentials:"include"
    });
    if(!response.ok){
        throw new Error("Error fetching hotels")
    }

    return response.json();
}


export const fetchMyHotelById = async(hotelId: string): Promise<HotelType>=>{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
        credentials: "include"
    })
    if(!response.ok){
        throw new Error("Error fetching hotels");
    }

    return response.json();
}


export const updateMyHotelById = async(hotelFormData : FormData )=>{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`, {
        method: "PUT",
        body: hotelFormData,
        credentials:"include"
    });

    if(!response.ok){
        throw new Error("Failed to update hotel");
    }

    return response.json();
}

export type SearchParams = { 
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilities? : string[];
    types? : string[];
    stars? : string[];
    maxPrice? : string;
    sortOption? : string;
}

export const searchHotels = async(searchParams : SearchParams): Promise<HotelSearchResponse>=>{
    //this is the js default method, helps us in working with the dynamic urls 
    const queryParams = new URLSearchParams(); 
    queryParams.append("destination", searchParams.destination || " ");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");

    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOption || "");

    searchParams.facilities?.forEach((facility)=>{ queryParams.append("facilities", facility)})
    

    searchParams.types?.forEach((type)=> {
        queryParams.append("types", type)
     })

     searchParams.stars?.forEach((star)=> {
        queryParams.append("stars", star)
     })

    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`)

    if(!response.ok){
        throw new Error("Error in fetching the hotels ")
    }
    return response.json();
}


export const fetchHotelById = async( hotelId: string): Promise<HotelType>=>{
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
    if(!response.ok){
        throw new Error("Error fetching hotels");
    }
    return response.json();
} 

export const createPaymentIntent = async(hotelId: string, numberOfNights: string) : Promise<paymentIntentResponse> =>{
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({numberOfNights}),
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(!response.ok){
        throw new Error("Error fetching payment intent")
    }

    return response.json();
}


export const createRoomBooking = async( formData : BookingFormData )=>{ 
    const response = await fetch(`${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`, {
        method: "POST",
        headers:{ 
            "Content-Type":"application/json"
        },
        credentials: "include",
        body: JSON.stringify(formData)
    })

    if(!response.ok){
        const errorDetails = await response.json();
        console.error("Error booking room:", errorDetails);
        throw new Error("Error booking room")
    }
    
}


export const fetchMyBookings = async(): Promise<HotelType[]>=> { 
    const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
        credentials: "include"
    })
    if(!response.ok){
        throw new Error("Unable to fetch bookings")
    }
    return response.json();
}