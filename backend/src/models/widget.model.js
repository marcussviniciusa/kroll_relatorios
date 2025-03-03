const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Widget = sequelize.define('Widget', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['metric', 'lineChart', 'barChart', 'pieChart', 'table', 'custom', 'text', 'multiMetric', 'comparison', 'funnel', 'heatmap', 'map', 'social']]
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dataSource: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['meta', 'googleAnalytics', 'manual', 'custom', 'combined']]
      }
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    query: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
    cache: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    lastFetched: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refreshRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: 'Override dashboard refresh rate (minutes). Null means use dashboard setting.'
    },
    settings: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        appearance: {
          colorTheme: 'default',
          showTitle: true,
          showDescription: true,
          showLegend: true,
          transparent: false,
          backgroundColor: null,
          borderRadius: 'medium',
          shadow: 'medium'
        },
        interaction: {
          drillDown: false,
          clickAction: null,
          hoverAction: null,
          tooltip: true
        },
        display: {
          animate: true,
          showTrendIndicator: true,
          precision: 2,
          prefix: '',
          suffix: '',
          dateFormat: 'DD/MM/YYYY',
          numberFormat: 'pt-BR'
        },
        advanced: {
          customCss: '',
          customJs: ''
        }
      }
    },
    position: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        x: 0,
        y: 0,
        w: 6,
        h: 4,
        i: '0'
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'draft', 'error'),
      defaultValue: 'active'
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isTemplate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'widgets',
    timestamps: true,
    paranoid: true, // Soft delete
    hooks: {
      beforeCreate: (widget) => {
        // Generate a unique position.i if not provided
        if (!widget.position.i) {
          widget.position.i = widget.id.split('-')[0];
        }
      }
    }
  });

  // Method to clone a widget
  Widget.prototype.clone = async function(options = {}) {
    const { name, dashboardId, userId } = options;
    
    const data = this.toJSON();
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.deletedAt;
    
    if (name) {
      data.name = name;
    } else {
      data.name = `${data.name} (Copy)`;
    }
    
    if (dashboardId) {
      data.DashboardId = dashboardId;
    }
    
    if (userId) {
      data.createdBy = userId;
      data.updatedBy = userId;
    }
    
    // Generate new position
    data.position = {
      ...data.position,
      i: require('crypto').randomBytes(4).toString('hex')
    };
    
    return await Widget.create(data);
  };

  // Method to update widget cache data
  Widget.prototype.updateCache = async function(data) {
    this.cache = data;
    this.lastFetched = new Date();
    
    if (this.status === 'error') {
      this.status = 'active';
      this.errorMessage = null;
    }
    
    return this.save();
  };

  // Method to set widget error
  Widget.prototype.setError = async function(error) {
    this.status = 'error';
    this.errorMessage = error.toString();
    return this.save();
  };

  return Widget;
};
