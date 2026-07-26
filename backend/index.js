const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Link Routes
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipeRoutes');
const communityRoutes = require('./routes/communityRoutes');
const ayurvedaRoutes = require('./routes/ayurvedaRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/ayurveda', ayurvedaRoutes);

app.get('/', (req, res) => {
  res.send({ message: "The Smart Chef cloud backend is operational!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT} (LAN URL: http://172.23.24.194:${PORT})`);
  console.log('✅ Local file-based database is active and persisting under backend/data/ directory.');
});
