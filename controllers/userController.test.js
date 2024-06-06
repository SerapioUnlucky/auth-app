const request = require('supertest');
const express = require('express');
const { register } = require('./userController');
const method = require('../helpers/methods');

jest.mock('../helpers/methods');

const app = express();

app.use(express.json());
app.post('/register', (req, res) => register(null, req, res));

describe('POST /register', () => {

    it('Debería registrar al usuario correctamente', async () => {

        const newUser = {
            name: 'John',
            lastname: 'Doe',
            username: 'johndoe',
            password: '123456',
            birthdate: '1990-01-01T00:00:00.000Z',
            age: 31
        };

        method.findOne.mockResolvedValue(null);
        method.bcryptHash.mockResolvedValue('123456');
        method.insertOne.mockResolvedValue({});

        const response = await request(app)
            .post('/register')
            .send(newUser);

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            message: 'Usuario registrado con éxito',
            user: newUser
        });

    });

    it('Debería devolver un error 400 si el usuario ya existe', async () => {

        const newUser = {
            name: 'John',
            lastname: 'Doe',
            username: 'johndoe',
            password: '123456',
            birthdate: '1990-01-01T00:00:00.000Z',
            age: 31
        };

        method.findOne.mockResolvedValue(true);

        const response = await request(app)
            .post('/register')
            .send(newUser);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'El usuario ya existe'
        });

    });

    it('Debería devolver un error 400 de que la edad es obligatoria', async () => {

        const newUser = {
            name: 'John',
            lastname: 'Doe',
            username: 'johndoe',
            password: '123456',
            birthdate: '1990-01-01T00:00:00.000Z'
        };

        const response = await request(app)
            .post('/register')
            .send(newUser);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'La edad es obligatoria'
        });

    }); 

    it('Debería devolver un error 400 de que el nombre solo puede contener letras', async () => {

        const newUser = {
            name: 'John123',
            lastname: 'Doe',
            username: 'johndoe',
            password: '123456',
            birthdate: '1990-01-01T00:00:00.000Z',
            age: 31
        };

        const response = await request(app)
            .post('/register')
            .send(newUser);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'El nombre solo puede contener letras'
        });

    });

});
