import chai from 'chai';
import chai_http from 'chai-http';
import * as _ from 'lodash';
import config from '../../config.json';
import ResponseValidator from '../../validators/response';
const { expect } = chai;
const env = process.env.NODE_ENV || 'development';
const { uri, adminUser } = config.environments[env];
chai.use(chai_http);

describe('Authentication service', () => {
  const resValidator = new ResponseValidator();
  describe('Login', () => {
    const invalidUser = {
      email: 'non_valid@something.com',
      password: 'THIS_IS_NON_VALID',
    };
    it('Should return 400 with invalid message while trying to login with faulty data', (done) => {
      chai.request(uri)
        .post('/api/login')
        .send(invalidUser)
        .then((res) => {
          resValidator.validateError(res.body, 400, 'Invalid login data provided.');
          done();
        })
        .catch(done);
    });
    it('Should successfully login as admin and set jwt cookie header', (done) => {
      chai.request(uri)
        .post('/api/login')
        .send(adminUser)
        .then((res) => {
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.a('string');
          expect(res.body.status).to.eql('success');

          expect(!_.isEmpty(res.header));
          expect(!_.isEmpty(res.header['x-set-cookie']));
          done();
        })
        .catch(done);
    });
  });
});
