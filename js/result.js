import { getSessionUser } from './utils.js';

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

const decisionStyle = await calculateDecisionStyle();
console.log(`Recommended Decision-Making Style: ${decisionStyle}`);