let config = {
    apiUrl: process.env.API_URL,
    apiKeyName: process.env.API_KEY_NAME,
    apiKeyValue: process.env.API_KEY_VALUE,
    dnsRestrict: process.env.DNS_RESTRICT,
    port: process.env.PORT || 3000,
    assignKey: assignKey
}

function assignKey(query){
  let obj = {};
  obj[config.apiKeyName] = config.apiKeyValue;
  return Object.assign(query, obj);
}

module.exports = config;