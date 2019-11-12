document.addEventListener("DOMContentLoaded", main)


function main() {
    fetchStates()
    chart()
}

function fetchStates() {
    fetch("http://localhost:3000/states")
    .then(response => response.json())
    .then(function(obj) {
        fbiData(obj)
    })
}

function fbiData(obj) {
    const dropDownDiv = document.querySelector("#myDropdown")
    obj.forEach(state => {
        const dropDown = document.createElement("a")
        dropDown.classList.add('dropdown-item')
        dropDown.dataset.id = state.id
        dropDown.innerHTML = state.name
        myDropdown.append(dropDown)
    })
}

function chart() {
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
}
