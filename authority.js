let selectedDroneId = null;
let selectedRequestId = null;
let droneMap = null;
let droneMarker = null;
let requestMarker = null;

// Simulated drone locations (same as before)
const droneLocations = {
    'DR001': { lat: 51.5074, lng: -0.1278 },
    'DR002': { lat: 48.8566, lng: 2.3522 },
    'DR003': { lat: 40.7128, lng: -74.0060 },
    'DR004': { lat: 35.6762, lng: 139.6503 },
    'DR005': { lat: 22.3193, lng: 114.1694 },
    'DR006': { lat: 1.3521, lng: 103.8198 },
    'DR007': { lat: -33.8688, lng: 151.2093 },
    'DR008': { lat: 55.7558, lng: 37.6173 },
    'DR009': { lat: 25.2048, lng: 55.2708 },
    'DR010': { lat: -22.9068, lng: -43.1729 }
};

// Drone data (same as before)
const drones = [
    {
        id: "DR001",
        status: "Available",
        battery: 95,
        range: 30,
        maxWeight: 5
    },
    {
        id: "DR002",
        status: "In Maintenance",
        battery: 20,
        range: 0,
        maxWeight: 3
    },
    {
        id: "DR003",
        status: "Available",
        battery: 88,
        range: 25,
        maxWeight: 4
    },
    {
        id: "DR004",
        status: "Available",
        battery: 92,
        range: 28,
        maxWeight: 6
    },
    {
        id: "DR005",
        status: "On Mission",
        battery: 45,
        range: 15,
        maxWeight: 4
    },
    {
        id: "DR006",
        status: "Available",
        battery: 100,
        range: 35,
        maxWeight: 7
    },
    {
        id: "DR007",
        status: "Low Battery",
        battery: 15,
        range: 5,
        maxWeight: 4
    },
    {
        id: "DR008",
        status: "Available",
        battery: 85,
        range: 22,
        maxWeight: 5
    },
    {
        id: "DR009",
        status: "In Maintenance",
        battery: 0,
        range: 0,
        maxWeight: 6
    },
    {
        id: "DR010",
        status: "Available",
        battery: 90,
        range: 28,
        maxWeight: 5
    }
];

function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'available':
            return 'status-available';
        case 'in maintenance':
            return 'status-maintenance';
        case 'on mission':
            return 'status-mission';
        case 'low battery':
            return 'status-low-battery';
        default:
            return 'status-unavailable';
    }
}

function calculateWeight(items) {
    const weights = {
        groceries: {
            rice: 5.0,
            milk: 1.0,
            bread: 0.5,
            eggs: 1.0,
            vegetables: 2.0,
            fruits: 2.0
        },
        medicine: {
            paracetamol: 0.1,
            antibiotics: 0.1,
            bandages: 0.2,
            firstaid: 1.0,
            painkillers: 0.1
        },
        clothes: {
            tshirts: 0.5,
            pants: 0.7,
            blankets: 2.0,
            warmclothes: 1.5
        }
    };
    
    let totalWeight = 0;
    for (const category in items) {
        items[category].forEach(item => {
            totalWeight += weights[category][item] || 0;
        });
    }
    return totalWeight;
}

