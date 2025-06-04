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

    const materials = require('../data/material.json');

    materials.forEach(el => el.createdAt = el.updatedAt = new Date());

    await queryInterface.bulkInsert('Materials', materials);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Materials', null, {
      restartIdentity: true,
      truncate: true,
      cascade: true
    });

  }
};
