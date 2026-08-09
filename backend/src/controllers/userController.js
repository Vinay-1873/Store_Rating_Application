const { Op } = require('sequelize');
const { User } = require('../models');

exports.getAllUsers = async (req, res, next) => {
  try {
    const { 
      name, 
      email, 
      address, 
      role, 
      sortBy = 'createdAt', 
      order = 'DESC' 
    } = req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (email) whereClause.email = { [Op.like]: `%${email}%` };
    if (address) whereClause.address = { [Op.like]: `%${address}%` };
    if (role) whereClause.role = role;

    const users = await User.findAll({
      where: whereClause,
      order: [[sortBy, order.toUpperCase()]],
      attributes: { exclude: ['password'] } 
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};