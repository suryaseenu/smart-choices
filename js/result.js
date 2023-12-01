import { getSessionUser } from './utils.js';

function showPopup() {
  const popup = document.getElementById('popup');
  popup.style.display = 'block';
}

function closePopup() {
  const popup = document.getElementById('popup');
  popup.style.display = 'none';
}

document.getElementById('helpBtn').addEventListener('click', showPopup);

async function calculateDecisionStyle() {
  try {
    const user = await getSessionUser();

    const response = await fetch(`http://localhost:3000/getUserResponses?userId=${user._id}`);
    const userResponses = await response.json();

    if (userResponses.find(response => response.questionNumber === 1).response === 'no') {
      if (userResponses.find(response => response.questionNumber === 2).response === 'no') {
        return "A1";
      }
      else if (userResponses.find(response => response.questionNumber === 2).response === 'yes') {
        if (userResponses.find(response => response.questionNumber === 5).response === 'yes') {
          return "A1";
        }
        else if (userResponses.find(response => response.questionNumber === 5).response === 'no') {
          return "G2";
        }
      }
    }
    else if (userResponses.find(response => response.questionNumber === 1).response === 'yes') {
      if (userResponses.find(response => response.questionNumber === 2).response === 'yes') {
        if (userResponses.find(response => response.questionNumber === 3).response === 'yes') {
          if (userResponses.find(response => response.questionNumber === 5).response === 'yes') {
            return "A2";
          }
          else if (userResponses.find(response => response.questionNumber === 5).response === 'no') {
            if (userResponses.find(response => response.questionNumber === 6).response === 'yes') {
              return "G2";
            }
            else if (userResponses.find(response => response.questionNumber === 6).response === 'no') {
              return "C2";
            }
          }
        }
        else if (userResponses.find(response => response.questionNumber === 3).response === 'no') {
          if (userResponses.find(response => response.questionNumber === 4).response === 'yes') {
            if (userResponses.find(response => response.questionNumber === 5).response === 'yes') {
              if (userResponses.find(response => response.questionNumber === 6).response === 'yes') {
                if (userResponses.find(response => response.questionNumber === 7).response === 'yes') {
                  return "C1";
                }
                else if (userResponses.find(response => response.questionNumber === 7).response === 'no') {
                  return "A2";
                }
              }
              else if (userResponses.find(response => response.questionNumber === 6).response === 'no') {
                return "A2";
              }
            }
            else if (userResponses.find(response => response.questionNumber === 5).response === 'no') {
              if (userResponses.find(response => response.questionNumber === 6).response === 'no') {
                return "C2";
              }
              else if (userResponses.find(response => response.questionNumber === 6).response === 'yes') {
                if (userResponses.find(response => response.questionNumber === 7).response === 'yes') {
                  return "G2";
                }
                else if (userResponses.find(response => response.questionNumber === 7).response === 'no') {
                  return "C2";
                }
              }
            }
          }
          else if (userResponses.find(response => response.questionNumber === 4).response === 'no') {
            if (userResponses.find(response => response.questionNumber === 5).response === 'yes') {
              return "C2";
            }
            else if (userResponses.find(response => response.questionNumber === 5).response === 'no') {
              if (userResponses.find(response => response.questionNumber === 6).response === 'yes') {
                return "G2";
              }
              else if (userResponses.find(response => response.questionNumber === 6).response === 'no') {
                return "C2";
              }
            }
          }
        }
      }
      else if (userResponses.find(response => response.questionNumber === 2).response === 'no') {
        if (userResponses.find(response => response.questionNumber === 3).response === 'yes') {
          return "A1";
        }
        else if (userResponses.find(response => response.questionNumber === 3).response === 'no') {
          if (userResponses.find(response => response.questionNumber === 4).response === 'no') {
            return "C2";
          }
          else if (userResponses.find(response => response.questionNumber === 4).response === 'yes') {
            if (userResponses.find(response => response.questionNumber === 6).response === 'no') {
              return "A2";
            }
            else if (userResponses.find(response => response.questionNumber === 6).response === 'yes') {
              if (userResponses.find(response => response.questionNumber === 7).response === 'yes') {
                return "C1";
              }
              else if (userResponses.find(response => response.questionNumber === 7).response === 'no') {
                return "A2";
              }
            }
          }
        }
      }
    }


  } catch (error) {
    console.error('Error calculating decision style:', error);
    return null;
  }
}

async function fetchDecisionDetails(decisionStyle) {
  try {
    const response = await fetch(`http://localhost:3000/getDecisionDetails?decisionStyle=${decisionStyle}`);
    const decisionDetails = await response.json();

    return decisionDetails;
  } catch (error) {
    console.error('Error fetching decision details:', error);
    return null;
  }
}

async function displayDecisionDetails(decisionDetails) {
  try {
    const decisionTitle = document.querySelector('#decisionDetailsContainer h1');
    const decisionNumberCircle = document.querySelector('#decisionDetailsContainer .numberCircle');
    const decisionDescription = document.querySelector('#decisionDetailsContainer h5');

    decisionTitle.textContent = decisionDetails.fullName;
    decisionNumberCircle.textContent = decisionDetails.name;
    decisionDescription.textContent = decisionDetails.description;

  } catch (error) {
    console.error('Error displaying decision details:', error);
  }
}


async function saveAttemptResult(userId, decisionStyle) {
  try {
    const response = await fetch('http://localhost:3000/saveAttemptResult', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        result: decisionStyle,
        date: new Date().toLocaleDateString(),
      }),
    });

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error saving attempt result:', error);
  }
}

(async () => {
  const decisionStyle = await calculateDecisionStyle();
  console.log(`Recommended Decision-Making Style: ${decisionStyle}`);

  if (decisionStyle) {
    const decisionDetails = await fetchDecisionDetails(decisionStyle);
    displayDecisionDetails(decisionDetails);

    const user = await getSessionUser();
    await saveAttemptResult(user._id, decisionStyle);
  }
  const closeButton = document.querySelector('.close-popup');
    if (closeButton) {
        closeButton.addEventListener('click', closePopup);
    }
})();