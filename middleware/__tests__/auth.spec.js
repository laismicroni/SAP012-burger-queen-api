const jwt = require('jsonwebtoken');
const middleware = require('../auth');
const User = require('../../models/user');

// Mocks
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

jest.mock('../../models/user', () => ({
  findById: jest.fn(),
}));

describe('Authentication Middleware', () => {
  // Testando o middleware de autenticação
  describe('Authentication Middleware', () => {
    test('Deve chamar o next middleware se nenhum cabecalho de autorização for fornecido', async () => {
      const req = { headers: {} };
      const next = jest.fn();
      await middleware('mySecret')(req, {}, next);
      expect(next).toHaveBeenCalled();
    });

    test('Deve chamar o next middleware se o tipo de autorização ou token for inválido for inválido', async () => {
      const req = { headers: { authorization: 'InvalidToken' } };
      const next = jest.fn();
      await middleware('mySecret')(req, {}, next);
      expect(next).toHaveBeenCalled();
    });

    test('Deve chamar o next middleware se a verificação de token falhar', async () => {
      const req = { headers: { authorization: 'Bearer invalidToken' } };
      const next = jest.fn();
      jwt.verify.mockImplementationOnce(() => { throw new Error('Invalid token'); });
      await middleware('mySecret')(req, {}, next);
      expect(next).toHaveBeenCalled();
    });

    test('Deve definir o ID do usuário na requisição se o token é válido', async () => {
      const req = { headers: { authorization: 'Bearer validToken' } };
      const next = jest.fn();
      jwt.verify.mockReturnValueOnce({ userId: '123' });
      await middleware('mySecret')(req, {}, next);
      expect(req.userId).toBe('123');
      expect(next).toHaveBeenCalled();
    });
  });

  // Testando as funções de verificação de autenticação e administração
  describe('Auth Functions', () => {
    test('Deve retornar true se o usuário estiver autenticado', () => {
      const req = { userId: '123' };
      expect(middleware.isAuthenticated(req)).toBe(true);
    });

    test('Deve retornar false se o usuário não estiver autenticado', () => {
      const req = {};
      expect(middleware.isAuthenticated(req)).toBe(false);
    });

    test('Deve retornar true se o usuário for um admin', async () => {
      const req = { userId: '123' };
      User.findById.mockReturnValueOnce({ roles: ['admin'] });
      const isAdmin = await middleware.isAdmin(req);
      expect(isAdmin).toBe(true);
    });

    test('Deve retornar false se o usuário não for um admin', async () => {
      const req = { userId: '123' };
      User.findById.mockReturnValueOnce({ roles: ['user'] });
      const isAdmin = await middleware.isAdmin(req);
      expect(isAdmin).toBe(false);
    });

    test('Deve retornar um erro se o usuário não estiver autenticado em requireAuth', () => {
      const req = {};
      const next = jest.fn();
      expect(() => middleware.requireAuth(req, {}, next)).toThrow('Token não fornecido ou inválido');
    });

    test('Deve retornar um erro se o usuário não estiver autenticado em requireAdmin', async () => {
      const req = {};
      const next = jest.fn();
      await expect(middleware.requireAdmin(req, {}, next)).rejects.toThrow('Token não fornecido ou inválido');
    });

    test('Deve retornar um erro se o usuário não for um admin', async () => {
      const req = { userId: '123' };
      const next = jest.fn();
      User.findById.mockReturnValueOnce({ roles: ['user'] });
      await expect(middleware.requireAdmin(req, {}, next)).rejects.toThrow('Permissão de administrador não fornecida');
    });
  });
});
