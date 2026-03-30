const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return loaibds.init(sequelize, DataTypes);
}

class loaibds extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    loaiid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tenloai: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'loaibds',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "loaiid" },
        ]
      },
    ]
  });
  }
}
