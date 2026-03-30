const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return nhanvien.init(sequelize, DataTypes);
}

class nhanvien extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    nvid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    taikhoan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    matkhau: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tennv: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    sdt: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    diachi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ngaysinh: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    gioitinh: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    doanhthu: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    quyen: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    trangthai: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'nhanvien',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nvid" },
        ]
      },
    ]
  });
  }
}
