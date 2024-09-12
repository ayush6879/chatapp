// jwt is used to autherise user in backend
// it is json web token


const jwt = require('jsonwebtoken');

const generateToken = (id) => {
return jwt.sign({ id }, process.env.JWT_SECRET , {
    expiresIn:"30d",
});
};

module.exports = generateToken;