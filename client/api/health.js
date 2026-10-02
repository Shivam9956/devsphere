module.exports = (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'DevSphere Global API is operational',
    timestamp: new Date().toISOString()
  });
};
