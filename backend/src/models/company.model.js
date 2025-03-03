const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: /^[a-z0-9-]+$/i
      }
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active'
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true
    },
    size: {
      type: DataTypes.ENUM('small', 'medium', 'large', 'enterprise'),
      allowNull: true
    },
    address: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dataRetentionPeriod: {
      type: DataTypes.INTEGER,
      defaultValue: 365, // Days
      allowNull: false
    },
    billingInfo: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    brandColors: {
      type: DataTypes.JSONB,
      defaultValue: {
        primary: '#1976d2',
        secondary: '#dc004e',
        accent: '#9c27b0'
      }
    },
    subscriptionPlan: {
      type: DataTypes.ENUM('free', 'basic', 'professional', 'enterprise'),
      defaultValue: 'free'
    },
    subscriptionStatus: {
      type: DataTypes.ENUM('active', 'pending', 'canceled', 'expired'),
      defaultValue: 'active'
    },
    subscriptionEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'companies',
    timestamps: true,
    paranoid: true, // Soft delete
    hooks: {
      beforeCreate: (company) => {
        if (!company.slug) {
          // Create slug from company name if not provided
          company.slug = company.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
      }
    }
  });

  return Company;
};
