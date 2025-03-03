const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Report = sequelize.define('Report', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      }
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    dashboardId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'dashboards',
        key: 'id'
      }
    },
    format: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pdf'
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'draft'
    },
    shareable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    shareLink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sharePassword: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shareExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'reports',
    timestamps: true
  });

  return Report;
};
