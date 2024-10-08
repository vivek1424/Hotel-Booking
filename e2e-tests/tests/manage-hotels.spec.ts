import {test, expect} from "@playwright/test";
import path from "path"

const UI_URL = "http://localhost:5173/"

test.beforeEach(async({page})=>{
    await page.goto(UI_URL);
  
    //get the sign in button 
    await page.getByRole("link", {name: "Sign In"}).click();
  
    //upon clicking sign in, we need to be sure that we are redirected to sign in 
    //for that check the heading 
    await expect(page.getByRole("heading", {name: "Sign In"})).toBeVisible();
  
    await page.locator("[name=email]").fill("vivekundirwade@gmail.com");
    await page.locator("[name=password]").fill("qwerty123");
  
    //now click the button for sign in  
    await page.getByRole("button", {name: "Login"}).click();
  
    await expect(page.getByText("Sign in succesful")).toBeVisible() ; 
  
})


test("should allow user to add a hotel", async({page})=>{
    await page.goto(`${UI_URL}add-hotel`)

    await page.locator('[name="name"]').fill("Test Hotel");
    await page.locator('[name="city"]').fill("Test City");
    await page.locator('[name="country"]').fill("Test Country");
    await page.locator('[name="description"]').fill("This is a description of the test hotel");
    await page.locator('[name="pricePerNight"]').fill("100");
    await page.selectOption('select[name="starRating"]', "3");
    await page.getByText("Budget").click(); 
    await page.getByLabel("Free Wifi").check();
    await page.getByLabel("Parking").check();
    await page.locator('[name="adultCount"]').fill("2");
    await page.locator('[name="childCount"]').fill("4");

    await page.setInputFiles('[name="imageFiles"]', [
        path.join(__dirname, "files", "img1.jpeg"),
        path.join(__dirname, "files", "img2.jpg")
    ] )


    await page.getByRole('button', {name: "Save"}).click();
    await expect(page.getByText("Hotel Saved")).toBeVisible();

})

test("should display hotels", async({page})=>{
    await page.goto(`${UI_URL}my-hotels`);

    await expect(page.getByRole("heading", {name:"Test Hotel"})).toBeVisible(); 
    await expect(page.getByText("This is a description of")).toBeVisible();
    await expect(page.getByText("Test City, Test Country")).toBeVisible(); 
    await expect(page.getByText("Budget")).toBeVisible();
    await expect(page.getByText("$100 per night")).toBeVisible(); 
    await expect(page.getByText("2 adults, 4 children")).toBeVisible();
    await expect(page.getByText("3 Star Rating")).toBeVisible();
    await expect(page.getByRole("link", {name: "View Details"})).toBeVisible();
    await expect(page.getByRole("link", {name: "Add Hotel"})).toBeVisible();
})


test("should edit hotel", async({page})=>{
    await page.goto(`${UI_URL}my-hotels`);

    await page.getByRole("link", {name: "View Details"}).click();
    await page.waitForSelector('[name="name"]', {state: "attached"})
    await expect(page.locator('[name="name"]')).toHaveValue()
})