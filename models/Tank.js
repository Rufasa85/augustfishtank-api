module.exports = function(sequelize, DataTypes) {
    var Tank = sequelize.define('Tank', {
        // add properites here
         name: DataTypes.STRING
    });

    Tank.associate = function(models) {
        // add associations here
        Tank.hasMany(models.Fish);
        Tank.belongsTo(models.User);
    };

    return Tank;
};