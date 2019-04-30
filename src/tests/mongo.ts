import mongoose from 'mongoose';

class TestMongo {
  private uri: string;

  constructor(uri) {
    this.uri = uri;
  }

  public connect() {
    mongoose.connect(this.uri, { useNewUrlParser: true })
      .catch((err) => {
        console.log(`Error connecting to mongo database: ${err}`);
        process.exit(1);
      });
  }

  public disconnect() {
    mongoose.connection.close();
  }
}

export default TestMongo;
