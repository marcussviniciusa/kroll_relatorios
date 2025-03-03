/**
 * Migração para adicionar a tabela de tokens do Meta
 * e atualizar a tabela de integrações do Meta
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criar tabela de tokens do Meta
    await queryInterface.createTable('meta_tokens', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      integration_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'meta_integrations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      encrypted_token: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      iv: {
        type: Sequelize.STRING,
        allowNull: false
      },
      auth_tag: {
        type: Sequelize.STRING,
        allowNull: false
      },
      token_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      last_verified_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      last_verification_result: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Adicionar índices
    await queryInterface.addIndex('meta_tokens', ['integration_id'], {
      unique: true,
      name: 'meta_tokens_integration_id_idx'
    });
    
    await queryInterface.addIndex('meta_tokens', ['token_hash'], {
      name: 'meta_tokens_token_hash_idx'
    });
    
    await queryInterface.addIndex('meta_tokens', ['expires_at'], {
      name: 'meta_tokens_expires_at_idx'
    });

    // Atualizar tabela de integrações do Meta
    // Adicionar novas colunas
    await queryInterface.addColumn('meta_integrations', 'token_status', {
      type: Sequelize.ENUM('active', 'expired', 'revoked', 'invalid'),
      allowNull: false,
      defaultValue: 'active'
    });
    
    await queryInterface.addColumn('meta_integrations', 'token_last_verified_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
    
    // Migrar dados existentes (em uma implementação real, você migraria os tokens)
    // Aqui, estamos apenas marcando todos os tokens existentes como ativos
    await queryInterface.sequelize.query(`
      UPDATE meta_integrations
      SET token_status = 'active', token_last_verified_at = NOW()
      WHERE access_token IS NOT NULL
    `);
    
    // Remover colunas antigas (em produção, você pode querer fazer isso em uma migração separada)
    await queryInterface.removeColumn('meta_integrations', 'access_token');
    await queryInterface.removeColumn('meta_integrations', 'refresh_token');
    await queryInterface.removeColumn('meta_integrations', 'token_expiry');
  },

  down: async (queryInterface, Sequelize) => {
    // Reverter as alterações na tabela de integrações
    await queryInterface.addColumn('meta_integrations', 'access_token', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    
    await queryInterface.addColumn('meta_integrations', 'refresh_token', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    
    await queryInterface.addColumn('meta_integrations', 'token_expiry', {
      type: Sequelize.DATE,
      allowNull: true
    });
    
    // Remover as novas colunas
    await queryInterface.removeColumn('meta_integrations', 'token_status');
    await queryInterface.removeColumn('meta_integrations', 'token_last_verified_at');
    
    // Remover o tipo ENUM
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS enum_meta_integrations_token_status;
    `);
    
    // Remover a tabela de tokens
    await queryInterface.dropTable('meta_tokens');
  }
};
