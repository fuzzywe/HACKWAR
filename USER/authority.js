let currentStep = 1;
let selectedUser = null;
let selectedDrone = null;
let droneMap = null;

// Drone locations and data remain the same as in your existing code
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

function displayUserRequests() {
    const requests = JSON.parse(localStorage.getItem('sosRequests') || '[]');
    const container = document.querySelector('.user-requests');
    
    container.innerHTML = requests.map((request, index) => `
        <div class="user-card">
            <div class="user-info">
                <h3>${request.name}</h3>
                <button onclick="showDetails(${index})" class="icon-btn">
                    <i class="fas fa-info-circle"></i>
                </button>
            </div>
            <button onclick="selectUser(${index})" class="select-btn">
                Select User <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `).join('');
}

function showDetails(index) {
    const requests = JSON.parse(localStorage.getItem('sosRequests') || '[]');
    const request = requests[index];
    const modal = document.getElementById('detailsModal');
    
    document.getElementById('userDetails').innerHTML = `
        <h2>${request.name}'s Request Details</h2>
        ${Object.entries(request.items).map(([category, items]) => `
            <div class="detail-category">
                <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <ul>
                    ${items.map(item => <li>${item}</li>).join('')}
                </ul>
            </div>
        `).join('')}
    `;
    
    modal.style.display = 'block';
}

function selectUser(index) {
    const requests = JSON.parse(localStorage.getItem('sosRequests') || '[]');
    selectedUser = requests[index];
    nextStep();
}

function displayDrones() {
    const container = document.querySelector('.available-drones');
    
    container.innerHTML = drones
        .filter(drone => drone.status === 'Available')
        .map(drone => `
            <div class="drone-card">
                <div class="drone-info">
                    <h3>Drone ${drone.id}</h3>
                    <div class="drone-stats">
                        <p><i class="fas fa-battery-three-quarters"></i> ${drone.battery}%</p>
                        <p><i class="fas fa-route"></i> ${drone.range}km</p>
                        <p><i class="fas fa-weight-hanging"></i> ${drone.maxWeight}kg</p>
                    </div>
                </div>
                <button onclick="selectDrone('${drone.id}')" class="select-btn">
                    Select Drone <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `).join('');
}

function selectDrone(droneId) {
    selectedDrone = drones.find(d => d.id === droneId);
    nextStep();
    initMap();
}

function initMap() {
    if (!droneMap) {
        droneMap = new google.maps.Map(document.getElementById('droneMap'), {
            zoom: 12,
            center: droneLocations[selectedDrone.id]
        });
    }

    // Show drone location
    new google.maps.Marker({
        position: droneLocations[selectedDrone.id],
        map: droneMap,
        title: Drone ${selectedDrone.id},
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/helicopter.png',
            scaledSize: new google.maps.Size(32, 32)
        }
    });

    // Show user location
    new google.maps.Marker({
        position: selectedUser.location,
        map: droneMap,
        title: Request from ${selectedUser.name}
    });

    // Fit bounds to show both markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(droneLocations[selectedDrone.id]);
    bounds.extend(selectedUser.location);
    droneMap.fitBounds(bounds);

    // Update info panels
    document.getElementById('selectedUserInfo').innerHTML = `
        <h3>Selected User</h3>
        <p>${selectedUser.name}</p>
    `;

    document.getElementById('selectedDroneInfo').innerHTML = `
        <h3>Selected Drone</h3>
        <p>Drone ${selectedDrone.id} - Battery: ${selectedDrone.battery}%</p>
    `;
}

function displayConfirmation() {
    document.getElementById('finalUserDetails').innerHTML = `
        <h3>User Details</h3>
        <p><strong>Name:</strong> ${selectedUser.name}</p>
        <div class="items-summary">
            ${Object.entries(selectedUser.items).map(([category, items]) => `
                <div class="category-summary">
                    <h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                    <p>${items.length} items selected</p>
                </div>
            `).join('')}
        </div>
    `;

    document.getElementById('finalDroneDetails').innerHTML = `
        <h3>Drone Details</h3>
        <p><strong>ID:</strong> ${selectedDrone.id}</p>
        <p><strong>Battery:</strong> ${selectedDrone.battery}%</p>
        <p><strong>Range:</strong> ${selectedDrone.range}km</p>
        <p><strong>Max Weight:</strong> ${selectedDrone.maxWeight}kg</p>
    `;
}

function confirmAssignment() {
    // Calculate estimated time (simulated)
    const estimatedTime = Math.floor(Math.random() * 20) + 10;
    
    // Update drone status
    const droneIndex = drones.findIndex(d => d.id === selectedDrone.id);
    if (droneIndex !== -1) {
        drones[droneIndex].status = 'On Mission';
    }
    
    // Remove request from storage
    const requests = JSON.parse(localStorage.getItem('sosRequests') || '[]');
    const userIndex = requests.findIndex(r => r.name === selectedUser.name);
    if (userIndex !== -1) {
        requests.splice(userIndex, 1);
        localStorage.setItem('sosRequests', JSON.stringify(requests));
    }
    
    alert(Assignment Successful!\nDrone ${selectedDrone.id} has been assigned to ${selectedUser.name}.\nEstimated delivery time: ${estimatedTime} minutes);
    window.location.reload();
}

function nextStep() {
    if (currentStep < 4) {
        document.getElementById(step${currentStep}).classList.remove('active');
        currentStep++;
        document.getElementById(step${currentStep}).classList.add('active');
        
        if (currentStep === 4) {
            displayConfirmation();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.getElementById(step${currentStep}).classList.remove('active');
        currentStep--;
        document.getElementById(step${currentStep}).classList.add('active');
    }
}

// Close modal when clicking the close button
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('detailsModal').style.display = 'none';
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('detailsModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Initialize the page
window.onload = () => {
    displayUserRequests();
    displayDrones();
};