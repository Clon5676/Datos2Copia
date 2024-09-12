module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define("Tags", {
    tagName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Tags.associate = (models) => {
    Tags.belongsToMany(models.Dares, { through: "DareTags" });
    Tags.belongsToMany(models.Posts, { through: "PostTags" });
  };

  return Tags;
};
