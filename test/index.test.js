'use strict';

const expect = require('chai').expect;
const Midtrans = require('./../index');
const _ = require('lodash');
const configSingle = require('./config.single.test.json');
const configMultiple = require('./config.multiple.test.json');

const midtransSingle = new Midtrans(configSingle);
const midtransMultiple = new Midtrans(configMultiple);


describe('index.js', ()=> {
  describe('Midtrans Config Single', ()=> {
    it('Should a single Object', ()=> {
      expect(configSingle).to.be.an('object');
      expect(configSingle).to.be.not.empty;
    });

    it('Should have `clientKey` property', ()=> {
      expect(configSingle).to.have.property('clientKey');
      expect(configSingle.clientKey).to.exist;
      expect(configSingle.clientKey).to.be.a('string');
    });

    it('Should have `serverKey` property', ()=> {
      expect(configSingle).to.have.property('serverKey');
      expect(configSingle.serverKey).to.exist;
      expect(configSingle.serverKey).to.be.a('string');
    });

    it('Should have `isProduction` property', ()=> {
      expect(configSingle).to.have.property('isProduction');
      expect(configSingle.isProduction).to.exist;
      expect(configSingle.isProduction).to.be.a('boolean');
    });
  });

  describe('Midtrans Config Multiple', ()=> {
    it('Should an Array of Object', ()=> {
      expect(configMultiple).to.be.an('array');
      expect(configMultiple).to.be.not.empty;
      configMultiple.forEach((obj) => {
        expect(obj).to.be.an('object');
        expect(obj).to.be.not.empty;
      });
    });

    it('Object in Array should have `name` property', ()=> {
      configMultiple.forEach((obj) => {
        expect(obj).to.have.property('name');
        expect(obj.name).to.exist;
        expect(obj.name).to.be.a('string');
      });
    });

    it('Object in Array should have `clientKey` property', ()=> {
      configMultiple.forEach((obj) => {
        expect(obj).to.have.property('clientKey');
        expect(obj.clientKey).to.exist;
        expect(obj.clientKey).to.be.a('string');
      });
    });

    it('Object in Array should have `serverKey` property', ()=> {
      configMultiple.forEach((obj) => {
        expect(obj).to.have.property('serverKey');
        expect(obj.serverKey).to.exist;
        expect(obj.serverKey).to.be.a('string');
      });
    });

    it('Object in Array should have `isProduction` property', ()=> {
      configMultiple.forEach((obj) => {
        expect(obj).to.have.property('isProduction');
        expect(obj.isProduction).to.exist;
        expect(obj.isProduction).to.be.a('boolean');
      });
    });
  });

  describe('Midtrans', ()=> {
    it('Should return correct api base url', ()=> {
      if (midtransSingle.credentials.isProduction) {
        expect(midtransSingle.getBaseUrl()).to.equal('https://api.veritrans.co.id/v2');
      } else {
        expect(midtransSingle.getBaseUrl()).to.equal('https://api.sandbox.veritrans.co.id/v2');
      }

      if (_.isPlainObject(midtransMultiple.credentials)) {
        _.forEach(midtransMultiple.credentials, (value, key) => {
          if (midtransMultiple.credentials[key].isProduction) {
            expect(midtransMultiple.getBaseUrl(key)).to.equal('https://api.veritrans.co.id/v2');
          } else {
            expect(midtransMultiple.getBaseUrl(key)).to.equal('https://api.sandbox.veritrans.co.id/v2');
          }
        });
      }
    });
  })
});
