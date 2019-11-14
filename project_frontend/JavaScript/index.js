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
            fetch(stateCrimeURL(state.abbreviation))
            .then(response => response.json())
            .then(function(stateData) {
                renderStateData(state, stateData)
            })
            createComment(state)
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

    const stateId = state.id
    const commentContainer = document.querySelector("#comments-container")
    UL_COMMENT = document.createElement("ul")
    fetch(`http://localhost:3000/states/${state.id}`)
    .then(resp => resp.json())
    .then(state => {
        state.comments.forEach(comment => {
            const liComment = document.createElement("li")
            liComment.innerHTML = comment.content
            UL_COMMENT.append(liComment)
            commentContainer.append(UL_COMMENT) 
        })
    })
    const grabCommentForm = document.querySelector("#comment-id")
    grabCommentForm.addEventListener('submit', function(e) {
        e.preventDefault()
        const liNewComment = document.createElement("li")
        const commentInput = document.querySelector("#form_input").value
        liNewComment.innerHTML = commentInput
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
    })
}

function createComment(state) {
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
                '',
                'Burglary',
                '',
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
                label: '# of crimes commited',
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
        options: {scales: {yAxes: [{ticks: {beginAtZero: true}}]}}
    })
}
