// Global variables
var currentTheme = 'light';
var savedMessages = [];



function toggleTheme() {
    if (currentTheme === 'light') {
        currentTheme = 'dark';
    } else {
        currentTheme = 'light';
    }
    
    localStorage.setItem('theme', currentTheme);
    
    applyTheme();
    
    
}

function applyTheme() {
    var body = document.body;
    
    if (currentTheme === 'dark') {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }
}

function showSection(sectionName) {
    // Hide all sections first
    var sections = document.querySelectorAll('.section');
    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
    }
    var selectedSection = document.getElementById(sectionName);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    var navLinks = document.querySelectorAll('.nav-link');
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove('active');
    }
    
    // Add active class to the clicked link
    var activeLink = document.querySelector('[onclick="showSection(\'' + sectionName + '\')"]');
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    if (sectionName === 'contact') {
        loadSavedMessages();
    }
}

function validateName(name) {
    if (name.trim() === '') {
        return 'Name is required';
    }
    if (name.trim().length < 2) {
        return 'Name must be at least 2 characters long';
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
        return 'Name can only contain letters and spaces';
    }
    return '';
}

function validateEmail(email) {
    if (email.trim() === '') {
        return 'Email is required';
    }
    var emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(email.trim())) {
        return 'Please enter a valid email address';
    }
    return '';
}

function validateMessage(message) {
    if (message.trim() === '') {
        return 'Message is required';
    }
    if (message.trim().length < 10) {
        return 'Message must be at least 10 characters long';
    }
    if (message.trim().length > 1000) {
        return 'Message must be less than 1000 characters';
    }
    return '';
}

function setupFormValidation() {
    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var messageInput = document.getElementById('message');
    
    // Name validation
    nameInput.addEventListener('input', function() {
        var error = validateName(this.value);
        var errorElement = document.getElementById('name-error');
        
        errorElement.textContent = error;
        if (error) {
            this.classList.add('error');
            this.classList.remove('success');
        } else {
            this.classList.remove('error');
            this.classList.add('success');
        }
    });
    
    emailInput.addEventListener('input', function() {
        var error = validateEmail(this.value);
        var errorElement = document.getElementById('email-error');
        
        errorElement.textContent = error;
        if (error) {
            this.classList.add('error');
            this.classList.remove('success');
        } else {
            this.classList.remove('error');
            this.classList.add('success');
        }
    });
    
    messageInput.addEventListener('input', function() {
        var error = validateMessage(this.value);
        var errorElement = document.getElementById('message-error');
        
        errorElement.textContent = error;
        if (error) {
            this.classList.add('error');
            this.classList.remove('success');
        } else {
            this.classList.remove('error');
            this.classList.add('success');
        }
    });
}
// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;
    
    // Validate all fields
    var nameError = validateName(name);
    var emailError = validateEmail(email);
    var messageError = validateMessage(message);
    
    // Show errors if any
    if (nameError) {
        document.getElementById('name-error').textContent = nameError;
        document.getElementById('name').classList.add('error');
    }
    if (emailError) {
        document.getElementById('email-error').textContent = emailError;
        document.getElementById('email').classList.add('error');
    }
    if (messageError) {
        document.getElementById('message-error').textContent = messageError;
        document.getElementById('message').classList.add('error');
    }
    // If there are errors, don't submit
    if (nameError || emailError || messageError) {
        return;
    }
    // Save the message
    saveMessage(name, email, message);
    // Show success message
    showSuccessMessage();
    // Clear the form
    clearForm();
}
// Save message to localStorage
function saveMessage(name, email, message) {
    var newMessage = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        date: new Date().toLocaleString()
    };
    
    var messages = JSON.parse(localStorage.getItem('feedbackMessages') || '[]');
    
    messages.unshift(newMessage);
    
    if (messages.length > 10) {
        messages = messages.slice(0, 10);
    }
    localStorage.setItem('feedbackMessages', JSON.stringify(messages));
}
function loadSavedMessages() {
    var messages = JSON.parse(localStorage.getItem('feedbackMessages') || '[]');
    var messagesList = document.getElementById('messages-list');
    
    if (messages.length === 0) {
        messagesList.innerHTML = '<div class="no-messages">No messages yet. Be the first to leave feedback!</div>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < messages.length; i++) {
        var msg = messages[i];
        html += '<div class="message-item">';
        html += '<div class="message-header">';
        html += '<span class="message-name">' + escapeHtml(msg.name) + '</span>';
        html += '<span class="message-date">' + msg.date + '</span>';
        html += '</div>';
        html += '<div class="message-email">' + escapeHtml(msg.email) + '</div>';
        html += '<div class="message-text">' + escapeHtml(msg.message) + '</div>';
        html += '</div>';
    }
    
    messagesList.innerHTML = html;
}

function showSuccessMessage() {
    var successMessage = document.getElementById('success-message');
    successMessage.style.display = 'block';
    
    setTimeout(function() {
        successMessage.style.display = 'none';
    }, 5000);
}

function clearForm() {
    document.getElementById('contact-form').reset();
    
    var inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].classList.remove('error', 'success');
    }
    
    var errorMessages = document.querySelectorAll('.error-text');
    for (var i = 0; i < errorMessages.length; i++) {
        errorMessages[i].textContent = '';
    }
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
function getClothingRecommendation(temperature) {
    if (temperature < 15) {
        return "Wear a warm jacket.";
    } else if (temperature >= 15 && temperature < 25) {
        return "Light jacket or sweater.";
    } else {
        return "T-shirt and shorts.";
    }
}
function updateWeatherDisplay(data) {
    var city = data.name;
    var temperature = data.main.temp;
    var weather = data.weather[0].main;
    
    var resultDiv = document.getElementById('weather-result');
    var html = '';
    
    html += '<div class="weather-card city-card">';
    html += '<h3>📍 Location</h3>';
    html += '<p>' + city + '</p>';
    html += '</div>';
    
    html += '<div class="weather-card temp-card">';
    html += '<h3>🌡️ Temperature</h3>';
    html += '<p>' + temperature + '°C</p>';
    html += '</div>';
    
    
    html += '<div class="weather-card weather-card-main">';
    html += '<h3>☁️ Weather</h3>';
    html += '<p>' + weather + '</p>';
    html += '</div>';
    
    html += '<div class="weather-card recommendation-card">';
    html += '<h3>👕 Recommendation</h3>';
    html += '<p>' + getClothingRecommendation(temperature) + '</p>';
    html += '</div>';
    
    resultDiv.innerHTML = html;
}

function getWeather() {
    var cityInput = document.getElementById('city-input');
    var city = cityInput.value.trim();
    
    if (city === '') {
        alert('Please enter a city name.');
        return;
    }
    
    fetchWeatherByCity(city);
}
function fetchWeatherByCity(city) {
    var apiKey = "e43e276b6a85a35682551f79e24d0669";
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",IN&appid=" + apiKey + "&units=metric";
    
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.cod === "404") {
                alert("City not found. Please check spelling.");
                return;
            }
            updateWeatherDisplay(data);
        })
        .catch(function(error) {
            console.error("Error fetching weather:", error);
            alert("Error fetching weather data. Please try again.");
        });
}

function initializeWebsite() {
    
    // Set up form validation
    setupFormValidation();
    
    // Set up form submission
    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    showSection('home');
}

// Start the website when the page is fully loaded
document.addEventListener('DOMContentLoaded', initializeWebsite);
