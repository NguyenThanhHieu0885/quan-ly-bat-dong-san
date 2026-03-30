const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'quanlybatdongsan'
};

async function generate() {
    const connection = await mysql.createConnection(config);
    const [tables] = await connection.query('SHOW TABLES');
    const dbName = config.database;
    const modelDir = path.join(__dirname, 'src', 'models');

    if (!fs.existsSync(modelDir)) fs.mkdirSync(modelDir, { recursive: true });

    for (let tableObj of tables) {
        const tableName = tableObj[`Tables_in_${dbName}`];
        const [columns] = await connection.query(`DESCRIBE ${tableName}`);
        
        const primaryKey = columns.find(c => c.Key === 'PRI')?.Field || 'id';
        // Tạo danh sách thuộc tính để hiển thị trong code
        const properties = columns.map(c => ` * @property {${c.Type}} ${c.Field} ${c.Null === 'YES' ? '(Optional)' : '(Required)'}`).join('\n');
        const fieldList = columns.map(c => c.Field).join(', ');

        const fileName = `${tableName}Model.js`;
        const content = `const db = require('../config/db');

/**
 * Danh sách thuộc tính bảng ${tableName}:
${properties}
 */

const ${tableName}Model = {
    // Tên các cột trong bảng: [${fieldList}]
    
    findAll: async () => {
        const [rows] = await db.execute('SELECT * FROM ${tableName}');
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM ${tableName} WHERE ${primaryKey} = ?', [id]);
        return rows[0];
    },

    create: async (data) => {
        // data nên chứa các thuộc tính: ${fieldList.replace(primaryKey + ', ', '')}
        const keys = Object.keys(data).join(', ');
        const values = Object.values(data);
        const placeholders = values.map(() => '?').join(', ');
        const sql = \`INSERT INTO ${tableName} (\${keys}) VALUES (\${placeholders})\`;
        const [res] = await db.execute(sql, values);
        return res.insertId;
    },

    update: async (id, data) => {
        const sets = Object.keys(data).map(k => k + ' = ?').join(', ');
        const sql = \`UPDATE ${tableName} SET \${sets} WHERE ${primaryKey} = ?\`;
        await db.execute(sql, [...Object.values(data), id]);
    },

    delete: async (id) => {
        const sql = \`DELETE FROM ${tableName} WHERE ${primaryKey} = ?\`;
        await db.execute(sql, [id]);
    }
};

module.exports = ${tableName}Model;`;

        fs.writeFileSync(path.join(modelDir, fileName), content);
        console.log(`- Đã tạo: ${fileName} (Kèm danh sách thuộc tính)`);
    }

    console.log('--- Đã xong! Bạn hãy mở các file trong src/models để xem thuộc tính ---');
    process.exit();
}

generate();