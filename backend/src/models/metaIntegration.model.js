const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MetaIntegration = sequelize.define('MetaIntegration', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Removido o armazenamento direto do token
    // O token agora é armazenado no modelo MetaToken
    tokenStatus: {
      type: DataTypes.ENUM('active', 'expired', 'revoked', 'invalid'),
      allowNull: false,
      defaultValue: 'active'
    },
    tokenLastVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    lastSyncedAt: {
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
    tableName: 'meta_integrations',
    timestamps: true
  });

  return MetaIntegration;
};
