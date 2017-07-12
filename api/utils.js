'use strict';

function hashPassword(password, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      return callback(err, hash);
    });
  });
}

module.exports = {
  hashPassword: hashPassword,
};