import { describe, it, expect } from "vitest";
import {} from "../src/app";
import dotenv from "dotenv" ;
// import fetch from "node-fetch";
dotenv.config() ;
const url = `http://localhost:${process.env.PORT}` ;
function createRandomPassword(length = 16) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.@#$%^&*()";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
function createRandomUser(length = 14) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}


describe("API  testing", ()=>{
    let username1 = createRandomUser() ;
    let email1 = createRandomUser() + "@gmail.com" ;
    let password1 = createRandomPassword() ;
    let username2 = createRandomUser() ;
    let email2 = createRandomUser() + "@gmail.com" ;
    let password2 = createRandomPassword() ;
    let token1, token2;
    it("should register user 1", async ()=>{
        const response = await fetch(url + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username1,
                email: email1,
                password: password1
            })
        })
        const data = await response.json() ;
        expect(response.status).toBe(201) ;
        token1 = data.token ;
    })
    it("should not register same username and email", async ()=>{
        const response = await fetch(url + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username1,
                email: email1,
                password: password1
            })
        })
        expect(response.status).toBe(400) ;
    })
    it("should not register same username", async ()=>{
        const response = await fetch(url + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username1,
                email: email2,
                password: password1
            })
        })
        expect(response.status).toBe(400) ;
    })
    it("should not register same email", async ()=>{
        const response = await fetch(url + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username2,
                email: email1,
                password: password1
            })
        })
        expect(response.status).toBe(400) ;
    })
    it("should login user 1", async ()=>{
        const response = await fetch(url + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username1,
                password: password1
            })
        })
        const data = await response.json() ;
        expect(response.status).toBe(200) ;
        token1 = data.token ;
    })
    it("should not login with wrong password", async ()=>{
        const response = await fetch(url + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username1,
                password: password2
            })
        })
        expect(response.status).toBe(400) ;
    })
    it("should not login with wrong username", async ()=>{
        const response = await fetch(url + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username2,
                password: password1
            })
        })
        expect(response.status).toBe(400) ;
    })
    it("should get profile", async ()=>{
        const response = await fetch(url + '/profile', {
            method: 'GET',
            headers: {
                'auth-token': token1
            }
        })
        expect(response.status).toBe(200) ;
        const data = await response.json() ;
        expect(data.username).toBe(username1) ;
        expect(data.email).toBe(email1) ;
    })
    it("should not get profile with invalid token", async ()=>{
        const response = await fetch(url + '/profile', {
            method: 'GET',
            headers: {
                'auth-token': [createRandomPassword(32) , createRandomPassword(40), createRandomPassword(32)].join(".")
            }
        })
        expect(response.status).toBe(401) ;
    })
})