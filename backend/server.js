const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
const nhanVienRoutes = require('./routes/nhanVienRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.json({ message: 'Backend is running' });
});

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});

// API routes
app.use('/api/nhanvien', nhanVienRoutes);

// Start server after DB connection is verified
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL');
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
