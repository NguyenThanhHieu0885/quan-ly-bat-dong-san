const express = require('express');
const cors = require('cors');
require('dotenv').config();
const batDongSanRoutes = require('./routes/batdongsan'); 

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/batdongsan', batDongSanRoutes);

app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});