import 'mocha';
import { expect } from 'chai';
import request from 'request';

// URL base del servidor
const baseUrl = 'http://localhost:3000';

describe('Cartas', function () {
  describe('GET /cards con ID de carta', function () {
    it('Debería devolver un error si la carta no existe', function (done) {
      request.get(baseUrl + '/cards?username=test_user&id=999', function (error, response, body) {
        expect(response.statusCode).to.equal(404);
        done();
      });
    });
  });

  it('Debería devolver la información de la carta solicitada', function (done) {
    request.get(baseUrl + '/cards?username=test_user&id=1', function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  describe('POST /cards', function () {
    it('Debería agregar una nueva carta al usuario', function (done) {
      const nuevaCarta = {
        id: 2,
        name: "Black Lotus",
        cost: 20000,
        color: "Rojo",
        cardType: "Tierra",
        rarity: "Rara",
        rulesText: "practicas todas las semanas",
        marketValue: 1
      };

    request.post({
      url: baseUrl + '/cards?username=test_user',
      json: true,
      body: nuevaCarta
    }, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});

  describe('DELETE /cards', function () {
    it('Debería notificar un error al intentar eliminar una carta no existente', function (done) {
      request.delete(baseUrl + '/cards?username=test_user&id=999', function (error, response, body) {
        expect(response.statusCode).to.equal(404);
        done();
      });
    });
  });

});