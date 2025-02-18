const drones = [
    {
        id: "DR001",
        battery: 95,
        range: 30,
        image: "https://example.com/drone1.jpg",
        maxWeight: 5
    },
    {
        id: "DR002",
        battery: 88,
        range: 25,
        image: "https://example.com/drone2.jpg",
        maxWeight: 3
    },
    {
        id: "DR003",
        battery: 92,
        range: 28,
        image: "https://example.com/drone3.jpg",
        maxWeight: 4
    },
    // Add more drones to meet the minimum 10 requirement
];

function displayDrones() {
    const dronesList = document.getElementById('dronesList');
    
    dronesList.innerHTML = drones.map(drone => `
        <div class="drone-card">
            <img src="${drone.image}" alt="Drone ${drone.id}">
            <h3>Drone ${drone.id}</h3>
            <p><strong>Battery:</strong> ${drone.battery}%</p>
            <p><strong>Range:</strong> ${drone.range} km</p>
            <p><strong>Max Weight Capacity:</strong> ${drone.maxWeight} kg</p>
            <p><strong>Status:</strong> ${drone.battery > 20 ? 'Available' : 'Charging'}</p>
        </div>
    `).join('');
}

// Store drones in localStorage
localStorage.setItem('drones', JSON.stringify(drones));

// Load drones when page loads
window.onload = displayDrones;