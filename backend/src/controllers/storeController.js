const { Op } = require('sequelize');
const { Store, User, Rating } = require('../models');
const sequelize = require('../config/database');

exports.createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const owner = await User.findByPk(ownerId);
    
    if (!owner) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }
    
    if (owner.role !== 'Store Owner') {
      return res.status(400).json({ 
        status: 'error', 
        message: 'The assigned user must have the role of Store Owner.' 
      });
    }

    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'A store with this email already exists.' 
      });
    }

    const newStore = await Store.create({
      name,
      email,
      address,
      ownerId
    });

    res.status(201).json({
      status: 'success',
      message: 'Store created successfully',
      data: { store: newStore }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllStores = async (req, res, next) => {
  try {
    const { 
      name, 
      email, 
      address, 
      sortBy = 'createdAt', 
      order = 'DESC' 
    } = req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (email) whereClause.email = { [Op.like]: `%${email}%` };
    if (address) whereClause.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where: whereClause,
      order: [[sortBy, order.toUpperCase()]],
      include: [
        { 
          model: User, 
          as: 'owner', 
          attributes: ['id', 'name', 'email'] 
        }
      ]
    });

    res.status(200).json({
      status: 'success',
      results: stores.length,
      data: { stores }
    });
  } catch (error) {
    next(error);
  }
};

exports.getStoresForNormalUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { 
      name, 
      address, 
      sortBy = 'name', 
      order = 'ASC' 
    } = req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (address) whereClause.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where: whereClause,
      order: [[sortBy, order.toUpperCase()]],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COALESCE(ROUND(AVG("value"), 1), 0)
              FROM "ratings"
              WHERE "ratings"."storeId" = "Store"."id"
            )`),
            'overallRating'
          ]
        ],
        exclude: ['createdAt', 'updatedAt', 'ownerId']
      },
      include: [
        {
          model: Rating,
          as: 'ratings',
          where: { userId },
          required: false, 
          attributes: ['value']
        }
      ]
    });

    res.status(200).json({
      status: 'success',
      results: stores.length,
      data: { stores }
    });
  } catch (error) {
    next(error);
  }
};