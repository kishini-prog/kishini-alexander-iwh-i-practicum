const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

const OBJECT_ID = "2-226591917"; 

// Homepage
app.get('/', async (req, res) => {
    const customObjectUrl = `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}?properties=pet_name,pet_breed,pet_age`;
    
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        // Call HubSpot API
        const response = await axios.get(customObjectUrl, { headers });
        const data = response.data.results;
        
        // Render the homepage template with the data
        res.render('homepage', { 
            title: 'F1 Drivers | Integrating With HubSpot I Practicum', 
            data 
        });      
    } catch (error) {
        console.error(error);
    }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));