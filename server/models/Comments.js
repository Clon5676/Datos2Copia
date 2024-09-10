module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    commentBody: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Comments.associate = (models) => {
    Comments.belongsTo(models.Users, {
      foreignKey: "UserId",
    });
    Comments.belongsTo(models.Posts, {
      foreignKey: "PostId",
    });
  };

  return Comments;
};
