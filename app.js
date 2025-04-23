const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MySQL database connection
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: true
  }
});
;
  
// Add School API
app.post('/addSchool', async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validation
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: 'All fields (name, address, latitude, longitude) are required' });
  }

  // SQL query to insert a new school
  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  try {
    await pool.promise().query(query, [name, address, latitude, longitude]);
    res.status(201).json({ message: 'School added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding school', error: error.message });
  }
});

// List Schools API
app.get('/listSchools', async (req, res) => {
  const { latitude, longitude } = req.query;

  // Validate coordinates
  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and Longitude are required' });
  }

  // SQL query to get all schools from the database
  const query = 'SELECT * FROM schools';
  try {
    const [rows] = await pool.promise().query(query);

    // Function to calculate the distance (Haversine Formula)
    const toRad = (deg) => deg * (Math.PI / 180);

    const haversine = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the Earth in km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance;
    };

    // Sort schools by proximity to the user-specified location
    const sortedSchools = rows.map(school => ({
      ...school,
      distance: haversine(latitude, longitude, school.latitude, school.longitude)
    })).sort((a, b) => a.distance - b.distance);

    res.status(200).json(sortedSchools);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schools', error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
