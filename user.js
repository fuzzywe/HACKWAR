let map, marker;
let userLocation = null;
let currentSection = 1;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: { lat: 0, lng: 0 },
        styles: [
            {
                featureType: "all",
                elementType: "geometry",
                stylers: [{ color: "#242f3e" }]
            },
            {
                featureType: "all",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#242f3e" }]
            },
            {
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: [{ color: "#746855" }]
            }
        ]
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                map.setCenter(userLocation);
                
                marker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    draggable: true,
                    animation: google.maps.Animation.DROP
                });

                document.getElementById('locationStatus').textContent = 'Location found successfully!';
                document.getElementById('locationStatus').className = 'location-status success';

                google.maps.event.addListener(marker, 'dragend', function() {
                    userLocation = {
                        lat: marker.getPosition().lat(),
                        lng: marker.getPosition().lng()
                    };
                });
            },
            (error) => {
                document.getElementById('locationStatus').textContent = 
                    'Error getting location. Please enable location services or mark your location on the map.';
                document.getElementById('locationStatus').className = 'location-status error';
                
                const defaultLocation = { lat: 0, lng: 0 };
                map.setCenter(defaultLocation);
            }
        );
    }
}

function nextSection(section) {
    if (section === 2 && !document.getElementById('name').value) {
        alert('Please enter your name');
        return;
    }
    
    document.querySelector(`#section${currentSection}`).classList.remove('active');
    document.querySelector(`#section${section}`).classList.add('active');
    
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index < section) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    currentSection = section;
    
    if (section === 3) {
        google.maps.event.trigger(map, 'resize');
        if (userLocation) {
            map.setCenter(userLocation);
        }
    }
}

function prevSection(section) {
    document.querySelector(`#section${currentSection}`).classList.remove('active');
    document.querySelector(`#section${section}`).classList.add('active');
    
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index < section) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    currentSection = section;
}

document.getElementById('sosForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!userLocation) {
        alert('Please allow location access or mark your location on the map');
        return;
    }
    
    const formData = {
        name: document.getElementById('name').value,
        items: {
            groceries: Array.from(document.querySelectorAll('input[name="groceries"]:checked'))
                          .map(cb => cb.value),
            medicine: Array.from(document.querySelectorAll('input[name="medicine"]:checked'))
                         .map(cb => cb.value),
            clothes: Array.from(document.querySelectorAll('input[name="clothes"]:checked'))
                        .map(cb => cb.value)
        },
        additional: document.getElementById('additional').value,
        location: userLocation,
        timestamp: new Date().toISOString(),
        requestId: 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };
    
    const requests = JSON.parse(localStorage.getItem('sosRequests') || '[]');
    requests.push(formData);
    localStorage.setItem('sosRequests', JSON.stringify(requests));
    
    const modal = document.getElementById('successModal');
    document.getElementById('requestId').textContent = formData.requestId;
    modal.style.display = 'block';
    
    window.onclick = function(event) {
        if (event.target == modal) {
            window.location.href = 'index.html';
        }
    };
});

window.onload = initMap;