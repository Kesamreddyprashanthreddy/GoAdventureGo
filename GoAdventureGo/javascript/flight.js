let step = 0;
let bookingDetails = {
    departure: '',
    arrival: '',
    departureDate: '',
    returnDate: '',
    passengers: '',
    travelClass: ''
};

function toggleChatbot() {
    const chatbotContainer = document.querySelector('.chatbot-container');
    const openChatbotBtn = document.querySelector('.open-chatbot-btn');
    chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'flex' : 'none';
    openChatbotBtn.style.display = openChatbotBtn.style.display === 'none' ? 'block' : 'none';
}

function handleUserInput() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (message) {
        displayUserMessage(message);
        processChatbotResponse(message);
        userInput.value = '';
    }
}

function displayUserMessage(message) {
    const chatbotBody = document.getElementById('chatbotBody');
    const userMessage = document.createElement('div');
    userMessage.className = 'chatbot-message user-message';
    userMessage.textContent = message;
    chatbotBody.appendChild(userMessage);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function displayBotMessage(message) {
    const chatbotBody = document.getElementById('chatbotBody');
    const botMessage = document.createElement('div');
    botMessage.className = 'chatbot-message bot-message';
    botMessage.textContent = message;
    chatbotBody.appendChild(botMessage);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function processChatbotResponse(message) {
    switch(step) {
        case 0:
            bookingDetails.departure = message;
            displayBotMessage("Great! Now, where would you like to fly to?");
            step++;
            break;
        case 1:
            bookingDetails.arrival = message;
            displayBotMessage("When would you like to depart? Please enter a date (YYYY-MM-DD).");
            step++;
            break;
        case 2:
            bookingDetails.departureDate = message;
            displayBotMessage("Would you like to book a return flight? If yes, please enter the return date (YYYY-MM-DD). Otherwise, type 'no'.");
            step++;
            break;
        case 3:
            if (message.toLowerCase() !== 'no') {
                bookingDetails.returnDate = message;
            } else {
                bookingDetails.returnDate = 'One-way';
            }
            displayBotMessage("How many passengers are traveling?");
            step++;
            break;
        case 4:
            bookingDetails.passengers = message;
            displayBotMessage("What class would you like to travel in? (Economy, Business, First)");
            step++;
            break;
        case 5:
            bookingDetails.travelClass = message;
            displayBotMessage("Thank you! Here are your flight booking details:");
            displayBookingSummary();
            step++;
            break;
        default:
            displayBotMessage("Is there anything else I can assist you with?");
    }
}

function displayBookingSummary() {
    displayBotMessage(`Departure: ${bookingDetails.departure}`);
    displayBotMessage(`Arrival: ${bookingDetails.arrival}`);
    displayBotMessage(`Departure Date: ${bookingDetails.departureDate}`);
    if (bookingDetails.returnDate !== 'One-way') {
        displayBotMessage(`Return Date: ${bookingDetails.returnDate}`);
    }
    displayBotMessage(`Passengers: ${bookingDetails.passengers}`);
    displayBotMessage(`Class: ${bookingDetails.travelClass}`);
}

// Initialize chatbot as hidden
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.chatbot-container').style.display = 'none';
});
