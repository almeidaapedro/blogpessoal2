import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos Módulos Usuario e Auth (e2e)', () => {
  let token: any;
  let usuarioId: any;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: "db_blogpessoal_test.db",
          entities: [__dirname + "./../src/*/entities/.entity.ts"],
          synchronize: true,
          dropSchema: true
        }),
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('01 - Deve Cadastrar um novo Usuário', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      expect(201);
    usuarioId = resposta.body.id;
  });

  it('02 - Não deve cadastrar um usuário duplicado', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      expect(400);
  });

  it('03 - Deve autenticar o usuário(Login)', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot',
      })
      expect(200);

    token = resposta.body.token;
    console.log('Token: ' + token);
  });

  it('04 - Deve listar todos os usuários', async () => {
    return request(app.getHttpServer())
      .get('/usuarios/all')
      .set('Authorization', `${token}`)
      .send({})
      expect(200);
  });

  it('05 - Deve atualizar um usuário', async () => {
    return request(app.getHttpServer())
      .put('/usuarios/atualizar')
      .set('Authorization', `${token}`)
      .send({
        id: usuarioId,
        nome: 'Giano',
        usuario: 'root@root.com',
        senha: 'giano123',
        foto: '-',
      })
      expect(200)
  });

  it('06 - Deve encontrar usuário através do Id', async () => {
    let id = 1;
    return request(app.getHttpServer())
      .get(`/usuarios/${id}`)
      .set('Authorization', `${token}`)
      .send({})
      expect(200);
  });
});