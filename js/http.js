const axios = require("axios");

axios
    .get ("http://localhost:8090/api/collections/user/records")
    .then((response) => {
        console.log ("data", response.data);
    })
    .catch((err) => {
        console.log ("Error: ", err.message);
    });