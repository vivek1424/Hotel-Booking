import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import ImagesSection from "./ImagesSection";

export type HotelFormData = {
    _id: string;
    userId: string;
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    adultCount: number;
    childCount: number;
    facilities: string[];
    pricePerNight: number;
    starRating: number;
    imageFiles: FileList;

}

type Props = { 
    onSave: (hotelFormData : FormData)=>void; 
    isLoading: boolean
    
};

const ManageHotelForm = ({onSave, isLoading}: Props) => {
    const formMethods = useForm<HotelFormData>(
        {
            defaultValues: {
              name: "",
              city: "",
              country: "",
              description: "",
              type: "",
              adultCount: 0,
              childCount: 0,
              facilities: [],
              pricePerNight: 0,
              starRating: 0,
              imageFiles: null as any,
            },
          }
    );
    const {handleSubmit} =formMethods;
    const onSubmit =handleSubmit((formDataJson: HotelFormData)=>{
        const formData = new FormData(); //this is inbuilt js method - allows to create object having key value pair 
        //used for multi-part data storage 
        formData.append("name", formDataJson.name);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);
        formData.append("description", formDataJson.description);
        formData.append("type", formDataJson.type);
        formData.append("pricePerNight", formDataJson.pricePerNight.toString());
        formData.append("starRating", formDataJson.starRating.toString());
        formData.append("adultCount", formDataJson.adultCount.toString());
        formData.append("childCount", formDataJson.childCount.toString());

        //put the information of the facilties in the array one by one 
        formDataJson.facilities.forEach((facility, index)=>{
            formData.append(`facilities[${index}]`,facility);
        })

        //convert the image Files into array first since it is of the type file list 
        Array.from(formDataJson.imageFiles).forEach((imageFile)=>{
            formData.append(`imageFiles`, imageFile);            
        })

        //thus onSave will take the parameter from formData
        onSave(formData);
    }) 
    return (
        <FormProvider {...formMethods}>
            <form className="flex flex-col gap-10" onSubmit={onSubmit}>
                <DetailsSection/>
                <TypeSection/>
                <FacilitiesSection/>
                <GuestSection/>
                <ImagesSection/>
                <span className="flex justify-end">
                    <button 
                    disabled={isLoading}
                    type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 
                    disabled:bg-gray-500 text-xl">
                        {isLoading?"Saving...":"Save"}
                        </button>
                </span>
            </form>;
        </FormProvider>

    )


}

export default ManageHotelForm
