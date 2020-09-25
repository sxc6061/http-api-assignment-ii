// Note this object is purely in memory
const users = {};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  // no content to send, just headers!
  response.writeHead(status, headers);
  response.end();
};

const getUsers = (request, response) => {
  // create a parent object to hold the users object
  // we could add a message, status code etc ... to this parent object
  const responseJSON = {
    users,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) =>
  // would also be nice to calculate file size, last-modified date etc ...
  // and send that too
  respondJSONMeta(request, response, 200);
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'name and age are both required',
  };

  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON); // 400=bad request
  }

  // we DID get a name and age
  let responseCode = 201; // "created"
  if (users[body.name]) { // user exists
    responseCode = 204; // updating, so "no content"
  } else {
    users[body.name] = {}; // make a new user
  }

  // update or initialize values, as the case may be
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode); // this is for 204, a "no content" header
};

const updateUser = (request, response) => {
  const newUser = {
    createdAt: Date.now(),
  };

  users[newUser.createdAt] = newUser; // never do this in the real world!
  // 201 status code == "created"
  return respondJSON(request, response, 201, newUser);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found!',
    id: 'notFound',
  };
  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getUsers,
  getUsersMeta,
  addUser,
  updateUser,
  notFound,
  notFoundMeta,
};
