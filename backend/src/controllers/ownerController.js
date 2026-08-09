const { Store, Rating, User, sequelize } = require('../models');

exports.getDashboard = async (req, res, next) => {
  try {
    const ownerId = req.user.userId; 

    
    const store = await Store.findOne({
      where: { ownerId },
      attributes: {
        include: [
          
          [
            sequelize.literal(`(
              SELECT COALESCE(ROUND(AVG("value"), 1), 0)
              FROM "ratings"
              WHERE "ratings"."storeId" = "Store"."id"
            )`),
            'averageRating'
          ]
        ]
      },
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['id', 'value', 'createdAt'],
          include: [
            {
              
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'] 
            }
          ]
        }
      ],
      
      order: [[{ model: Rating, as: 'ratings' }, 'createdAt', 'DESC']]
    });

    if (!store) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'No store found assigned to your account.' 
      });
    }

    res.status(200).json({
      status: 'success',
      data: { store }
    });
  } catch (error) {
    next(error);
  }
};