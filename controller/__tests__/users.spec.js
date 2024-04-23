const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/user');
const {
  getUsers,
  createUser,
  updateUser,
  getUser,
  deleteUser,
  normalizeEmail,
  findUserByIdentifier,
} = require('../users');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = await mongod.getUri();

  // Conecte-se ao MongoDB
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('normalizeEmail', () => {
  it('Deve normalizar o email', () => {
    expect(normalizeEmail(' Test@Example.com ')).toBe('test@example.com');
  });
});

describe('findUserByIdentifier', () => {
  it('Deve retornar um usuário pelo ID', async () => {
    const user = new User({ email: 'test@example.com', password: 'password' });
    await user.save();

    const foundUser = await findUserByIdentifier(user._id);
    expect(foundUser.email).toBe('test@example.com');
  });

  it('Deve retornar um usuário pelo email', async () => {
    const user = new User({ email: 'test@example.com', password: 'password' });
    await user.save();

    const foundUser = await findUserByIdentifier('test@example.com');
    expect(foundUser._id.toString()).toBe(user._id.toString());
  });
});

describe('getUsers', () => {
  it('Deve retornar todos os usuários sem exibir a senha', async () => {
    const user1 = new User({ email: 'test1@example.com', password: 'password1' });
    const user2 = new User({ email: 'test2@example.com', password: 'password2' });
    await user1.save();
    await user2.save();

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({ email: 'test1@example.com' }),
      expect.objectContaining({ email: 'test2@example.com' }),
    ]);

    // Verifique que as senhas não estão presentes nos dados de retorno
    expect(res.json.mock.calls[0][0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ password: undefined }),
      ]),
    );
  });
});

describe('createUser', () => {
  it('Deve criar um usuário', async () => {
    const req = {
      body: {
        email: 'newuser@example.com',
        password: 'password',
        role: 'user',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      email: 'newuser@example.com',
      roles: ['user'],
    }));

    // Verifique que a senha não está presente nos dados de retorno
    expect(res.json.mock.calls[0][0].password).toBeUndefined();
  });

  it('Deve retornar 403 se o email estiver em uso', async () => {
    // Cria um usuário com o mesmo email
    const existingUser = new User({ email: 'newuser@example.com', password: 'password', roles: ['user'] });
    await existingUser.save();

    const req = {
      body: {
        email: 'newuser@example.com',
        password: 'password',
        role: 'user',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'E-mail já em uso' });
  });
});

describe('updateUser', () => {
  it('Deve atualizar um usuário', async () => {
    const user = new User({ email: 'test@example.com', password: 'password' });
    await user.save();

    const req = {
      params: {
        identifier: user._id.toString(),
      },
      body: {
        email: 'updated@example.com',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      email: 'updated@example.com',
    }));

    // Verifique que a senha não está presente nos dados de retorno
    expect(res.json.mock.calls[0][0].password).toBeUndefined();
  });

  it('Deve retornar 404 se o usuário não for encontrado', async () => {
    const req = {
      params: {
        identifier: 'nonexistentuser',
      },
      body: {
        email: 'updated@example.com',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
  });

  it('Deve retornar 403 se o email estiver em uso por outro usuário', async () => {
    // Cria dois usuários
    const user1 = new User({ email: 'user1@example.com', password: 'password1' });
    const user2 = new User({ email: 'user2@example.com', password: 'password2' });
    await user1.save();
    await user2.save();

    const req = {
      params: {
        identifier: user1._id.toString(),
      },
      body: {
        email: 'user2@example.com',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'O e-mail já está em uso por outro usuário' });
  });
});

describe('getUser', () => {
  it('Deve retornar um usuário pelo ID', async () => {
    const user = new User({ email: 'test@example.com', password: 'password' });
    await user.save();

    const req = {
      params: {
        identifier: user._id.toString(),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      email: 'test@example.com',
    }));

    // Verifique que a senha não está presente nos dados de retorno
    expect(res.json.mock.calls[0][0].password).toBeUndefined();
  });

  it('Deve retornar um usuário pelo email', async () => {
    const user = new User({ email: 'test@example.com', password: 'password' });
    await user.save();

    const req = {
      params: {
        identifier: 'test@example.com',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      email: 'test@example.com',
    }));

    // Verifique que a senha não está presente nos dados de retorno
    expect(res.json.mock.calls[0][0].password).toBeUndefined();
  });

  it('Deve retornar 404 se o usuário não for encontrado', async () => {
    const req = {
      params: {
        identifier: 'nonexistentuser',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
  });
});

describe('deleteUser', () => {
  it('Deve deletar um usuário pelo ID', async () => {
    const user = new User({ email: 'test@example.com', password: 'password' });
    await user.save();

    const req = {
      params: {
        identifier: user._id.toString(),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário deletado com sucesso' });

    // Verifique se o usuário foi realmente deletado
    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
  });

  it('Deve deletar um usuário pelo email', async () => {
    const user = new User({ email: 'test@example.com', password: 'password' });
    await user.save();

    const req = {
      params: {
        identifier: 'test@example.com',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário deletado com sucesso' });

    // Verifique se o usuário foi realmente deletado
    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
  });

  it('Deve retornar 404 se o usuário não for encontrado', async () => {
    const req = {
      params: {
        identifier: 'nonexistentuser',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
  });
});
