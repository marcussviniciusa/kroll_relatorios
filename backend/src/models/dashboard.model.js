const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Dashboard = sequelize.define('Dashboard', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    layout: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    },
    filters: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        defaultDateRange: 'last7Days',
        availableDateRanges: ['today', 'yesterday', 'last7Days', 'last30Days', 'thisMonth', 'lastMonth', 'thisYear', 'custom'],
        segments: []
      }
    },
    refreshRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0, // 0 means manual refresh only
      comment: 'Refresh rate in minutes. 0 means manual refresh only.'
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    publicAccessKey: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    publicAccessPassword: {
      type: DataTypes.STRING,
      allowNull: true
    },
    publicExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    autoGenerateThumbnail: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastViewedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isTemplate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    theme: {
      type: DataTypes.STRING,
      defaultValue: 'default'
    },
    lastGeneratedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    permissions: {
      type: DataTypes.JSONB,
      defaultValue: {
        view: ['owner', 'admin', 'editor', 'viewer'],
        edit: ['owner', 'admin', 'editor'],
        delete: ['owner', 'admin'],
        share: ['owner', 'admin', 'editor']
      }
    },
    integrations: {
      type: DataTypes.JSONB,
      defaultValue: {
        meta: {
          enabled: false,
          adAccounts: []
        },
        googleAnalytics: {
          enabled: false,
          properties: []
        }
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'archived', 'draft'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'dashboards',
    timestamps: true,
    paranoid: true, // Soft delete
    hooks: {
      beforeCreate: async (dashboard) => {
        // Generate a public access key if dashboard is public
        if (dashboard.isPublic && !dashboard.publicAccessKey) {
          dashboard.publicAccessKey = require('crypto').randomBytes(16).toString('hex');
        }
      },
      beforeUpdate: async (dashboard) => {
        // Generate a public access key if dashboard is made public
        if (dashboard.changed('isPublic') && dashboard.isPublic && !dashboard.publicAccessKey) {
          dashboard.publicAccessKey = require('crypto').randomBytes(16).toString('hex');
        }
      }
    }
  });

  Dashboard.prototype.incrementViews = async function() {
    this.views += 1;
    this.lastViewedAt = new Date();
    return this.save();
  };

  Dashboard.prototype.generateShareLink = async function(expiresIn = 30, password = null) {
    // Set expiration date
    let expiresAt = null;
    if (expiresIn && expiresIn !== 'never') {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn, 10));
    }
    
    // Generate new access key
    const publicAccessKey = require('crypto').randomBytes(16).toString('hex');
    
    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await require('bcryptjs').hash(password, 10);
    }
    
    // Update dashboard
    await this.update({
      isPublic: true,
      publicAccessKey,
      publicAccessPassword: hashedPassword,
      publicExpiresAt: expiresAt
    });
    
    return publicAccessKey;
  };

  Dashboard.prototype.verifySharePassword = async function(password) {
    if (!this.publicAccessPassword) return true;
    return await require('bcryptjs').compare(password, this.publicAccessPassword);
  };

  Dashboard.prototype.isShareExpired = function() {
    if (!this.publicExpiresAt) return false;
    return new Date() > this.publicExpiresAt;
  };

  return Dashboard;
};
