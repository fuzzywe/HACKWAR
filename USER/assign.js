function loadData() {
    const drones = JSON.parse(localStorage.getItem('drones') || '[]');
    const requests = JSON.parse(localStorage.getItem('sosRequests') || '[]');
    
    const droneSelect = document.getElementById('droneSelect');
    const requestSelect = document.getElementById('requestSelect');
    
    // Load drones
    droneSelect.innerHTML = drones
        .filter(drone => drone.battery > 20)
        .map(drone => `
            <option value="${drone.id}">
                Drone ${drone.id} - Battery: ${drone.battery}% - Range: ${drone.range}km
            </option>
        `).join('');
    
    // Load requests
    requestSelect.innerHTML = requests.map((request, index) => `
        <option value="${index}">
            Request #${index + 1} - ${request.name}
        </option>
    `).join('');
}

document.getElementById('assignBtn').addEventListener('click', function() {
    const droneId = document.getElementById('droneSelect').value;
    const requestIndex = document.getElementById('requestSelect').value;
    
    alert('Assignment successful! Drone ' + droneId + ' has been assigned to the request.');
    window.location.href = 'authority.html';
});

// Load data when page loads
window.onload = loadData;