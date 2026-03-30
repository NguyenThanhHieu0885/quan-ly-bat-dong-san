const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return khachhang.init(sequelize, DataTypes);
}

class khachhang extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    khid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nvid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'nhanvien',
        key: 'nvid'
      }
    },
    hoten: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    diachi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    diachitt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cmnd: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: "UNIQUE_CMND"
    },
    ngaysinh: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    sdt: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    gioitinh: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    loaikh: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    mota: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    trangthai: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'khachhang',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "khid" },
        ]
      },
      {
        name: "UNIQUE_CMND",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "cmnd" },
        ]
      },
      {
        name: "nvid",
        using: "BTREE",
        fields: [
          { name: "nvid" },
        ]
      },
    ]
  });
  }
}
