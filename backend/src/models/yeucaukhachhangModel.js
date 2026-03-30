const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return yeucaukhachhang.init(sequelize, DataTypes);
}

class yeucaukhachhang extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    ycid: {
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
      unique: "yeucaukhachhang_ibfk_1"
    },
    khid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'khachhang',
        key: 'khid'
      }
    },
    vitri: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mota: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    giaf: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    giat: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    daif: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    dait: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    rongf: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    rongt: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'yeucaukhachhang',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ycid" },
        ]
      },
      {
        name: "UNIQUE_loaiid_yc",
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
