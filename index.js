require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get this from your .env file
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

// This is the ID for your "Pets" object from your screenshot
const OBJECT_ID = "2-226591917"; 

// 1. Homepage: List all pets
app.get('/', async (req, res) => {
    // We request the three properties you created
    const customObjectUrl = `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}?properties=pet_name,pet_breed,pet_age`;
    
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(customObjectUrl, { headers });
        const data = response.data.results;
        
        res.render('homepage', { 
            title: 'Pets Table | HubSpot Practicum', 
            data 
        });      
    } catch (error) {
        console.error("Error fetching data:", error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching data from HubSpot.');
    }
});

// 2. Show the Create Form
app.get('/update-cobj', (req, res) => {
    res.render('updates', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' 
    });
});

// 3. Handle Form Submission
app.post('/update-cobj', async (req, res) => {
    const createUrl = `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const newPet = {
        properties: {
            "pet_name": req.body.pet_name,
            "pet_breed": req.body.pet_breed,
            "pet_age": req.body.pet_age
        }
    };

    try {
        await axios.post(createUrl, newPet, { headers });
        res.redirect('/'); // Go back to table after success
    } catch (error) {
        console.error("Error creating record:", error.response ? error.response.data : error.message);
        res.send('Error creating pet. Check terminal for details.');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));