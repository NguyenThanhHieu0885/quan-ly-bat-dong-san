const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BatDongSan = sequelize.define('BatDongSan', {
  bdsid: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  loaiid: { 
    type: DataTypes.INTEGER 
  },
  khid: { 
    type: DataTypes.INTEGER 
  },
  tinhtrang: { 
    type: DataTypes.INTEGER 
  },
  dientich: { 
    type: DataTypes.FLOAT 
  },
  dongia: { 
    type: DataTypes.FLOAT 
  },
  masoqsdd: { 
    type: DataTypes.STRING(50) 
  },
  mota: { 
    type: DataTypes.STRING(500) 
  },
  hinhanh: { 
    type: DataTypes.BLOB('long') 
  },
  chieudai: { 
    type: DataTypes.FLOAT 
  },
  chieurong: { 
    type: DataTypes.FLOAT 
  },
  huehong: { 
    type: DataTypes.FLOAT 
  },
  tenduong: { 
    type: DataTypes.STRING(100) 
  },
  thanhpho: { 
    type: DataTypes.STRING(100) 
  },
  sonha: { 
    type: DataTypes.STRING(50) 
  },
  quan: { 
    type: DataTypes.STRING(100) 
  },
  phuong: { 
    type: DataTypes.STRING(100) 
  }
}, {
  tableName: 'batdongsan', 
  timestamps: false       
});

module.exports = BatDongSan;