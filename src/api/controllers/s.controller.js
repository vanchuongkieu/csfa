module.exports = {
  s: async (req, res, next) => {
    try {
      res.status(200).send('s');
    } catch (err) {
      next(err)
    }
  },
};
