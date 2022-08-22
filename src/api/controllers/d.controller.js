module.exports = {
  d: async (req, res, next) => {
    try {
      res.status(200).send('d');
    } catch (err) {
      next(err)
    }
  },
};
