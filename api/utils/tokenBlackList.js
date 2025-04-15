const blacklistedTokens = new Set();

exports.addToBlacklist = (token) => {
  blacklistedTokens.add(token);
};

exports.isBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};