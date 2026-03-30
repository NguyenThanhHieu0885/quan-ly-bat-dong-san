const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return hinhbds.init(sequelize, DataTypes);
}

class hinhbds extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    hinhid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    hinh: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    bdsid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'batdongsan',
        key: 'bdsid'
      }
    }
  }, {
    sequelize,
    tableName: 'hinhbds',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "hinhid" },
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
