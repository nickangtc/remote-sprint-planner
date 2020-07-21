module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.addColumn(
            'SprintItems', // name of Source model
            'SprintId', // name of the key we're adding
            {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Sprints', // name of Target model
                    key: 'id', // key in Target model that we're referencing
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            }
        )
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        return queryInterface.removeColumn(
            'SprintItems', // name of Source model
            'SprintId' // key we want to remove
        )
    },
}
