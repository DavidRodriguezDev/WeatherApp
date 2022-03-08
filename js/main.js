//Selección de todos los elementos necesarios del DOM

const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.querySelector("#locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");

//Ciudad por defecto cuando cargue la página

let cityInput = "Madrid";

//Función que hace el fetch de la API y enseña todos sus datos

function fetchWeatherData() {
    
    
    const url = `http://api.weatherapi.com/v1/current.json?key=e4ed520ee3414f1880f203442220703&q=${cityInput}`;

    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        console.log(data);

        //Añadimos la temperatura y las condiciones meteorológicas

        temp.innerHTML = data.current.temp_c + "&#176;"
        conditionOutput.innerHTML = data.current.condition.text;

        //Cogemos y extraemos la fecha y hora de la ciudad y la guardamos en diferentes variables.

        const date = data.location.localtime;
        const y = parseInt(date.substr(0,4));
        const m = parseInt(date.substr(5,2));
        const d = parseInt(date.substr(8,2));

        const time = date.substr(11);

        //Transformamos los datos de arriba para hacer una fecha legible y mostrarla. Será el formato: 20:00 - Monday 7, 3 2022.

        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
        timeOutput.innerHTML = time;

        //Añadimos el nombre de la ciudad

        nameOutput.innerHTML = data.location.name;

        //Cogemos el icono correspondiente

        const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);

        icon.src = "/icons/" + iconId;

        //Añadimos los detalles meteorológicos

        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current. humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        //Ponemos "día" por defecto

        let timeOfDay = "day";

        //Cambiamos a noche si así es en la ciudad seleccionada

        if(!data.current.is_day){
            timeOfDay = "night";
        }
        
        //Cogemos el id único para cada condición meteorológica

        const code = data.current.condition.code;


        //Vamos a seleccionar las diferentes fotos de background en función de los códigos adquiridos.

        if(code == 1000) { //Código DESPEJADO
            
            app.style.backgroundImage = `url(/img/${timeOfDay}/clear.jpg)`;  //Foto de tiempo DESPEJADO
            
            btn.style.background = "#e5ba92"; //Cambiamos el background-color del botón en funcion de la foto de fondo y día o noche.
            if(timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        }else if (code == 1003 || code == 1006 || code == 1009 || code ==1030 || code == 1069 || code == 1087 || code == 1135 ||
            code == 1273 || code == 1276 || code == 1279 || code == 1282) {  //Códigos NUBOSO
            
            app.style.backgroundImage = `url(/img/${timeOfDay}/cloudy.jpg)`;  
            
            btn.style.background = "#fa6d1b"; 
            if(timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        }else if (code == 1063 || code == 1069 || code == 1072 || code ==1150 || code == 1153 || code == 1180 || code == 1183 ||
            code == 1186 || code == 1189 || code == 1192  || code == 1195 || code == 1204 || code == 1207 || code == 1240 
            || code == 1243 || code == 1246 || code == 1249 || code == 1252) {  //Códigos LLUVIOSO
            
            app.style.backgroundImage = `url(/img/${timeOfDay}/rainy.jpg)`;  
            
            btn.style.background = "#647d75"; 
            if(timeOfDay == "night") {
                btn.style.background = "#325c80";
            }
        }else { //NEBADO
            app.style.backgroundImage = `url(/img/${timeOfDay}/snowy.jpg)`;  
            
            btn.style.background = "#4d72aa"; 
            if(timeOfDay == "night") {
                btn.style.background = "#1b1b1b";
            } 
        }

        //Hacemos un Fade in una vez la página está hecha

        app.style.opacity = "1";
    })

    //Si los usuarios introducen una ciudad que no existe, lanzamos una alerta

    .catch(() => {
        alert("City not found, please try again");
        app.style.opacity = "1";
    });
}



//Añadir evento click para cada ciudad del panel

cities.forEach( city => {
    city.addEventListener("click", e => {
        
        //Cambiar la ciudad por defecto cuando se haga click en una
        
        cityInput = e.target.innerHTML;

        //Función que hace el fetch y enseña todos los datos de la API

        fetchWeatherData();

        //Animación simple FadeOut de la app

        app.style.opacity = "0";
    });
})

//Añadir un evento submit al formulario

form.addEventListener("submit", e => {

    //Si el campo de texto no está relleno, lanza un alert con un mensaje

    if(search.value.length == 0){
        alert("Please type in a city name");
    } else {
        
        //Cambia la ciudad por defecto a la ciudad que se haya escrito

        cityInput = search.value;

        fetchWeatherData();

        //Se elimina todo el texto escrito en el campo de texto

        search.value = "";

        //Animación simple FadeOut de la app

        app.style.opacity = "0";

        //Prevent Default del formulario

        e.preventDefault();
    };
})

//Función que devuelve el día de la semana desde una fecha

function dayOfTheWeek(day, month, year) {
    
    const weekday = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",];

    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
};

//Llamamos a la funcion

fetchWeatherData();

app.style.opacity = "1";
