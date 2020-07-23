const { UserModelEnums } = require('../enums/model-enums')

const { defaultAnonymousUser } = UserModelEnums

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Sprints', [
            {
                id: 1,
                name: 'Adam Eve sprint',
                AdminUserId: defaultAnonymousUser.id,
                isCompleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ])

        await queryInterface.bulkInsert('SprintItems', [
            {
                id: 1,
                title: 'Eat apple from tree',
                SprintId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ])
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Sprints', null, {})
        await queryInterface.bulkDelete('SprintItems', null, {})
    },
}
