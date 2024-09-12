module.exports = (sequelize, DataTypes) => {
  const PostTags = sequelize.define("PostTags", {
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return PostTags;
};
