import chai from 'chai';
const { expect } = chai;

class ResponseValidator {
  constructor() {
    //
  }

  public validateError(error: any, expectedCode: number, expectedMessage: string) {
    expect(error).to.have.property('statusCode');
    expect(error.statusCode).to.be.a('number');
    expect(error.statusCode).to.eql(expectedCode);

    expect(error).to.have.property('message');
    expect(error.message).to.be.a('string');
    expect(error.message).to.eql(expectedMessage);
  }
}

export default ResponseValidator;
