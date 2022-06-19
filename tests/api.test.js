require('dotenv').config();
const http = require('http');
let response = '';

describe('Main functional tests', () => {
  it('should create user', async () => {
    const postData = JSON.stringify({
      username: 'test',
      age: 25,
      hobbies: [],
    });
    const data = await new Promise((resolve) => {
      const request = http.request({
        hostname: 'localhost',
        port: process.env.PORT,
        path: '/users',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': postData.length,
        },
      }, (res) => {
        resolve(res.statusCode);
      });
      request.write(postData);
      request.end();
    });
  
    expect(data).toBe(201);
  });
  
  it('should return users data', async () => {
    const data = await new Promise((resolve) => {
      http.get({
        hostname: 'localhost',
        port: process.env.PORT,
        path: '/users',
      }, (res) => {
        res.on('data', (chunk) => {
          response += chunk;
        })
        res.on('end', () => resolve(res.statusCode));
      });
    });
  
    expect(data).toBe(200);
  });
  
  it('should delete user', async() => {
    const data = await new Promise((resolve) => {
      const userData = JSON.parse(response);
      const key = Object.keys(userData)[0];
      const request = http.request({
        hostname: 'localhost',
        port: process.env.PORT,
        path: `/users/${userData[key].id}`,
        method: 'DELETE'
      }, (res) => {
        resolve(res.statusCode);
      });
      request.end();
    });
  
    expect(data).toBe(204);
  })
});