const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const app = express();

const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(cors({
  origin: "*",  
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"], // 🔑 important
}));
app.use(express.json());

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Z-key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

// Routes
app.use('/', require('./routes'));
app.use('/', require('./routes/swagger'))

// Connect DB + Start server
mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => 
            console.log(`Database is listening and Node running on port ${port}`)
        );
    }
});
