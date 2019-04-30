# Confi

Confi is a small project written in tpyescript that allows user to sign up for upcoming conference.
Upon registration greeting email will be sent to the new guest.


## Installation

Code is written for node [10.14.1](https://nodejs.org/en/download/releases/).
Make sure you have the appropriate version before we go any further.
Use the package manager [npm](https://www.npmjs.com/get-npm) to install Confi.

```bash
npm install
```

## Usage

To run the project on default port 5000. Use following commands:
```bash
npm run dev
```

After running server endpoints documentation is reachable on the following link:
** note ** all changes in the swagger is applied to the actual database.
http://localhost:5000/api-docs

Admin user credentials:
user: admin@confi.com
pw: password

After login make sure to copy content of the response header 'X-Set-Cookie' into the 'Cookie' for admin endpoints (more in swagger).

Running tests with:
```bash
npm run test
```

Linting code with:
```bash
npm run lint
```

If you wish to run the application in the docker run the following command:
```bash
docker-compose up -d --build
```

## License
[MIT](https://choosealicense.com/licenses/mit/)