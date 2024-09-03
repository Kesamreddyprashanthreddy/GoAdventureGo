
//Day Mode

$(document).ready(function(){
    $('.mode').change(function(){
      if($(this).prop('checked')){
        $('.header').css('background-image', "url('css/images/daya.jpg')");
        $('.fwall').css('background-image', "url('css/images/dayb.jpg')");
        $('body').css('background-color', "white");
        $('.mirado').css('color', "white");
        $('.card-body').css('background-color', "white");
        $('h3').css('color', "black");
        $('p').css('color', "black");
      }
      else{
        $('.header').css('background-image', "url('css/images/night.jpg')");
        $('.fwall').css('background-image', "url('css/images/Mountain.jpg')");
        $('body').css('background-color', "black");
        $('.card-body').css('background-color', "black");
        $('h3').css('color', "white");
        $('p').css('color', "white");
      }
    });
});
$('.navbar-toggler-icon').click(function(){
  var get = $('.map');
  var gett = $('.maplink');
  get.remove();
  gett.remove();
});

//chat  bot
// function toggleChatbot() {
//   const chatbotContainer = document.querySelector('.chatbot-container');
//   const openChatbotBtn = document.querySelector('.open-chatbot-btn');
//   chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'flex' : 'none';
//   openChatbotBtn.style.display = openChatbotBtn.style.display === 'none' ? 'block' : 'none';
// }

// function sendMessage() {
//   const userInput = document.getElementById('userInput');
//   const message = userInput.value.trim();
//   if (message) {
//       const chatbotBody = document.getElementById('chatbotBody');

//       const userMessage = document.createElement('div');
//       userMessage.className = 'chatbot-message user-message';
//       userMessage.textContent = message;
//       chatbotBody.prepend(userMessage);

      
//       userInput.value = '';

//       setTimeout(() => {
//           const botMessage = document.createElement('div');
//           botMessage.className = 'chatbot-message bot-message';
//           botMessage.textContent = 'Thank you for your message! How can I assist further?';
//           botMessage.textContent ='paris,italy,spain,france,germany,switzerland,usa,canada,australia,india,thailand,japan,china';
//           chatbotBody.prepend(botMessage);
//       }, 1000);
//   }
// }

// document.addEventListener('DOMContentLoaded', () => {
//   document.querySelector('.chatbot-container').style.display = 'none';
// });



function toggleChatbot() {
  const chatbotContainer = document.querySelector('.chatbot-container');
  const openChatbotBtn = document.querySelector('.open-chatbot-btn');
  chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'flex' : 'none';
  openChatbotBtn.style.display = openChatbotBtn.style.display === 'none' ? 'block' : 'none';
}

function sendMessage() {
  const userInput = document.getElementById('userInput');
  const message = userInput.value.trim();
  if (message) {
      const chatbotBody = document.getElementById('chatbotBody');

      // Add user message to the chat
      const userMessage = document.createElement('div');
      userMessage.className = 'chatbot-message user-message';
      userMessage.textContent = message;
      chatbotBody.prepend(userMessage);

      // Clear the input
      userInput.value = '';

      // Generate bot response based on user message
      const botResponse = generateBotResponse(message);

      // Display bot response
      setTimeout(() => {
          const botMessage = document.createElement('div');
          botMessage.className = 'chatbot-message bot-message';
          botMessage.textContent = botResponse;
          chatbotBody.prepend(botMessage);
      }, 1000);
  }
}

function generateBotResponse(userMessage) {
  // Simple predefined responses based on user input
  const responses = {
      "hello": "Hi there! How can I help you today?",
      "hi": "Hello! What can I do for you?",
      "book a hotel": "Sure! I can help you with hotel bookings. Which city are you interested in?",
      "book a flight": "I can assist with flight bookings. Where would you like to go?",
      "thank you": "You're welcome! If you have any more questions, feel free to ask.",
      "bye": "Goodbye! Have a great day!"
  };

  // Convert user message to lowercase for case-insensitive matching
  const lowerCaseMessage = userMessage.toLowerCase();

  // Return the response if it matches a known command, otherwise a default response
  return responses[lowerCaseMessage] || "Sorry, I didn't understand that. Could you please rephrase?";
}

// Initialize chatbot as hidden
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.chatbot-container').style.display = 'none';
});


