// Global Variables
const API_KEY = "23MwwOlEB8Cnag16MoWiOPrBj1yQucexgv6kkwMM"
const STATES_URL = "http://localhost:3000/states"
const COMMENTS_URL = "http://localhost:3000/comments"
const NATIONAL_CRIME_URL = `https://api.usa.gov/crime/fbi/sapi/api/estimates/national/2018/2018?API_KEY=${API_KEY}`
const NATIONAL_ALL_CRIME_URL = `https://api.usa.gov/crime/fbi/sapi/api/estimates/national/1979/2018?API_KEY=${API_KEY}`
let STATE_CRIMES = {
    "arson": 0, "burglary": 0, "homicide": 0, "larceny": 0, "motor_vehicle_theft": 0, "property_crime": 0, "rape_revised": 0, "robbery": 0, "violent_crime": 0}
let NATIONAL_CRIMES = {
    "arson": 0, "burglary": 0, "homicide": 0, "larceny": 0, "motor_vehicle_theft": 0, "property_crime": 0, "rape_revised": 0, "robbery": 0, "violent_crime": 0}
const CAPITA = 100000
let CHART = null
let LINE_CHART = null
let COMMENT_FORM = null
let UL_COMMENT = null
const YEARS = []
for(i = 1979; i <= 2018; i++){
    YEARS.push(i)}

// MAIN
document.addEventListener("DOMContentLoaded", function() {
    fetchStates()
    fetchNationalData()
    lineChartDataFetch(NATIONAL_ALL_CRIME_URL)
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
        // Event Lisenter for State dropdown
        dropDown.addEventListener("click", function() {
            const filterName = document.querySelector("#dropdownMenuButton")
            filterName.innerHTML = state.name
            fetch(stateCrimeURL(state.abbreviation))
            .then(response => response.json())
            .then(function(stateData) {
                renderStateData(state, stateData)
                lineChartDataFetch(stateCrimeURL(state.abbreviation))
            })
            createCommentForm(state)
        })
    })
}
 
function stateCrimeURL(state) {
    return `https://api.usa.gov/crime/fbi/sapi/api/estimates/states/${state}/2018/2018?API_KEY=${API_KEY}`
}

// State data and Comments
function renderStateData(state, stateData) {
    if (!!UL_COMMENT)
        UL_COMMENT.remove()
    const data = stateData.results.find(function(state) {
        return (state.year == 2018)})
    const pop = data.population
    for (crime in STATE_CRIMES) {
        STATE_CRIMES[crime] = parseInt(((data[crime] * CAPITA) / pop), 10)
    }
    displayChart()

    const stateId = state.id
    const commentContainer = document.querySelector("#comments-container")
    UL_COMMENT = document.createElement("ul")
    UL_COMMENT.classList.add("list-group")
    fetch(`http://localhost:3000/states/${state.id}`)
    .then(resp => resp.json())
    .then(state => {
        state.comments.forEach(comment => {
           const liComment = document.createElement("li")
           liComment.classList.add("list-group-item")
            liComment.innerHTML = state.name +': '+ comment.content
            UL_COMMENT.append(liComment)
            commentContainer.append(UL_COMMENT) 
        })
    })
    const grabCommentForm = document.querySelector("#comment-id")
    grabCommentForm.addEventListener('submit', function(e) {
        e.preventDefault()
        const liNewComment = document.createElement("li")
        liNewComment.classList.add("list-group-item")
        const commentInput = document.querySelector("#form_input").value
        liNewComment.innerHTML = state.name +': '+ commentInput
        UL_COMMENT.append(liNewComment)
        commentContainer.append(UL_COMMENT)      
        fetch(COMMENTS_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                content: commentInput,
                username: "default",
                state_id: stateId
            })
        })
    })
}

// National Data
function fetchNationalData() {
    fetch(NATIONAL_CRIME_URL)
    .then(response => response.json())
    .then(function(data){
        const dataResult = data.results[0]
        const pop = dataResult.population
        for (crime in NATIONAL_CRIMES) {
            NATIONAL_CRIMES[crime] = parseInt(((dataResult[crime] * CAPITA) / pop), 10)
        }
        displayChart()
    })
}

function createCommentForm(state) {
    if (!!COMMENT_FORM)
        COMMENT_FORM.remove()
    const container = document.querySelector("#container")
    COMMENT_FORM = document.createElement("FORM")
    COMMENT_FORM.id = "comment-id"
    const formInput = document.createElement("INPUT")
    const formSubmit = document.createElement("INPUT")
    formInput.type = "text"
    formInput.id = "form_input"
    formSubmit.type = "submit"
    formSubmit.value = "Submit"
    formSubmit.classList.add("blue-button")
    COMMENT_FORM.append(formInput, formSubmit)
    container.append(COMMENT_FORM)
}

