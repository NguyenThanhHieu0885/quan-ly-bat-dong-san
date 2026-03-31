const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const { Op } = require('sequelize'); 
const BatDongSan = require('./models/BatDongSan');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
	res.json({ message: 'Backend is running' });
});

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});

app.get('/batdongsan', async (req, res) => {
  try {
    const listBDS = await BatDongSan.findAll();
    res.json(listBDS);
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server: " + error.message);
  }
});

app.get('/batdongsan/tra-cuu', async (req, res) => {
  try {
    const keyword = req.query.keyword;
    if (!keyword || !keyword.trim()) {
      return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
    }

    const ketQua = await BatDongSan.findAll({
      where: {
        [Op.or]: [
          { masoqsdd: { [Op.like]: `%${keyword}%` } },
          { tenduong: { [Op.like]: `%${keyword}%` } },
          { mota: { [Op.like]: `%${keyword}%` } },
        ]
      }
    });

    return res.json(ketQua);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});


app.get('/batdongsan/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const chiTiet = await BatDongSan.findByPk(id);
    
    if (chiTiet) {
      res.json(chiTiet);
    } else {
      res.status(404).json({ message: "Không tìm thấy bất động sản" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server: " + error.message);
  }
});

app.get('/batdongsan/hinh-anh/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const bds = await BatDongSan.findByPk(id, {
      attributes: ['hinhanh'] 
    });

    if (bds && bds.hinhanh) {
      // Chuyển Buffer từ BLOB sang chuỗi Base64
      const base64Image = Buffer.from(bds.hinhanh).toString('base64');
      const imageSrc = `data:image/jpeg;base64,${base64Image}`;
      res.json({ src: imageSrc });
    } else {
      res.status(404).json({ message: "Không có hình ảnh" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.put('/batdongsan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
          masoqsdd, tenduong,
          dientich, dongia, mota,
          chieudai, chieurong, huehong,
          sonha, phuong, quan, thanhpho,
          loaiid, khid,
          tinhtrang,
          hinhanh
        } = req.body;

        if (!masoqsdd || !tenduong || !dientich || !dongia) {
            return res.status(400).json({ message: "Không được để trống" });
        }

        const truongHopTrungMa = await BatDongSan.findOne({
            where: {
                masoqsdd: masoqsdd,
                bdsid: { [Op.ne]: id }
            }
        });

        if (truongHopTrungMa) {
            return res.status(409).json({ message: "Mã số QSDĐ này đã tồn tại!" });
        }

        const dataUpdate = {
          masoqsdd, tenduong, dientich,
          dongia, mota, chieudai, chieurong,
          huehong, sonha, phuong, quan, thanhpho,
          loaiid, khid,
          tinhtrang
        };

        if (hinhanh) {
          if (typeof hinhanh === 'string' && hinhanh.startsWith('data:')) {
            const base64Data = hinhanh.split(',')[1];
            dataUpdate.hinhanh = Buffer.from(base64Data, 'base64');
          } else if (typeof hinhanh === 'string') {
            dataUpdate.hinhanh = Buffer.from(hinhanh, 'base64');
          }
        }

        const [updated] = await BatDongSan.update(dataUpdate, {
            where: { bdsid: id }
        });

        if (updated) {
            const updatedBDS = await BatDongSan.findByPk(id);
            return res.json({ message: "Cập nhật thành công", data: updatedBDS });
        }

        return res.status(404).json({ message: "Không tìm thấy bất động sản để cập nhật" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Lỗi hệ thống khi cập nhật" });
    }
});
