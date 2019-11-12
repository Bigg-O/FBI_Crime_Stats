// Global Variables
const API_KEY = "23MwwOlEB8Cnag16MoWiOPrBj1yQucexgv6kkwMM"
const STATES_URL = "http://localhost:3000/states"
const NATIONAL_CRIME_URL = `https://api.usa.gov/crime/fbi/sapi/api/estimates/national/2018/2018?API_KEY=${API_KEY}`
const CRIMES = ["burglary", "larceny", "robbery"]

// MAIN
document.addEventListener("DOMContentLoaded", function() {
    fetchData(NATIONAL_CRIME_URL)
    fetchStateCrimeData("WA", CRIMES[2])
})

// Functions BELOW

function fetchData(url) {
    let result
    fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
}

function stateCrimeURL(state, crime) {
    return `https://api.usa.gov/crime/fbi/sapi/api/summarized/state/${state}/${crime}/2018/2018?API_KEY=${API_KEY}`
}

function fetchStateCrimeData(state, crime) {
    fetch(stateCrimeURL(state, crime))
    .then(response => response.json())
    .then(oris => renderData(oris.results))
}

function renderData(orisData) {
    let actual = 0
    let cleared = 0
    orisData.forEach(function(oriData){
        actual += oriData.actual
        cleared += oriData.cleared
    })
    console.log(`combined actual = ${actual}`)
    console.log(`combined cleared = ${cleared}`)
    console.log(`cleared percentage = ${(cleared/actual)*100}`)
}