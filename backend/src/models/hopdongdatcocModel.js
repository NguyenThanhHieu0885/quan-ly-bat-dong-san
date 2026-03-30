const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return hopdongdatcoc.init(sequelize, DataTypes);
}

class hopdongdatcoc extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    dcid: {
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
    ngaylaphd: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    giatri: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    tinhtrang: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    trangthai: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ngayhethan: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'hopdongdatcoc',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
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
