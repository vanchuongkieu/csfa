module.exports = {
  sdd: async (req, res, next) => {
    try {
      res.status(200).send('sdd');
    } catch (err) {
      next(err)
    }
  },
};
