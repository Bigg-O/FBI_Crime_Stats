// Global Variables
const API_KEY = "23MwwOlEB8Cnag16MoWiOPrBj1yQucexgv6kkwMM"
const STATES_URL = "http://localhost:3000/states"
const COMMENTS_URL = "http://localhost:3000/comments"
const NATIONAL_CRIME_URL = `https://api.usa.gov/crime/fbi/sapi/api/estimates/national/2018/2018?API_KEY=${API_KEY}`
let STATE_CRIMES = {
    "arson": 0, "burglary": 0, "homicide": 0, "larceny": 0, "motor_vehicle_theft": 0, "property_crime": 0, "rape_revised": 0, "robbery": 0, "violent_crime": 0}
let NATIONAL_CRIMES = {
    "arson": 0, "burglary": 0, "homicide": 0, "larceny": 0, "motor_vehicle_theft": 0, "property_crime": 0, "rape_revised": 0, "robbery": 0, "violent_crime": 0}
const CAPITA = 100000
let CHART = null
let COMMENT_FORM = null
let UL_COMMENT = null


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
        // Event Lisenter for State dropdown
        dropDown.addEventListener("click", function() {
            const filterName = document.querySelector("#dropdownMenuButton")
            filterName.innerHTML = state.name
            fetch(stateCrimeURL(state.abbreviation))
            .then(response => response.json())
            .then(stateData => renderStateData(state, stateData))
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
    STATE_CRIMES.arson = parseInt(((data.arson * CAPITA) / pop), 10)
    STATE_CRIMES.burglary = parseInt(((data.burglary * CAPITA) / pop), 10)
    STATE_CRIMES.homicide = parseInt(((data.homicide * CAPITA) / pop), 10)
    STATE_CRIMES.larceny = parseInt(((data.larceny * CAPITA) / pop), 10)
    STATE_CRIMES.motor_vehicle_theft = parseInt(((data.motor_vehicle_theft * CAPITA) / pop), 10)
    STATE_CRIMES.property_crime = parseInt(((data.property_crime * CAPITA) / pop), 10)
    STATE_CRIMES.rape_revised = parseInt(((data.rape_revised * CAPITA) / pop), 10)
    STATE_CRIMES.robbery = parseInt(((data.robbery * CAPITA) / pop), 10)
    STATE_CRIMES.violent_crime = parseInt(((data.violent_crime * CAPITA) / pop), 10)
    displayChart()
    lineChart()

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
           commentContainer.innerHTML = 
           '<h3>Comments:</h3>'
            liComment.innerHTML = comment.username +': '+ comment.content
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
        const uNameInput = document.querySelector("#user_name_input").value
        liNewComment.innerHTML = uNameInput +': '+ commentInput
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
                username: uNameInput,
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
        NATIONAL_CRIMES.arson = parseInt(((dataResult.arson * CAPITA) / pop), 10)
        NATIONAL_CRIMES.burglary = parseInt(((dataResult.burglary * CAPITA) / pop), 10)
        NATIONAL_CRIMES.homicide = parseInt(((dataResult.homicide * CAPITA) / pop), 10)
        NATIONAL_CRIMES.larceny = parseInt(((dataResult.larceny * CAPITA) / pop), 10)
        NATIONAL_CRIMES.motor_vehicle_theft = parseInt(((dataResult.motor_vehicle_theft * CAPITA) / pop), 10)
        NATIONAL_CRIMES.property_crime = parseInt(((dataResult.property_crime * CAPITA) / pop), 10)
        NATIONAL_CRIMES.rape_revised = parseInt(((dataResult.rape_revised * CAPITA) / pop), 10)
        NATIONAL_CRIMES.robbery = parseInt(((dataResult.robbery * CAPITA) / pop), 10)
        NATIONAL_CRIMES.violent_crime = parseInt(((dataResult.violent_crime * CAPITA) / pop), 10)
        displayChart()
        lineChart()
    })
}

function createCommentForm(state) {
    if (!!COMMENT_FORM)
        COMMENT_FORM.remove()
    const container = document.querySelector("#container")
    container.innerHTML = "<h2> Your Thoughts</h2>"
    COMMENT_FORM = document.createElement("FORM")
    COMMENT_FORM.id = "comment-id"
    const userNameInput = document.createElement("input")
    const formInput = document.createElement("INPUT")
    const formSubmit = document.createElement("INPUT")
    userNameInput.type = "text"
    formInput.type = "text"
    formInput.id = "form_input"
    userNameInput.id = "user_name_input"
    formSubmit.type = "submit"
    formSubmit.value = "Submit"
    formSubmit.classList.add("blue-button")
    COMMENT_FORM.append(userNameInput, formInput, formSubmit)
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
function lineChart() {
new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
      labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
      datasets: [{ 
          data: [86,114,106,106,107,111,133,221,783,2478],
          label: "Africa",
          borderColor: "#3e95cd",
          fill: false
        }, { 
          data: [282,350,411,502,635,809,947,1402,3700,5267],
          label: "Asia",
          borderColor: "#8e5ea2",
          fill: false
        }, { 
          data: [168,170,178,190,203,276,408,547,675,734],
          label: "Europe",
          borderColor: "#3cba9f",
          fill: false
        }, { 
          data: [40,20,10,16,24,38,74,167,508,784],
          label: "Latin America",
          borderColor: "#e8c3b9",
          fill: false
        }, { 
          data: [6,3,2,2,7,26,82,172,312,433],
          label: "North America",
          borderColor: "#c45850",
          fill: false
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'World population per region (in millions)'
      }
    }
  })
}

