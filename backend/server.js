const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
require('dotenv').config();

connectDB();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const batDongSanRoutes = require('./routes/batDongSanRoutes');
const khachHangRoutes = require('./routes/khachHangRoutes');
const { scheduleStatusUpdates } = require('./models/statusUpdater');

app.use(cors());
app.use(express.json());
app.use('/api/bat-dong-san', batDongSanRoutes);
app.use('/api/khach-hang', khachHangRoutes);


app.get('/', (req, res) => {
	res.json({ message: 'Backend is running' });
});

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api/ky-gui', require('./routes/kyGuiRoutes'));

// Khởi chạy các công việc được lên lịch
scheduleStatusUpdates();

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
