/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Dog, conn } = require('../../src/db.js');
const { v4: uuidv4 } = require('uuid');

const id = uuidv4();

const agent = session(app);
const dog = {
  id:id,
  name: 'Pug',
  weight:[34,50],
  height:[50,60]
};

describe('Dogs routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => Dog.sync({ force: true })
    .then(() =>Dog.create(dog)));
  describe('GET /dogs', () => {
    it('should get 200', (done) =>{
        agent.get('/dogs').expect(200);
        done();
      }
    );
  });
});
