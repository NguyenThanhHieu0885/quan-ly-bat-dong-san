const { pool } = require('../config/db');

const KyGui = {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM hopdongkygui ORDER BY khid ASC');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM hopdongkygui WHERE kgid = ?', [id]);
    return rows[0];
  },

  async create(newKyGui) {
    const { khid, bdsid, giatri, chiphidv, ngaybatdau, ngayketthuc, trangthai } = newKyGui;
    const finalNgayKetThuc = ngayketthuc ? ngayketthuc : null;
    const sql = `
      INSERT INTO hopdongkygui (khid, bdsid, giatri, chiphidv, ngaybatdau, ngayketthuc, trangthai)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [khid, bdsid, giatri, chiphidv, ngaybatdau, finalNgayKetThuc, trangthai]);
    return { kgid: result.insertId, ...newKyGui };
  },

  async update(id, kyGuiData) {
    const { khid, bdsid, giatri, chiphidv, ngaybatdau, ngayketthuc, trangthai } = kyGuiData;
    const finalNgayKetThuc = ngayketthuc ? ngayketthuc : null;
    const sql = `
      UPDATE hopdongkygui 
      SET khid = ?, bdsid = ?, giatri = ?, chiphidv = ?, ngaybatdau = ?, ngayketthuc = ?, trangthai = ?
      WHERE kgid = ?
    `;
    const [result] = await pool.query(sql, [khid, bdsid, giatri, chiphidv, ngaybatdau, finalNgayKetThuc, trangthai, id]);
    return result;
  },

  async remove(id) {
    const sql = 'DELETE FROM hopdongkygui WHERE kgid = ?';
    const [result] = await pool.query(sql, [id]);
    return result;
  },

  async autoUpdateExpiredStatus() {
    const sql = `
      UPDATE hopdongkygui 
      SET trangthai = 2 
      WHERE trangthai = 1 
      AND ngayketthuc IS NOT NULL 
      AND ngayketthuc < CURDATE()
    `;
    const [result] = await pool.query(sql);
    return result;
  }
};

module.exports = KyGui;