function displayChart() {
    if (!!CHART)
        CHART.destroy()
    let chart = document.getElementById('myChart');
    CHART = new Chart(chart, {
        type: 'bar',
        data: {
            labels: [
                'Arson',
                'State Arson',
                'Burglary',
                'State Burglary',
                'Homicide',
                '',
                'Larceny',
                '',
                'MVT',
                '',
                'Property Crime',
                '',
                'Rape',
                '',
                'Robbery',
                '',
                'Violent Crime',
                ''],
            datasets: [{
                label: '# of crimes commited on a National per capita basis',
                data: [
                    NATIONAL_CRIMES.arson, STATE_CRIMES.arson,
                    NATIONAL_CRIMES.burglary, STATE_CRIMES.burglary,
                    NATIONAL_CRIMES.homicide, STATE_CRIMES.homicide,
                    NATIONAL_CRIMES.larceny, STATE_CRIMES.larceny,
                    NATIONAL_CRIMES.motor_vehicle_theft, STATE_CRIMES.motor_vehicle_theft,
                    NATIONAL_CRIMES.property_crime, STATE_CRIMES.property_crime,
                    NATIONAL_CRIMES.rape_revised, STATE_CRIMES.rape_revised,
                    NATIONAL_CRIMES.robbery, STATE_CRIMES.robbery,
                    NATIONAL_CRIMES.violent_crime, STATE_CRIMES.violent_crime],
                backgroundColor: [
                    'rgba(255, 99, 7, 1)',
                    'rgba(0, 0, 0, 255)',
                    'rgba(255, 99, 7, 1)',
                    'rgba(0, 0, 0, 255)',
                    'rgba(255, 99, 7, 1)',
                    'rgba(0, 0, 0, 255)',
                    'rgba(255, 99, 7, 1)',
                    'rgba(0, 0, 0, 255)',
                    'rgba(255, 99, 7, 1)',
                    'rgba(0, 0, 0, 255)',
                    'rgba(255, 99, 7, 1)',
                    'rgba(0, 0, 0, 255)',
                    'rgba(255, 99, 7, 1)',
                    'rgba(0, 0, 0, 255)',
                    'rgba(255, 99, 7, 1)',
                    'rgba(0, 0, 0, 255)',
                    'rgba(255, 99, 7, 1)',
                    'rgba(0, 0, 0, 255)'
                ],
                borderWidth: 1}]},
        options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            },
            title: {
              fontSize: 18,
              display: true,
              text: 'Crime Data',
              position: 'bottom'
            }
        }
    })
}

function lineChartDataFetch(url) {
    let natAllData = []
    fetch(url)
    .then(resp => resp.json())
    .then(function(data){
        //Sorting by years
        YEARS.forEach(function(year){
            for(i = 0; i < data.results.length; i++){
                if (data.results[i].year == year){
                    natAllData.push(data.results[i])
                }
            }
        })
        lineChart(convertData(natAllData))
    })  
}

function convertData(data) {
    result = {
        "arson": 0, "burglary": 0, "homicide": 0, "larceny": 0, "motor_vehicle_theft": 0, "property_crime": 0, "rape_revised": 0, "robbery": 0, "violent_crime": 0}
    singleCrimeData = []
    for (const crime in result) {
        for (i = 0; i < data.length; i++){
            pop = data[i].population
            singleCrimeData.push(parseInt((data[i][crime] * CAPITA)/pop, 10))
        }
        result[crime] = singleCrimeData
        singleCrimeData = []
    }
    return result
}

function lineChart(data) {
    if (!!LINE_CHART)
        LINE_CHART.destroy()
    LINE_CHART = new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
        labels: YEARS,
        datasets: [{
            data: data.arson,
            label: "Arson",
            borderColor: "#3e95cd",
            fill: false
            }, { 
            data: data.burglary,
            label: "Burglary",
            borderColor: "#8e5ea2",
            fill: false
            }, { 
            data: data.homicide,
            label: "Homicide",
            borderColor: "#3cba9f",
            fill: false
            }, { 
            data: data.larceny,
            label: "Larceny",
            borderColor: "#e8c3b9",
            fill: false
            }, { 
            data: data.motor_vehicle_theft,
            label: "Motot-Vehicle-Theft",
            borderColor: "#c45850",
            fill: false
            }, { 
            data: data.property_crime,
            label: "Property-Crime",
            borderColor: "#c45850",
            fill: false
            }, { 
            data: data.rape_revised,
            label: "Rape",
            borderColor: "#c45850",
            fill: false
            }, { 
            data: data.robbery,
            label: "Robbery",
            borderColor: "#c45850",
            fill: false
            }, { 
            data: data.violent_crime,
            label: "Violent-Crime",
            borderColor: "#c45850",
            fill: false
            }
        ]},
        options: {
            title: {
                display: true,
                text: 'DESCRIPTION'}
        }
    })
}