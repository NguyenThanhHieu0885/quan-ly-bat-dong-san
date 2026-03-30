const DataTypes = require("sequelize").DataTypes;

// Đảm bảo các file này tồn tại trong thư mục models với tên chính xác như dưới đây
const _batdongsan = require("./batdongsanModel");
const _hinhbds = require("./hinhbdsModel");
const _hopdongchuyennhuong = require("./hopdongchuyennhuongModel");
const _hopdongdatcoc = require("./hopdongdatcocModel");
const _hopdongkygui = require("./hopdongkyguiModel");
const _khachhang = require("./khachhangModel");
const _loaibds = require("./loaibdsModel");
const _nhanvien = require("./nhanvienModel");
const _yeucaukhachhang = require("./yeucaukhachhangModel");

function initModels(sequelize) {
  const batdongsan = _batdongsan(sequelize, DataTypes);
  const hinhbds = _hinhbds(sequelize, DataTypes);
  const hopdongchuyennhuong = _hopdongchuyennhuong(sequelize, DataTypes);
  const hopdongdatcoc = _hopdongdatcoc(sequelize, DataTypes);
  const hopdongkygui = _hopdongkygui(sequelize, DataTypes);
  const khachhang = _khachhang(sequelize, DataTypes);
  const loaibds = _loaibds(sequelize, DataTypes);
  const nhanvien = _nhanvien(sequelize, DataTypes);
  const yeucaukhachhang = _yeucaukhachhang(sequelize, DataTypes);

  // Thiết lập mối quan hệ (Associations)
  hinhbds.belongsTo(batdongsan, { as: "bd", foreignKey: "bdsid"});
  batdongsan.hasMany(hinhbds, { as: "hinhbds", foreignKey: "bdsid"});
  
  hopdongchuyennhuong.belongsTo(batdongsan, { as: "bd", foreignKey: "bdsid"});
  batdongsan.hasMany(hopdongchuyennhuong, { as: "hopdongchuyennhuongs", foreignKey: "bdsid"});
  
  hopdongdatcoc.belongsTo(batdongsan, { as: "bd", foreignKey: "bdsid"});
  batdongsan.hasMany(hopdongdatcoc, { as: "hopdongdatcocs", foreignKey: "bdsid"});
  
  hopdongkygui.belongsTo(batdongsan, { as: "bd", foreignKey: "bdsid"});
  batdongsan.hasMany(hopdongkygui, { as: "hopdongkyguis", foreignKey: "bdsid"});
  
  hopdongchuyennhuong.belongsTo(hopdongdatcoc, { as: "dc", foreignKey: "dcid"});
  hopdongdatcoc.hasOne(hopdongchuyennhuong, { as: "hopdongchuyennhuong", foreignKey: "dcid"});
  
  batdongsan.belongsTo(khachhang, { as: "kh", foreignKey: "khid"});
  khachhang.hasMany(batdongsan, { as: "batdongsans", foreignKey: "khid"});
  
  hopdongchuyennhuong.belongsTo(khachhang, { as: "kh", foreignKey: "khid"});
  khachhang.hasMany(hopdongchuyennhuong, { as: "hopdongchuyennhuongs", foreignKey: "khid"});
  
  hopdongdatcoc.belongsTo(khachhang, { as: "kh", foreignKey: "khid"});
  khachhang.hasMany(hopdongdatcoc, { as: "hopdongdatcocs", foreignKey: "khid"});
  
  hopdongkygui.belongsTo(khachhang, { as: "kh", foreignKey: "khid"});
  khachhang.hasMany(hopdongkygui, { as: "hopdongkyguis", foreignKey: "khid"});
  
  yeucaukhachhang.belongsTo(khachhang, { as: "kh", foreignKey: "khid"});
  khachhang.hasMany(yeucaukhachhang, { as: "yeucaukhachhangs", foreignKey: "khid"});
  
  batdongsan.belongsTo(loaibds, { as: "loai", foreignKey: "loaiid"});
  loaibds.hasOne(batdongsan, { as: "batdongsan", foreignKey: "loaiid"});
  
  yeucaukhachhang.belongsTo(loaibds, { as: "loai", foreignKey: "loaiid"});
  loaibds.hasOne(yeucaukhachhang, { as: "yeucaukhachhang", foreignKey: "loaiid"});
  
  khachhang.belongsTo(nhanvien, { as: "nv", foreignKey: "nvid"});
  nhanvien.hasMany(khachhang, { as: "khachhangs", foreignKey: "nvid"});

  return {
    batdongsan,
    hinhbds,
    hopdongchuyennhuong,
    hopdongdatcoc,
    hopdongkygui,
    khachhang,
    loaibds,
    nhanvien,
    yeucaukhachhang,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;