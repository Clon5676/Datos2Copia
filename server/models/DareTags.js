module.exports = (sequelize, DataTypes) => {
  const DareTags = sequelize.define("DareTags", {
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return DareTags;
};
