module.exports = {
    up: async (queryInterface, Sequelize) => {
        // await queryInterface.createTable('users', { id: Sequelize.INTEGER })
        await queryInterface.addColumn(
            'Sprints', // name of Source model
            'AdminUserId', // name of the key we're adding
            {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users', // name of Target model
                    key: 'id', // key in Target model that we're referencing
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            }
        )
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'Sprints', // name of Source model
            'AdminUserId' // key we want to remove
        )
    },
}
