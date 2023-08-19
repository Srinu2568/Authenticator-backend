const home = (req, res, next) => {
  res.json({
    status: true,
    message: 'server is up and running',
    reqData: req.authData,
  });
};

module.exports = home;
