const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import models
const User = require('./user.model')(sequelize);
const Company = require('./company.model')(sequelize);
const Role = require('./role.model')(sequelize);
const UserCompany = require('./userCompany.model')(sequelize);
const MetaIntegration = require('./metaIntegration.model')(sequelize);
const GoogleAnalyticsIntegration = require('./googleAnalyticsIntegration.model')(sequelize);
const Dashboard = require('./dashboard.model')(sequelize);
const Widget = require('./widget.model')(sequelize);
const Report = require('./report.model')(sequelize);
const ReportSchedule = require('./reportSchedule.model')(sequelize);
const Alert = require('./alert.model')(sequelize);

// Define associations

// User <-> Role
User.belongsTo(Role);
Role.hasMany(User);

// User <-> Company (many-to-many)
User.belongsToMany(Company, { through: UserCompany });
Company.belongsToMany(User, { through: UserCompany });

// Company <-> Integrations (one-to-many)
Company.hasMany(MetaIntegration);
MetaIntegration.belongsTo(Company);

Company.hasMany(GoogleAnalyticsIntegration);
GoogleAnalyticsIntegration.belongsTo(Company);

// Dashboard <-> Company (one-to-many)
Company.hasMany(Dashboard);
Dashboard.belongsTo(Company);

// Dashboard <-> Widget (one-to-many)
Dashboard.hasMany(Widget);
Widget.belongsTo(Dashboard);

// Report <-> Company (one-to-many)
Company.hasMany(Report);
Report.belongsTo(Company);

// Report <-> ReportSchedule (one-to-many)
Report.hasMany(ReportSchedule);
ReportSchedule.belongsTo(Report);

// Alert <-> Company (one-to-many)
Company.hasMany(Alert);
Alert.belongsTo(Company);

// Alert <-> User (created by)
Alert.belongsTo(User, { as: 'creator' });

const db = {
  sequelize,
  Sequelize,
  User,
  Company,
  Role,
  UserCompany,
  MetaIntegration,
  GoogleAnalyticsIntegration,
  Dashboard,
  Widget,
  Report,
  ReportSchedule,
  Alert
};

module.exports = db;
