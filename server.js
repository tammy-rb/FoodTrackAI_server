import express from 'express';
import bodyParser  from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import productRoute from './app/routes/product.routes.js'

import initRoute from './app/routes/initialization.route.js';

// Initialize express app
const app = express();

//make possible to send files from server in folder public
app.use(express.static('public'));

// Enable CORS for only the website client at http://localhost:3000
const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies and URL-encoded data
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(jsonParser);
app.use(urlencodedParser);

// Middleware function to log requests.
// This middleware logs the timestamp, HTTP method, and requested URL to log.txt file.
app.use((req, res, next) => {
    const logData = `${new Date().toISOString()} - ${req.method} ${req.originalUrl}\n`;
    fs.appendFile('./log.txt', logData, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
    next();
});

initRoute(app);
app.use('/api/products', productRoute);

// Define a simple GET route
app.get("/", (req, res) => {
    res.send("Hello, World! This is a test server.");
});

// Set port and listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});