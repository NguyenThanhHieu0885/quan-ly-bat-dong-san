const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return hopdongchuyennhuong.init(sequelize, DataTypes);
}

class hopdongchuyennhuong extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    cnid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    khid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'khachhang',
        key: 'khid'
      }
    },
    bdsid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'batdongsan',
        key: 'bdsid'
      }
    },
    dcid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'hopdongdatcoc',
        key: 'dcid'
      },
      unique: "hopdongchuyennhuong_ibfk_3"
    },
    giatri: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ngaylap: {
      type: DataTypes.DATE,
      allowNull: true
    },
    trangthai: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'hopdongchuyennhuong',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "cnid" },
        ]
      },
      {
        name: "UNIQUE_dcid_cn",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "dcid" },
        ]
      },
      {
        name: "khid",
        using: "BTREE",
        fields: [
          { name: "khid" },
        ]
      },
      {
        name: "bdsid",
        using: "BTREE",
        fields: [
          { name: "bdsid" },
        ]
      },
    ]
  });
  }
}
