const {Temperament, Dog, conn } = require('../../src/db.js');
const { expect } = require('chai');
const { v4: uuidv4 } = require('uuid');

const id = uuidv4();

const wrongDog = {
  id:null,
  name: 'Pug',
  weight:[34,50],
  height:[50,60]
};
const dog = {
  id:id,
  name: 'Doge',
  weight:[34,50],
  height:[50,60]
};

describe('Dog model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));

  describe('Validators', () => {
    beforeEach(() => Dog.sync({ force: true }));
    describe('name', () => {
      it('should throw an error if id is null', (done) => {
        Dog.create(wrongDog)
          .then(() => done(new Error('It requires a valid id')))
          .catch(() => done());
      });
      it('should work when its a valid id', () => {
        Dog.create(dog)
        .then(() => {
          return Dog.findOne({
            where: {
              name: 'Doge'
            },
            include: {
              model: Temperament
            }
          });
        })
        .then(dog => {
          expect(dog.id).to.equal(id);
        });
      });
    });
  });
})