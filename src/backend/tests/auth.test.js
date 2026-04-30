const request = require('supertest');

jest.mock('../src/repositories/usuariosRepository', () => ({
  findByEmail: jest.fn()
}));

const bcrypt = require('bcrypt');
const usuariosRepository = require('../src/repositories/usuariosRepository');
const app = require('../src/app');

describe('Auth - /api/auth/login', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('400 si faltan credenciales', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  test('401 si credenciales inválidas (usuario no existe)', async () => {
    usuariosRepository.findByEmail.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noexiste@sanmiguel.com', password: 'x' });

    expect(res.status).toBe(401);
  });

  test('200 si credenciales válidas (devuelve token y user)', async () => {
    const password = 'admin123';
    const password_hash = await bcrypt.hash(password, 10);

    usuariosRepository.findByEmail.mockResolvedValue({
      id: 1,
      nombre: 'Administrador',
      email: 'admin@sanmiguel.com',
      password_hash,
      rol: 'admin'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@sanmiguel.com', password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');

    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('admin@sanmiguel.com');
    expect(res.body.user.rol).toBe('admin');
  });
});
