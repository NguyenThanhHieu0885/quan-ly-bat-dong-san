const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return batdongsan.init(sequelize, DataTypes);
}

class batdongsan extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    bdsid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    loaiid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'loaibds',
        key: 'loaiid'
      },
      unique: "batdongsan_ibfk_1"
    },
    khid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'khachhang',
        key: 'khid'
      }
    },
    tinhtrang: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dientich: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    dongia: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    masoqsdd: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    mota: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    hinhanh: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    chieudai: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    chieurong: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    huehong: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    tenduong: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    thanhpho: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sonha: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    quan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phuong: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'batdongsan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bdsid" },
        ]
      },
      {
        name: "UNIQUE_loaiid_bds",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "loaiid" },
        ]
      },
      {
        name: "khid",
        using: "BTREE",
        fields: [
          { name: "khid" },
        ]
      },
    ]
  });
  }
}
