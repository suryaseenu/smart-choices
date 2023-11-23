document.addEventListener('DOMContentLoaded', function () {
    const questionTextContainer = document.getElementById('question-text');
    const saveButton = document.getElementById('saveBtn');
    const nextButton = document.getElementById('nextBtn');
    const radioOptions = document.querySelectorAll('input[name="decision"]');

    let questionNumber = 1;

    async function fetchQuestion() {
        try {
            const response = await fetch(`http://localhost:3000/question?questionNumber=${questionNumber}`);
            const data = await response.json();
            questionTextContainer.textContent = data.questionText;
            saveButton.setAttribute('disabled', true);
            radioOptions.forEach(radioOption => {
                radioOption.checked = false;
            });
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    }

    fetchQuestion();

    radioOptions.forEach(radioOption => {
        radioOption.addEventListener('change', function () {
            saveButton.removeAttribute('disabled');
        });
    });

    saveButton.addEventListener('click', function (event) {
        event.preventDefault();
        questionNumber++;
        saveButton.setAttribute('disabled', true);
        nextButton.removeAttribute('disabled');
    });

    nextButton.addEventListener('click', function () {
        questionNumber++;
        fetchQuestion();
        nextButton.setAttribute('disabled', true);
    });
});
