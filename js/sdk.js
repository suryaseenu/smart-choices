const PocketBase = require("pocketbase/cjs");

const pb = new PocketBase('http://127.0.0.1:8090');

// search in collection

// pb.collection('user').getFirstListItem('firstName="Fernando"', {
//         expand: 'relField1,relField2.subRelField',
//     })
//     .then((response) => {console.log("data",response)})
//     .catch((err) => {console.log("Error: ", err.message)});


// add to collection

const data = {
    "questionText": "Are you hungry?"
};

// pb.collection('question').create(data)
//     .then(response => {
//         console.log('Record added successfully:', response);
//     })
//     .catch(error => {
//         console.error('Error adding record:', error.message);
//     });

// delete from collection

pb.collection('question').delete("muwhpe4ob48rm93")
    .then(response => {
        console.log('Record deleted successfully:', response);
    })
    .catch(error => {
        console.error('Error adding record:', error.message);
    });