const { UserModelEnums } = require('../enums/model-enums')

const { defaultAnonymousUser } = UserModelEnums

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [
            {
                ...defaultAnonymousUser,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ])
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {})
    },
}
