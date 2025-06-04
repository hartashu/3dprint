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

    const orders = require('../data/order.json');

    orders.forEach(el => el.createdAt = el.updatedAt = el.paymentAt = new Date());

    await queryInterface.bulkInsert('Orders', orders);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Orders', null, {
      restartIdentity: true,
      truncate: true,
      cascade: true
    });
  }
};
