module.exports = {
  ddd: async (req, res, next) => {
    try {
      res.status(200).send('ddd');
    } catch (err) {
      next(err)
    }
  },
};
