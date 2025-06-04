'use strict';
const {
  Model
} = require('sequelize');

const formatDate = require('../helpers/dateFormatter');
const formatCurrency = require('../helpers/currencyFormatter');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User);

      // 1:N
      Order.hasMany(models.OrderDetail);

      // M:N
      Order.belongsToMany(models.Material, { through: models.OrderDetail });
    }

    get uploadedDate() {
      return formatDate(this.createdAt);
    }

    get paymentDate() {
      return formatDate(this.paymentAt);
    }

    get rupiahCurrency() {
      return formatCurrency(this.totalPrice);
    }
  }
  Order.init({
    paidStatus: DataTypes.BOOLEAN,
    filePath: DataTypes.STRING,
    paymentAt: DataTypes.DATE,
    UserId: DataTypes.INTEGER,
    fileName: DataTypes.STRING,
    totalPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};