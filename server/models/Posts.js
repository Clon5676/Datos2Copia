module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    postText: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    averageRating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    DareId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Dares",
        key: "id",
      },
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: false,
    },
  });

  Posts.associate = (models) => {
    Posts.belongsToMany(models.Tags, { through: "PostTags" });
    Posts.belongsTo(models.Dares, {
      foreignKey: "DareId",
    });
    Posts.belongsTo(models.Users, {
      foreignKey: "UserId",
    });
    Posts.hasMany(models.Comments, {
      onDelete: "CASCADE",
    });
    Posts.hasMany(models.Ratings, {
      onDelete: "CASCADE",
    });
  };

  return Posts;
};
