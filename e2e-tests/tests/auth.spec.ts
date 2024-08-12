import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173/"

test('should allow the user to sign in', async ({ page }) => {
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
  await expect(page.getByRole("link", {name: "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link", {name: "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button", {name: "Sign Out"})).toBeVisible();

});

test("should allow user to register", async({page})=>{
  const testEmail = `test_register_${Math.floor(Math.random()*90000)+ 10000}@test.com`
  
  //to go to the URL
  await page.goto(UI_URL);

  //to press any button/other components 
  await page.getByRole("link", {name: "Sign In"}).click();
  await page.getByRole("link", {name: "Create an account here"}).click();
  await expect(page.getByRole("heading", {name: "Create an account"})).toBeVisible();

  //tests where there is to enter details 
  await page.locator("[name=firstName]").fill("VIVEKCHANDRA");
  await page.locator("[name=lastName]").fill("UNDIRWADE");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("qwerty123");
  await page.locator("[name=confirmPassword]").fill("qwerty123");
  
  await page.getByRole("button", {name: "Create Account"}).click();

  await expect(page.getByText("Registration success!")).toBeVisible() ; 
  await expect(page.getByRole("link", {name: "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link", {name: "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button", {name: "Sign Out"})).toBeVisible();

})



