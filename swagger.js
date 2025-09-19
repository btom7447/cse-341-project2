const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Contacts API', 
        description: 'Users API'
    }, 
    host: 'localhost:3000',
    schemes: ['http']
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];

// This will generate swagger.json
swaggerAutogen(outputFile, endpointFiles, doc);