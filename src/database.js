import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config() ;
const pool = mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
}).promise()

async function  get_user_by_username(username) {
    try {
        const [result] = await pool.query('SELECT *  FROM users WHERE username = ?', [username]) ;
        return result[0] ;
    }catch(err) {
        throw err ;
    }
}

async function get_user_by_email(email) {
    try{
        const [result] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
        return result[0] ;
    }catch(err) {
        throw err ;
    }
}

async function get_user_by_id(id) {
    try{
        const [result] = await pool.query('SELECT * FROM users WHERE id = ?', [id])

        return result[0] ;
    }catch(err) {
        throw err ;
    }
}

async function add_user(username, email, password) {
    try{
        const [result] = await pool.query('INSERT INTO users (username,email, password) VALUES (?, ? ,?)', [username, email, password])
        return get_user_by_id(result.insertId) ;
    }catch(err) {
        throw err ;
    }
}

// console.log(await add_user('test1', 'test1')) ;
// console.log(await get_user_by_username('test')) ;
// console.log(await get_user_by_id(1)) ;

export { get_user_by_username, get_user_by_id, add_user , get_user_by_email} ;
