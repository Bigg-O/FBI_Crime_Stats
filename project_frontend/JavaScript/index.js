document.addEventListener("DOMContentLoaded", main)

function main() {
    fetchStates()
}

function fetchStates() {
    fetch("http://localhost:3000/states")
    .then(response => response.json())
    .then(data => console.log(data))
}