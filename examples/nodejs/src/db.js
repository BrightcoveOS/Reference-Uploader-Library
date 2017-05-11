var store = {}; // Use a simple, dependency-free, in memory store.

function getApiRequestUrl(videoId) {
  return store[videoId].api_request_url;
}

function getSecretAccessKey(videoId) {
  return store[videoId].secret_access_key;
}

function getSecurityToken(videoId) {
  return store[videoId].session_token;
}

function save(videoId, response) {
  store[videoId] = response;
}

module.exports = {
  getSecretAccessKey,
  getSecurityToken,
  getApiRequestUrl,
  save,
};
