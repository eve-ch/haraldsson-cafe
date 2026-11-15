//Import arrays and functions
import { myFoodItems } from "./foodItems.js";
import { myDessertItems } from "./foodItems.js";
import { myDrinkItems } from "./foodItems.js";
import { getCity } from "./weatherInfo.js";
import { getForecast } from "./weatherInfo.js";

//Getting html elements needed
const foodTable = document.querySelector(".foodMenu");
const drinkTable = document.querySelector(".drinkMenu");
const dessertTable = document.querySelector(".dessertMenu");

let openMenu = document.querySelector(".openMenu");
let navBar = document.querySelector(".nav");
const menuNav = document.querySelector(".menuNav");
const theClass = menuNav.querySelector("a");
const buttons = document.querySelectorAll("[data-carousel-button]");

const cityForm = document.querySelector(".changeLocation");
const weatherCon = document.querySelector(".weatherContainer");
const currentCity = document.querySelector(".city");
const weatherNav = document.querySelector(".weatherNav");
const aClass = weatherNav.querySelector("a");
const reservationForm = document.querySelector("#reservationForm");



//Navigation menu click makes navbar class active or hides it
openMenu.onclick = function(){
    navBar.classList.toggle("active");

}

//For reservation form-demo
function submitHandler(event){
    event.preventDefault();
    window.location.href = "thanks.html";
}

if (reservationForm){
    reservationForm.addEventListener("submit", submitHandler);
}

//When you open the menu page the menu will be created
if (menuNav.className === "menuNav" && theClass.className === "active"){
    getMenu("food", myFoodItems);
    getMenu("dessert", myDessertItems);
    getMenu("drink", myDrinkItems);
}


//Function to get data from the menu array
function getMenu(type, myArray){

    const myMenu = type;
    for (let i = 0; i < myArray.length; i++){
        let myItem = myArray[i].item;
        let myPrice = myArray[i].price;
        let myDescription = myArray[i].description
        AddFood(myMenu, myItem, myPrice, myDescription);
    }
}

//Function to create the html/UI and assign the information
function AddFood(menu, item, price, description){
    let typeOfItem = "";
    let table = foodTable;

    if (menu === "food"){
        table = foodTable;
        typeOfItem = "Food Item";
    }else if (menu === "dessert"){
        table = dessertTable;
        typeOfItem = "Dessert Item";
    }else {
        table = drinkTable;
        typeOfItem = "Drink Item";
    }

    const row1 = document.createElement("tr");
    table.appendChild(row1);

    const foodColumn = document.createElement("td");
    foodColumn.headers = typeOfItem;
    foodColumn.classList = "food";
    foodColumn.innerText = item; 
    const priceColumn = document.createElement("td");
    priceColumn.headers = "Price";
    priceColumn.classList = "price";
    priceColumn.innerText = price;
    row1.appendChild(foodColumn);
    row1.appendChild(priceColumn);

    const row2 = document.createElement("tr");
    table.appendChild(row2);

    const descColumn = document.createElement("td");
    descColumn.headers = "Description";
    descColumn.classList = "description";
    descColumn.colSpan = "2";
    descColumn.innerText = description;
    row2.appendChild(descColumn);

}






//Gallery code for the small screen size
buttons.forEach(button => {
    button.addEventListener("click", () => {

        const offset = button.dataset.carouselButton === "next" ? 1 : -1
        const slides = button.closest("[data-carousel]").querySelectorAll(".slideImage");

        const slidesArray = Array.prototype.slice.call(slides);

        const activeSlide = document.querySelector("[data-active]");

        activeSlide.setAttribute("data-closing", " ");

        activeSlide.addEventListener("animationend", () => {
            activeSlide.removeAttribute("data-closing");



            let newIndex = slidesArray.indexOf(activeSlide) + offset

            if (newIndex < 0) newIndex = 6
            if (newIndex >= 7) newIndex = 0
    
            slidesArray[newIndex].dataset.active = true

            delete activeSlide.dataset.active

        }, {once: true});




    });
})




//Code for the weather page and weather API

//When weatherpage is active the weather elements are created
if (weatherNav.className === "weatherNav" && aClass.className === "active"){

    let city = cityForm.city.value.trim();

    if (city === ""){
        city = "helsingborg";
    }


    updateCity(city)
    .then(data => getData(data))
    .catch(err => errorMessage());




    cityForm.addEventListener("submit", e => {
        //prevent default action
        e.preventDefault();
    
        //get city value
        city = cityForm.city.value.trim();
        cityForm.reset();
    
        //update the UI with the new city
        updateCity(city)
        .then(data => getData(data))
        .catch(err => errorMessage());
    
    })

}


//Code to get the city and forecast
async function updateCity(city){
    const cityDets = await getCity(city);
    const forecast = await getForecast(cityDets.latitude, cityDets.longitude);

    return {cityDets: cityDets, forecast: forecast};
}

const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
};

//Function to create html/UI and assign information
function getData(data){
    const cityDets = data.cityDets;
    const forecast = data.forecast;
    const cityName = cityDets.name;
    let day = new Date();
    let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    weatherCon.innerHTML = "";
    currentCity.innerText = cityName;

    for (let i = 0; i < 5; i++){

        //Assign Data
        const date = forecast.daily.time[i];
        const weatherDesc = weatherDescriptions[forecast.daily.weather_code[i]];
        const minTempFar = forecast.daily.temperature_2m_min[i];
        const maxTempFar = forecast.daily.temperature_2m_max[i];

        let dateCut = date.slice(0, 10);

        const minTemp = fahrenhToCel(minTempFar);
        const maxTemp = fahrenhToCel(maxTempFar);


        //Assign the weekday
        let weekday = weekdays[(day.getDay() + i) % 7];


        //Create and Update UI
        const articleUI = document.createElement("article");
        weatherCon.appendChild(articleUI);

        const dateUI = document.createElement("h3")
        dateUI.innerText = dateCut;

        const tempUI = document.createElement("p");
        tempUI.innerText = minTemp + " - " + maxTemp + " °C";
        tempUI.classList.add("temperature");

        const descUI = document.createElement("p");
        descUI.innerText = weatherDesc;

        const weekdayUI = document.createElement("p");
        weekdayUI.innerText = weekday;
        weekdayUI.classList.add("weekday");

        articleUI.appendChild(dateUI);
        articleUI.appendChild(tempUI);
        articleUI.appendChild(descUI);
        articleUI.appendChild(weekdayUI);
    }
}


//Fahrenheit to celsius convertion function
function fahrenhToCel(farenheit){
    let celsius = 0;
    celsius = (farenheit - 32) * 5/9;
    let celsiusOne = Math.round(celsius);
    return celsiusOne;
}

function errorMessage(){
    weatherCon.innerHTML = "";
    const errorText = document.createElement("p");
    errorText.innerText = "We apologize, something went wrong. Forecast could not load. Please contact us if this issue remains."
    weatherCon.appendChild(errorText);
    
}