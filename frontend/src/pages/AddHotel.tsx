import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm"
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from '../api-client'


const AddHotel = () => {
  const {showToast}= useAppContext();
  const {mutate, isLoading} = useMutation(apiClient.addMyHotel, {
    onSuccess: ()=>{
      showToast({message: "Hotel Saved", type: "SUCCESS"})
    },
    onError: (error: any)=>{
      showToast({message: `Error saving hotel": ${error.message}`, type: "ERROR"})  
      
    }
  });

   const handleSave = (hotelFormData : FormData)=>{
     mutate(hotelFormData)
   }
  return <ManageHotelForm onSave={handleSave} isLoading={isLoading}/>;
   
}

export default AddHotel;

