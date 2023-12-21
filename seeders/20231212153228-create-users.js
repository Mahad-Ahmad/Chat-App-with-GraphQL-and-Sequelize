"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash('112233', 6);
    const createdAt = new Date();
    const updatedAt = createdAt;

    await queryInterface.bulkInsert("users", [
      {
        name: "john",
        email: "john@gmail.com",
        password: password,
        imageUrl:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1700&q=80",
        createdAt,
        updatedAt,
      },
      {
        name: "Sana",
        email: "Sana@gmail.com",
        password: password,
        imageUrl:
          "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2190&q=80",
        createdAt,
        updatedAt,
      },
      {
        name: "leah",
        email: "leah@gmail.com",
        password: password,
        imageUrl:
          "https://images.unsplash.com/photo-1586907835000-f692bbd4c9e0?q=80&w=2161&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        createdAt,
        updatedAt,
      },
      {
        name: "zara",
        email: "zara@gmail.com",
        password: password,
        imageUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        createdAt,
        updatedAt,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
