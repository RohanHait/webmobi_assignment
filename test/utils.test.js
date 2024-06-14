import { describe, it, expect } from "vitest";
import { check_user,check_email, encrypt_password, compare_password, generate_token, verify_token } from "../src/utils";

function createRandomUser(length = 14) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
function createRandomPassword(length = 14) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_@#$%^&*()";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

describe("username check", ()=>{
    it("should return true for valid username", ()=>{
        expect(check_user(createRandomUser())).toBe(true) ;
    })

    it("should return false for length greater the 40 username", ()=>{
        expect(check_user(createRandomUser(41))).toBe(false) ;
    })

    it.each([
        ["abc", true],
        ["abc@", false],
        ["abc@abc", false],
        ["abc abc", false],
        ["abc(abc)", false],
        ["abc-abc", false],
        ["abc_abc", true],
        ["abc.abc", false],
        ["abc#abc", false],
        ["abc$abc", false],
        ["abc%abc", false],
        ["abc^abc", false],
        ["abc&abc", false],
        ["abc*abc", false],
    ])(`should return %s for %s`, (email, expected) => {
        expect(check_user(email)).toBe(expected);
    });
})

describe("email check", ()=>{
    it.each([
        ["abc", false],
        ["abc@", false],
        ["abc@abc", false],
        ["abc abc", false],
        ["abc(abc)", false],
        ["abc-abc", false],
        ["abc_abc", false],
        ["abc.abc", false],
        ["abc#abc", false],
        ["abc$abc", false],
        ["abc%abc", false],
        ["abc^abc", false],
        ["abc&abc", false],
        ["abc*abc", false],
        ["email@example.com" , true]
        ["firstname.lastname@example.com" , true ],
        ["email@subdomain.example.com" , true ],
        ["firstname+lastname@example.com" , true ],
        ["email@123.123.123.123" , true ],
        ["email@[123.123.123.123]" , true ],
        ['"email"@example.com' , true ],
        ["1234567890@example.com" , true ],
        ["email@example-one.com" , true ],
        ["_______@example.com" , true ],
        ["email@example.name" , true ],
        ["email@example.museum" , true ],
        ["email@example.co.jp" , true ],
        ["firstname-lastname@example.com" , true ],
        ['#@%^%#$@#$@#.com' , false],
        ['@example.com' , false],
        ['Joe Smith <email@example.com>' , false],
        ['email.example.com' , false],
        ['email@example@example.com' , false],
        ['.email@example.com' , false],
        ['email.@example.com' , false],
        ['email..email@example.com' , false],
        ['あいうえお@example.com' , false],
        ['email@example.com (Joe Smith)' , false],
        ['email@example' , false],
        ['email@-example.com' , false],
        ['email@example.web' , false],
        ['email@111.222.333.44444' , false],
        ['email@example..com' , false],
        ['Abc..123@example.com' , false],
    ])(`should return %s for %s`, (email, expected) => {
        if(expected) {
            expect(check_email(email)).toBeTruthy();
        }
        else {
            expect(check_email(email)).toBeFalsy();
        }
        
    });
})

describe("password encryption", async ()=>{
    it.concurrent("should return a hashed password", async ()=>{
        const password = createRandomPassword() ;
        const hashed_password = await encrypt_password(password) ;
        expect(hashed_password).not.toBe(password) ;
    })
    it.concurrent("should return different hashed password for different password", async ()=>{
        const password1 = createRandomPassword() ;
        let password2 = createRandomPassword() ;
        while(password1 === password2) {
            password2 = createRandomPassword() ;
        }
        const hashed_password1 = await encrypt_password(password1) ;
        const hashed_password2 = await encrypt_password(password2) ;
        expect(hashed_password1).not.toBe(hashed_password2) ;
    })

})

describe("password comparison", async ()=>{
    it.concurrent("should return true for same password", async ()=>{
        const password = createRandomPassword() ;
        const hashed_password = await encrypt_password(password) ;
        expect(await compare_password(password, hashed_password)).toBe(true) ;
    })
    it.concurrent("should return false for different password", async ()=>{
        const password1 = createRandomPassword() ;
        let password2 = createRandomPassword() ;
        while(password1 === password2) {
            password2 = createRandomPassword() ;
        }
        const hashed_password = await encrypt_password(password1) ;
        expect(await compare_password(password2, hashed_password)).toBe(false) ;
    })
})

describe("token generation", async ()=>{
    it.concurrent("should return a token", async ()=>{
        const user = {
            id: 1,
            username: createRandomUser()
        }
        const token = await generate_token(user) ;
        expect(token).not.toBe(undefined) ;
    })
})

describe("token verification", async ()=>{
    it.concurrent("should return user object for valid token", async ()=>{
        const user = {
            id: 1,
            username: createRandomUser()
        }
        const token = await generate_token(user) ;
        const verified_user = await verify_token(token) ;
        expect(verified_user).toMatchObject(user) ;
    })
    it.concurrent("should throw error for invalid token", async ()=>{
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" ;
        try {
            await verify_token(token) ;
        }catch(err) {
            expect(err).not.toBe(undefined) ;
        }
    })
})
