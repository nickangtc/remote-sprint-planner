const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class SprintItem extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            SprintItem.belongsTo(models.Sprint)
        }
    }
    SprintItem.init(
        {
            title: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'SprintItem',
        }
    )
    return SprintItem
}
