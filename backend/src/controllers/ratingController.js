const { Rating, Store, sequelize } = require('../models');
const realtime = require('../realtime');

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

    // After saving the rating, compute top stores snapshot and broadcast
    try {
      const ratingSubq = `(
        SELECT COALESCE(ROUND(AVG("value"), 1), 0)
        FROM "ratings"
        WHERE "ratings"."storeId" = "Store"."id"
      )`;

      const topStores = await Store.findAll({
        attributes: {
          include: [[sequelize.literal(ratingSubq), 'overallRating']]
        },
        order: [[sequelize.literal(ratingSubq), 'DESC']],
        limit: 5
      });

      realtime.emit('storesUpdate', topStores.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        overallRating: parseFloat(s.get('overallRating'))
      })));
    } catch (e) {
      // non-fatal: log and continue
      console.error('Failed to compute top stores for realtime update', e);
    }

    res.status(201).json({
      status: 'success',
      message: 'Rating submitted successfully.',
      data: { rating: newRating }
    });
  } catch (error) {
    next(error);
  }
};