const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ReportSchedule = sequelize.define('ReportSchedule', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    reportId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'reports',
        key: 'id'
      }
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'weekly'
    },
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dayOfMonth: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    recipients: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: []
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    lastRunAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    nextRunAt: {
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
    tableName: 'report_schedules',
    timestamps: true
  });

  return ReportSchedule;
};
