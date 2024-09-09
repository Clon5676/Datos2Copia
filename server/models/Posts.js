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
      // Foreign key to reference Dares
      type: DataTypes.INTEGER,
      references: {
        model: "Dares", // The table name
        key: "id", // The primary key in the Dares table
      },
      allowNull: false,
    },
  });

  Posts.associate = (models) => {
    Posts.belongsTo(models.Dares, {
      // Association to Dares
      foreignKey: "DareId",
      onDelete: "CASCADE",
    });
    Posts.hasMany(models.Comments, {
      onDelete: "CASCADE",
    });
  };

  return Posts;
};
