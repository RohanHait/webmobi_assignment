import express from "express";
import {get_user_by_username, get_user_by_id, add_user , get_user_by_email} from './database.js' 
import dotenv from 'dotenv' ;
import {check_user, check_email, encrypt_password, generate_token, compare_password, verify_token} from './utils.js' ;

dotenv.config() ;

const app = express() ;
app.use(express.json()) ;
/*
* POST /login
* Request body: {username, password}
* Response: {token}
*/

app.post('/register', async (req, res) => {
    try{
        const {username,email, password} = req.body ;
        if(!check_user(username) || !check_email(email) ) {
            return res.status(400).send('Invalid username or email') ;
        }
        const user = await get_user_by_username(username) ;
        if(user) {
            return res.status(400).send('User already exists') ;
        }
        if(await get_user_by_email(email)) {
            return res.status(400).send('Email already exists') ;
        }
        const hashed_password = await encrypt_password(password) ;
        const new_user = await add_user(username,email, hashed_password) ;
        const token = await generate_token(new_user) ;
        res.status(201).send({token}) ;
    }
    catch(err) {
        console.log(err)
        res.status(500).send('Internal server error') ;
    }
})

app.post('/login', async (req, res) => {
    try{
        const {username, password} = req.body ;
        const user = await get_user_by_username(username) ;
        if(!user) {
            return res.status(400).send('User does not exist') ;
        }
        if(!await compare_password(password, user.password)) {
            return res.status(400).send('Incorrect password') ;
        }
        const token = await generate_token(user) ;
        res.status(200).send({token}) ;
    }catch(err) {
        console.log(err)
        res.status(500).send('Internal server error') ;
    }
})

app.get('/profile', async (req, res) => {
    try{
        const token = req.header('auth-token') ;
        const {id} = await verify_token(token) ;
        let user ;
        try{
        user = await get_user_by_id(id) ;
        }catch(err) {
            res.status(500).send('internal server error') ;
        }
        if(!user) {
            return res.status(400).send('User does not exist anymore') ;
        }
        res.status(200).send({username: user.username, email: user.email}) ;
    }catch(err) {
        console.log(err)
        res.status(401).send('Unauthorized') ;
    }
})

app.listen(process.env.PORT , () => {
    console.log('Server started at http://localhost:'+ process.env.PORT) ;
}) ;