import { getSessionUser, getSessionLastQuestionNumber } from './utils.js';

function showPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}

document.getElementById('helpBtn').addEventListener('click', showPopup);

document.addEventListener('DOMContentLoaded', async function () {

    async function fetchQuestion() {
        try {
            const response = await fetch(`http://localhost:3000/question?questionNumber=${questionNumber}`);
            const data = await response.json();
            questionTextContainer.textContent = data.questionText;
            saveButton.setAttribute('disabled', true);
            radioOptions.forEach(radioOption => {
                radioOption.disabled = false;
            });
            radioOptions.forEach(radioOption => {
                radioOption.checked = false;
            });

            // Check if it's the last question
            if (questionNumber === lastQuestionNumber.lastQuestionNum) {
                // Make the "Finish Survey" button visible
                document.getElementById('finishSurveyBtn').style.display = 'inline-block';
            } else {
                // Hide the "Finish Survey" button
                document.getElementById('finishSurveyBtn').style.display = 'none';
            }

        } catch (error) {
            console.error('Error fetching question:', error);
        }
    }

    await getSessionLastQuestionNumber();

    const questionTextContainer = document.getElementById('question-text');
    const saveButton = document.getElementById('saveBtn');
    const nextButton = document.getElementById('nextBtn');
    const radioOptions = document.querySelectorAll('input[name="decision"]');

    const user = await getSessionUser();
    console.log(user);

    const lastQuestionNumber = await getSessionLastQuestionNumber();
    console.log(lastQuestionNumber);

    let questionNumber = 1;

    fetchQuestion();

    radioOptions.forEach(radioOption => {
        radioOption.addEventListener('change', function () {
            saveButton.removeAttribute('disabled');
        });
    });

    saveButton.addEventListener('click', async function (event) {
        event.preventDefault();

        const selectedOption = document.querySelector('input[name="decision"]:checked');
        if (!selectedOption) {
            alert('Please select a response.');
            return;
        }

        const responseValue = selectedOption.value;

        const responseData = {
            userId: user._id,
            questionNumber,
            response: responseValue,
        };

        try {
            const response = await fetch('http://localhost:3000/saveResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responseData),
            });

            if (response.ok) {
                console.log('Response saved successfully.');
            } else {
                console.error('Failed to save response.');
            }
        } catch (error) {
            console.error('Error saving response:', error);
        }

        saveButton.setAttribute('disabled', true);
        radioOptions.forEach(radioOption => {
            radioOption.disabled = true;
        });
        if (questionNumber === lastQuestionNumber.lastQuestionNum) {

        } else {
            nextButton.removeAttribute('disabled');
        }

    });

    nextButton.addEventListener('click', function () {
        questionNumber++;
        fetchQuestion();
        nextButton.setAttribute('disabled', true);
    });

    const closeButton = document.querySelector('.close-popup');
    if (closeButton) {
        closeButton.addEventListener('click', closePopup);
    }
});