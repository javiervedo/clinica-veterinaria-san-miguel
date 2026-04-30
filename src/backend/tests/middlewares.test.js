const jwt = require('jsonwebtoken');
const request = require('supertest');
const express = require('express');

const auth = require('../src/middlewares/auth');
const role = require('../src/middlewares/role');

function buildApp(middlewares = []) {
  const app = express();

  app.get(
    '/protected',
    ...middlewares,
    (req, res) => res.status(200).json({ ok: true, user: req.user })
  );

  return app;
}

describe('Middlewares - auth/role', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  test('auth -> 401 si no hay Authorization', async () => {
    const app = buildApp([auth]);

    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
  });

  test('auth -> 200 si token válido', async () => {
    const app = buildApp([auth]);

    const token = jwt.sign(
      { id: 1, email: 'a@a.com', rol: 'admin', nombre: 'Admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.user.rol).toBe('admin');
  });

  test('role -> 403 si rol no permitido', async () => {
    const app = buildApp([auth, role('admin')]);

    const token = jwt.sign(
      { id: 1, email: 'vet@a.com', rol: 'veterinario', nombre: 'Vet' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  test('role -> 200 si rol permitido', async () => {
    const app = buildApp([auth, role('admin', 'veterinario')]);

    const token = jwt.sign(
      { id: 1, email: 'vet@a.com', rol: 'veterinario', nombre: 'Vet' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
