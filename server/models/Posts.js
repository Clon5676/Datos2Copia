module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
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
    DareId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Dares",
        key: "id",
      },
      allowNull: false,
    },
  });

  Posts.associate = (models) => {
    Posts.belongsTo(models.Dares, {
      foreignKey: "DareId",
    });
    Posts.hasMany(models.Comments, {
      onDelete: "CASCADE",
    });
  };

  return Posts;
};
