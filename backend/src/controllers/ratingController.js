const { Rating, Store } = require('../models');

exports.submitRating = async (req, res, next) => {
  try {
    const { storeId, value } = req.body;
    const userId = req.user.userId; 

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ status: 'error', message: 'Store not found.' });
    }
    const existingRating = await Rating.findOne({
      where: { storeId, userId }
    });

    if (existingRating) {
      existingRating.value = value;
      await existingRating.save();

      return res.status(200).json({
        status: 'success',
        message: 'Rating updated successfully.',
        data: { rating: existingRating }
      });
    }

    const newRating = await Rating.create({
      value,
      storeId,
      userId
    });

    res.status(201).json({
      status: 'success',
      message: 'Rating submitted successfully.',
      data: { rating: newRating }
    });
  } catch (error) {
    next(error);
  }
};