'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const orders = require('../data/orderDetail.json');

    orders.forEach(el => el.createdAt = el.updatedAt = new Date());

    await queryInterface.bulkInsert('OrderDetails', orders);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('OrderDetails', null, {
      restartIdentity: true,
      truncate: true,
      cascade: true
    });
  }
};
