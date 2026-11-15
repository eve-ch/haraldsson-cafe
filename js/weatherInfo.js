

//Get city information
export async function getCity(city){
    const base = "https://geocoding-api.open-meteo.com/v1/search";
    const query = `?name=${city}`;

    const response = await fetch(base + query);
    const data = await response.json();

    return (data.results[0]);
}



//Get forecast information
export async function getForecast(latitude, longitude){
    const base = "https://api.open-meteo.com/v1/forecast";
    const query = `?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto&temperature_unit=fahrenheit`;
    const response = await fetch(base + query);
    const data = await response.json();

    return (data);
}

