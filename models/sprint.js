const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Sprint extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Sprint.init(
        {
            name: DataTypes.STRING,
            isCompleted: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'Sprint',
        }
    )
    return Sprint
}
