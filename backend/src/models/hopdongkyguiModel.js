const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return hopdongkygui.init(sequelize, DataTypes);
}

class hopdongkygui extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    kgid: {
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
    giatri: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    chiphidv: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ngaybatdau: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ngayketthuc: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    trangthai: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'hopdongkygui',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "kgid" },
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
