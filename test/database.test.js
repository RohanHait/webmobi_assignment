import { describe, it, expect, assert } from "vitest";
import { get_user_by_email, get_user_by_username, get_user_by_id , add_user } from "../src/database";

function createRandomPassword(length = 40) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_@#$%^&*()";
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

describe("database tests", ()=>{
    const username = createRandomUser() ;
    const email = createRandomUser() + "@gmail.com" ;
    const password = createRandomPassword() ;
    let id ;
    it("should add user", async ()=>{
        try{
        const user = await add_user(username, email, password) ;
        expect(user.username).toBe(username) ;
        expect(user.email).toBe(email) ;
        if(user.id)
        id = user.id ;
        } catch(err) {
            assert(false,err) ;
        }
    })

    it("should get user by username", async ()=>{
        try{
            const user = await get_user_by_username(username) ;
            expect(user.username).toBe(username) ;
            expect(user.email).toBe(email) ;
        } catch(err) {
            assert(false,err) ;
        }
    })

    it("should get user by email", async ()=>{
        try{
            const user = await get_user_by_email(email) ;
            expect(user.username).toBe(username) ;
            expect(user.email).toBe(email) ;
        }
        catch(err) {
            assert(false,err) ;
        }
    })

    it("should get user by id", async ()=>{
        try{
            const username = createRandomUser() ;
            const email = createRandomUser() + "@gmail.com" ;
            const password = createRandomPassword() ;
            const user = await add_user(username, email, password) ;
            const user2 = await get_user_by_id(user.id) ;
            expect(user2.username).toBe(username) ;
            expect(user2.email).toBe(email) ;
        }catch(err) {
            assert(false,err) ;
        }
    })
    it("should not add user with same username", async ()=>{
        expect(add_user(username, email, password)).rejects.toThrow() ;
    })
    it("should not add user with same email", async ()=>{
        expect(add_user(createRandomUser(), email, password)).rejects.toThrow() ;
    })
    it("should get undenied from not added user", async ()=>{
        expect(get_user_by_username(createRandomUser())).resolves.toBeUndefined() ;
        expect(get_user_by_email(createRandomUser() + "@abc.com")).resolves.toBeUndefined() ;
        expect(get_user_by_id(15678)).resolves.toBeUndefined() ;
    })
})