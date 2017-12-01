/**
 * Created by Johanas on 23.11.2017.
 */


function addCountry () {
    let country = prompt("Введите название страны ");
    let capital = prompt("Введите столицу страны ");
    if (country && capital) {
        AddCountry(country, capital);
    } else {
        alert("неверные данные");
    }
}

function getCountry() {
    let country = prompt("Введите название страны ");
    let info = GetCountryInfo(country);
    if (info.slice(0,4) == 'нет ') {
        console.log("нет информации о стране");
    } else {
        alert(info);
    }
}

function listAllCountries() {
    console.log(ListCountrys());
}

function exterminate() {
    let country = prompt("Введите название страны ");
    let info = GetCountryInfo(country);
    if (info.slice(0,4) == 'нет ') {
        console.log("нет информации о стране");
    } else {
        DeleteCountry(country);
    }
}