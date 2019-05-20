import Bcrypt from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birthday: {
        type: DataTypes.DATE,
    },
    address: {
        type: DataTypes.STRING,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'default.png',
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'USER'),
      allowNull: false,
      defaultValue: 'USER',
    },
    verify_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('BLOCKED', 'INACTIVE', 'ACTIVE'),
      allowNull: true,
      defaultValue: 'INACTIVE',
    },
    createdAt: {
        defaultValue: DataTypes.NOW,
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    deletedAt: {
        type: DataTypes.DATE,
    }
  }, {});
  
  // Relationship
  User.associate = function(models) {
    User.hasMany(models.Post, {
      foreignKey: 'userId',
      as: 'posts'
    });
  };
  User.generateHash = (async function (password) {
    return await Bcrypt.hash(password, 8);
  });
  User.prototype.comparePassword = async function (password) {
    return await Bcrypt.compare(password, this.dataValues.password);
  };

  User.beforeCreate(async function (user, options) {
    if (user.changed('password')) {
      user.password = await User.generateHash(user.password);
    }
    return user;
  });
  User.beforeUpdate(async function (user, options) {
    if (user.changed('password')) {
      user.password = await User.generateHash(user.password);
    }
    return user;
  });
  
  return User;
};