import * as _ from 'lodash';

function cullRequestHeaders(headers) {
  return _.omit(headers, ['Cookie-Set']);
}

function cullResponseHeaders(headers) {
  return _.omit(headers, ['Cookie-set']);
}

function stringNonstring(value) {
  return _.isString(value) ? value : JSON.stringify(value);
}

const serializers = {
  err: (err) => {
    if (err) {
      let stack;
      if (err.stack) {
        stack = err.stack.split('\n').map(e => e.trim())
          .slice(0, 4)
          .join('\n');
      }
      return {
        stack,
        message: err.message,
        name: err.name,
      };
    }
  },
  req: (req) => {
    if (!req) {
      return (false);
    }

    let path = _.get(req, 'route.path', 'unknown');
    path = _.isString(path) ? path : stringNonstring(path);

    return {
      method: req.method,
      url: req.url,
      path: stringNonstring(path),
      headers: cullRequestHeaders(req.headers),
      httpVersion: req.httpVersion,
    };
  },
  res: (res) => {
    if (!res) {
      return (false);
    }

    return ({
      statusCode: res.statusCode,
      headers: cullResponseHeaders(_.get(res, '_headers')),
    });
  },
  params: (params) => {
    const parameters = _.cloneDeep(params);

    if (parameters.password) {
      parameters.password = '####';
    }
    if (parameters.rds_token) {
      parameters.rds_token = '####';
    }

    return parameters;
  },
};

export default serializers;
