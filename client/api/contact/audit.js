const contactHandler = require('../contact');

module.exports = async (req, res) => {
  if (req.body) {
    req.body.type = 'audit';
  }
  return contactHandler(req, res);
};
