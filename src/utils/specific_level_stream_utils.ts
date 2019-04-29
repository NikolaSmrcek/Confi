import * as bunyan from 'bunyan';
import safeJsonStringify from 'safe-json-stringify';
import * as stream from 'stream';
const { safeCycles } = bunyan;

class SpecificLevelStream extends stream.Writable {
  private levels: object;
  private stream: any;

  constructor (levels, streamParam) {
    super();
    this.stream = streamParam;
    this.levels = {};
    levels.forEach((lvl) => {
      this.levels[bunyan.resolveLevel(lvl)] = true;
    });
  }

  public write (rec: any) {
    if (this.levels[rec.level] !== undefined) {
      const str = `${this.fastAndSafeJsonStringify(rec)}\n`;
      return this.stream.write(str);
    }
  }

  private fastAndSafeJsonStringify (rec: any) {
    try {
      return JSON.stringify(rec);
    } catch (ex) {
      try {
        return JSON.stringify(rec, safeCycles());
      } catch (e) {
        return safeJsonStringify(rec);
      }
    }
  }
}

export default SpecificLevelStream;
