module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [
            {
                firstName: 'Anonymous',
                lastName: '',
                email: 'anon@anon.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ])
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {})
    },
}
