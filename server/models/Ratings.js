module.exports = (sequelize, DataTypes) => {
  const Ratings = sequelize.define("Ratings", {
    ratingValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Set default value to 0
    },
  });

  Ratings.associate = (models) => {
    Ratings.belongsTo(models.Users, {
      foreignKey: "UserId",
    });
    Ratings.belongsTo(models.Posts, {
      foreignKey: "PostId",
    });
  };

  return Ratings;
};
