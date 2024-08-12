/** @type {import('tailwindcss').Config} */
export default {
  //this gives what are the types of files we want to apply tailwind css to 
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    container:{
      //this creates extra padding for the container everytime it is used 
      padding: {
        md: "10rem"
      }
    }
  },
  plugins: [],
}

