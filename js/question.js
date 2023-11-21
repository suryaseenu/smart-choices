document.addEventListener('DOMContentLoaded', function () {
    const questionTextContainer = document.getElementById('question-text');
  
    // Function to fetch a specific question from the server
    async function fetchQuestion() {
      try {
        // Specify the questionText you want to fetch
        const questionText = 'Is conflict amongst the team over the decision likely?';
  
        // Fetch the question text from the server with the specified questionText
        const response = await fetch(`http://localhost:3000/question?questionText=${encodeURIComponent(questionText)}`);
        const data = await response.json();
  
        // Update the question text in the HTML
        questionTextContainer.textContent = data.questionText;
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    }
  
    // Call the fetchQuestion function when the page loads
    fetchQuestion();
  });