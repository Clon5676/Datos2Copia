module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    dare: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    approvals: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    disapproval: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Posts.associate = (models) => {
    Posts.hasMany(models.Comments, {
      onDelete: "cascade",
    });
  };
  return Posts;
};
