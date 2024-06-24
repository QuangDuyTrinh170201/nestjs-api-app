//make a database for testing
//Everytime we run tests, clean up data
//we must call request like we do with postman
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';

const PORT = 3000;
describe('App EndToEnd tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.listen(PORT);
    prismaService = app.get(PrismaService);
    await prismaService.cleanDatabase();
    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });
  describe('Test Authentication', () => {
    describe('Register', () => {
      it('should show error with empty email', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: '',
            password: '123456789',
          })
          .expectStatus(400);
        // .inspect();
      });
      it('should show error with invalid email format', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'testemail01',
            password: '123456789',
          })
          .expectStatus(400);
        // .inspect();
      });
      it('should show error with do not have password', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'testemail01@gmail.com',
            password: '',
          })
          .expectStatus(400);
        // .inspect();
      });
      it('should register', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'testemail01@gmail.com',
            password: '123456789',
          })
          .expectStatus(201);
        // .inspect();
      });
    });
    describe('Login', () => {
      it('should login', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody({
            email: 'testemail01@gmail.com',
            password: '123456789',
          })
          .expectStatus(201)
          .stores('accessToken', 'accessToken');
        // .inspect();
      });
    });
    describe('User', () => {
      describe('Get Detail User', () => {
        it('should get detail user', () => {
          return pactum
            .spec()
            .get(`/users/me`)
            .withHeaders({
              Authorization: 'Bearer $S{accessToken}',
            })
            .expectStatus(200)
            .stores('userId', 'id');
        });
      });
    });
    describe('Note', () => {
      describe('Insert Note', () => {
        it('insert first note', () => {
          return pactum
            .spec()
            .post('/notes')
            .withHeaders({
              Authorization: 'Bearer $S{accessToken}',
            })
            .withBody({
              title: 'This is title test',
              description: 'description test',
              url: 'www.testpactum.com',
            })
            .expectStatus(201)
            .stores('nodeId01', 'id')
            .inspect();
        });
      });

      describe('Get all Notes', () => {
        it('get all note', () => {
          return (
            pactum
              .spec()
              .get('/notes')
              .withHeaders({
                Authorization: 'Bearer $S{accessToken}',
              })
              // .withBody({
              //   title: 'This is title test',
              //   description: 'description test',
              //   url: 'www.testpactum.com',
              // })
              .expectStatus(200)
              .stores('nodeId01', 'id')
              .inspect()
          );
        });
      });

      describe('Get Note by Id', () => {
        it('get note by id', () => {
          return (
            pactum
              .spec()
              .get('/notes')
              .withHeaders({
                Authorization: 'Bearer $S{accessToken}',
              })
              // .withBody({
              //   title: 'This is title test',
              //   description: 'description test',
              //   url: 'www.testpactum.com',
              // })
              .withPathParams('id', '$S{nodeId01}')
              .expectStatus(200)
              .inspect()
          );
        });
      });

      describe('Update note', () => {
        it('update note', () => {
          return pactum
            .spec()
            .patch('/notes/{id}') // Sửa đường dẫn để bao gồm {id}
            .withHeaders({
              Authorization: 'Bearer $S{accessToken}',
            })
            .withBody({
              title: 'This is title test',
              description: 'description test',
              url: 'www.testpactum.com',
            })
            .withPathParams('id', '$S{nodeId01}') // Sửa thành $S{noteId01} thay vì $S{nodeId01}
            .expectStatus(200)
            .inspect();
        });
      });

      describe('Delete Notes by Id', () => {
        it('delete note by id', () => {
          return pactum
            .spec()
            .delete('/notes')
            .withHeaders({
              Authorization: 'Bearer $S{accessToken}',
            })
            .withQueryParams('id', '$S{nodeId01}')
            .inspect()
            .expectStatus(204);
        });
      });
    });
  });

  afterAll(async () => {
    app.close();
  });
  it.todo('should PASS, kaka');
});
