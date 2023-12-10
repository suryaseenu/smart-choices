async function getSessionUser() {
    try {
        const response = await fetch('http://localhost:3000/getSessionUser');
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching session user data:', error);
        return null;
    }
}

async function getSessionLastQuestionNumber() {
    try {
        const response = await fetch('http://localhost:3000/getSessionLastQuestionNumber');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching session lastQuestionNumber:', error);
        return null;
    }
}



export { getSessionUser, getSessionLastQuestionNumber };
