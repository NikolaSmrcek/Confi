import chai from 'chai';
import chai_http from 'chai-http';
import * as _ from 'lodash';
import UserModel from '../../../business_logic/users/user.model';
import config from '../../config.json';
import TestMongo from '../../mongo';
import ResponseValidator from '../../validators/response';
const { expect } = chai;
const env = process.env.NODE_ENV || 'development';
const { uri, adminUser, mongo } = config.environments[env];
chai.use(chai_http);

describe('Users registaration flow', () => {
  const mongoConn = new TestMongo(mongo.uri);
  const resValidator = new ResponseValidator();
  const newTestUser = {
    firstName: 'testFirstName',
    lastName: 'testLastName',
    email: 'test111@confi.com',
    phoneNumber: 'testPhone',
  };
  let cookie = '';
  describe('Register', () => {
    let user = {
      _id: '',
    };
    before(() => {
      return chai.request(uri)
        .post('/api/login')
        .send(adminUser)
        .then((res) => {
          cookie = res.header['x-set-cookie'];
          return mongoConn.connect();
        });
    });
    after(() => {
      return UserModel.deleteOne({ email: newTestUser.email })
       .then(() => mongoConn.disconnect());
    });
    it('Should return 400 with invalid message when passing lastName as number.', (done) => {
      chai.request(uri)
        .post('/api/register')
        .send({ lastName: 66 })
        .then((res) => {
          resValidator.validateError(res.body, 400, 'Invalid user data for registration!');
          done();
        })
        .catch(done);
    });
    it('Should return 400 with invalid message if missing mandatory fields.', (done) => {
      chai.request(uri)
        .post('/api/register')
        .send({ lastName: 'lastName' })
        .then((res) => {
          resValidator.validateError(res.body, 400, 'Invalid user data for registration!');
          done();
        })
        .catch(done);
    });
    it('Should return 400 with invalid message if passed non valid email', (done) => {
      chai.request(uri)
        .post('/api/register')
        .send({ lastName: 'lastName', email: 'email', firstName: 'firstName', phoneNumber: 'phone' })
        .then((res) => {
          resValidator.validateError(res.body, 400, 'Invalid email format.');
          done();
        })
        .catch(done);
    });
    it('Should return 400 with invalid message email is already registered.', (done) => {
      chai.request(uri)
        .post('/api/register')
        .send({ lastName: 'lastName', email: adminUser.email, firstName: 'firstName', phoneNumber: 'phone' })
        .then((res) => {
          resValidator.validateError(res.body, 400, 'User with the provided email already exists.');
          done();
        })
        .catch(done);
    });
    it('Should create new user, applying him to event', (done) => {
      chai.request(uri)
        .post('/api/register')
        .send(newTestUser)
        .then((res) => {
          expect(res.status).to.be.a('number').and.to.eql(201);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.a('string');
          expect(res.body.status).to.eql('success');

          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(!_.isEmpty(res.body.message));
          done();
        })
        .catch(done);
    });
    it('Should have new user listed in the event - as admin user', (done) => {
      chai.request(uri)
        .get('/api/admin/bookings')
        .set('Cookie', cookie)
        .then((res) => {
          expect(!_.isEmpty(res.body));
          expect(!_.isEmpty(res.body.participants));
          const newUser = res.body.participants.filter(p => p.email === newTestUser.email);
          expect(!_.isEmpty(newUser));
          user = newUser[0];
          done();
        })
        .catch(done);
    });
    it('Should remove new user from event - as admin', (done) => {
      chai.request(uri)
        .delete(`/api/admin/bookings/${user._id.toString()}`)
        .set('Cookie', cookie)
        .then((res) => {
          expect(!_.isEmpty(res.body));
          expect(res.status).to.be.a('number').and.to.eql(204);
          done();
        })
        .catch(done);
    });
  });
});
