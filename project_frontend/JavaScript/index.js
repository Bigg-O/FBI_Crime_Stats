// Global Variables
const API_KEY = "23MwwOlEB8Cnag16MoWiOPrBj1yQucexgv6kkwMM"
const STATES_URL = "http://localhost:3000/states"
const NATIONAL_CRIME_URL = `https://api.usa.gov/crime/fbi/sapi/api/estimates/national/2018/2018?API_KEY=${API_KEY}`
let STATE_CRIMES = {"burglary": 0, "larceny": 0, "robbery": 0}
let NATIONAL_CRIMES = {"burglary": 0, "larceny": 0, "robbery": 0}
let CHART = null

// MAIN
document.addEventListener("DOMContentLoaded", function() {
    fetchStates()
    fetchNationalData()
})

// FUNCTIONS BELOW

function fetchStates() {
    fetch(STATES_URL)
    .then(response => response.json())
    .then(states => createDropdown(states))
}

function createDropdown(states) {
    const dropDownDiv = document.querySelector("#myDropdown")
    states.forEach(state => {
        const dropDown = document.createElement("a")
        dropDown.classList.add('dropdown-item')
        dropDown.dataset.id = state.id
        dropDown.innerHTML = state.name
        dropDownDiv.append(dropDown)
        dropDown.addEventListener("click", function() {
            fetch(stateCrimeURL(state.abbreviation))
            .then(response => response.json())
            .then(stateData => renderStateData(stateData))
        })
    })
}
 
function stateCrimeURL(state) {
    return `https://api.usa.gov/crime/fbi/sapi/api/estimates/states/${state}/2018/2018?API_KEY=${API_KEY}`
}

function renderStateData(stateData) {
    const data = stateData.results.find(function(state) {
        return (state.year == 2018)})
    STATE_CRIMES.burglary = data.burglary
    STATE_CRIMES.larceny = data.larceny
    STATE_CRIMES.robbery = data.robbery
    displayChart()
}

// National Data
function fetchNationalData() {
    fetch(NATIONAL_CRIME_URL)
    .then(response => response.json())
    .then(function(data){
        NATIONAL_CRIMES.burglary = data.results[0].burglary
        NATIONAL_CRIMES.larceny = data.results[0].larceny
        NATIONAL_CRIMES.robbery = data.results[0].robbery
        displayChart()
    })
}

function displayChart() {
    if (!!CHART)
    CHART.destroy()
    let chart = document.getElementById('myChart');

    CHART = new Chart(chart, {
        type: 'bar',
        data: {
            labels: ['natBurglary', 'stateBurglary', 'natLarceny', 'stateLarceny', 'natRobbery', 'stateRobbery'],
            datasets: [{
                label: '# of crimes commited',
                data: [
                    NATIONAL_CRIMES.burglary, STATE_CRIMES.burglary,
                    NATIONAL_CRIMES.larceny, STATE_CRIMES.larceny,
                    NATIONAL_CRIMES.robbery, STATE_CRIMES.robbery],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'],
                borderWidth: 1}]},
        options: {scales: {yAxes: [{ticks: {beginAtZero: true}}]}}
    })
}