function displayRequests() {
    const requests = JSON.parse(localStorage.getItem('sosRequests') || '[]');
    const requestsList = document.getElementById('requestsList');
    
    requestsList.innerHTML = requests.map((request, index) => `
        <div class="request-card">
            <div class="request-header">
                <h3>${request.name}</h3>
                <div class="request-actions">
                    <button class="view-details-btn" onclick="toggleItems(${index})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="assign-btn" onclick="startAssignment(${index})">
                        <i class="fas fa-drone"></i> Assign Drone
                    </button>
                </div>
            </div>
            <div id="items-${index}" class="items-details" style="display: none;">
                ${Object.entries(request.items).map(([category, items]) => `
                    <div class="item-category">
                        <h4>${category.charAt(0).toUpperCase() + category.slice(1)}:</h4>
                        <ul>
                            ${items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
                <p><strong>Total Weight:</strong> ${calculateWeight(request.items).toFixed(1)} kg</p>
                <div class="map-container" id="map-${index}" style="height: 200px; margin: 10px 0;"></div>
            </div>
            <p class="request-timestamp">Requested: ${new Date(request.timestamp).toLocaleString()}</p>
        </div>
    `).join('');

    requests.forEach((request, index) => {
        const map = new google.maps.Map(document.getElementById(`map-${index}`), {
            zoom: 15,
            center: request.location
        });

        new google.maps.Marker({
            position: request.location,
            map: map,
            title: `Request from ${request.name}`
        });
    });
}

function displayDrones() {
    const dronesList = document.getElementById('dronesList');
    
    dronesList.innerHTML = drones.map(drone => `
        <div class="drone-card">
            <div class="drone-header">
                <h3>Drone ${drone.id}</h3>
                <span class="drone-status ${getStatusClass(drone.status)}">${drone.status}</span>
            </div>
            <div class="drone-details">
                <p><i class="fas fa-battery-three-quarters"></i> Battery: ${drone.battery}%</p>
                <p><i class="fas fa-route"></i> Range: ${drone.range} km</p>
                <p><i class="fas fa-weight-hanging"></i> Max Weight: ${drone.maxWeight} kg</p>
            </div>
        </div>
    `).join('');
}

function startAssignment(requestIndex) {
    const requests = JSON.parse(localStorage.getItem('sosRequests') || '[]');
    const request = requests[requestIndex];
    selectedRequestId = requestIndex;
    
    const modal = document.getElementById('assignmentModal');
    modal.style.display = 'block';
    
    // Show request details
    document.getElementById('requestDetails').innerHTML = `
        <h3>Request Details</h3>
        <p><strong>Name:</strong> ${request.name}</p>
        <p><strong>Total Weight:</strong> ${calculateWeight(request.items).toFixed(1)} kg</p>
    `;
    
    // Show available drones
    document.getElementById('droneDetails').innerHTML = `
        <h3>Select Drone</h3>
        <select id="droneSelect" onchange="updateSelectedDrone(this.value)">
            <option value="">Select a drone...</option>
            ${drones
                .filter(drone => drone.status === 'Available')
                .map(drone => `
                    <option value="${drone.id}">
                        Drone ${drone.id} - Battery: ${drone.battery}% - Range: ${drone.range}km
                    </option>
                `).join('')}
        </select>
    `;
    
    // Initialize map
    if (!droneMap) {
        droneMap = new google.maps.Map(document.getElementById('droneMap'), {
            zoom: 12,
            center: request.location
        });
    }
    
    // Show request location
    if (requestMarker) requestMarker.setMap(null);
    requestMarker = new google.maps.Marker({
        position: request.location,
        map: droneMap,
        title: `Request from ${request.name}`
    });
    
    droneMap.setCenter(request.location);
}

function updateSelectedDrone(droneId) {
    selectedDroneId = droneId;
    
    if (!droneId) {
        if (droneMarker) droneMarker.setMap(null);
        return;
    }
    
    // Update drone marker
    if (droneMarker) droneMarker.setMap(null);
    
    droneMarker = new google.maps.Marker({
        position: droneLocations[droneId],
        map: droneMap,
        title: `Drone ${droneId}`,
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/helicopter.png',
            scaledSize: new google.maps.Size(32, 32)
        }
    });
    
    // Fit bounds to show both markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(requestMarker.getPosition());
    bounds.extend(droneMarker.getPosition());
    droneMap.fitBounds(bounds);
}

function confirmAssignment() {
    if (!selectedDroneId || selectedRequestId === null) {
        alert('Please select a drone first');
        return;
    }
    
    // Update drone status
    const droneIndex = drones.findIndex(d => d.id === selectedDroneId);
    if (droneIndex !== -1) {
        drones[droneIndex].status = 'On Mission';
    }
    
    // Remove request from list
    const requests = JSON.parse(localStorage.getItem('sosRequests') || '[]');
    requests.splice(selectedRequestId, 1);
    localStorage.setItem('sosRequests', JSON.stringify(requests));
    
    alert(`Drone ${selectedDroneId} has been assigned to the request and is now on mission.`);
    document.getElementById('assignmentModal').style.display = 'none';
    
    // Refresh displays
    displayRequests();
    displayDrones();
}

function toggleItems(index) {
    const itemsDiv = document.getElementById(`items-${index}`);
    itemsDiv.style.display = itemsDiv.style.display === 'none' ? 'block' : 'none';
}

// Close modal when clicking the close button
document.querySelector('.close-btn')?.addEventListener('click', () => {
    document.getElementById('assignmentModal').style.display = 'none';
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('assignmentModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Load data when page loads
window.onload = () => {
    displayRequests();
    displayDrones();
};