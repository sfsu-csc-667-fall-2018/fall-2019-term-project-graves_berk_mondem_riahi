'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
          'messages', 'room_id', {
            type: Sequelize.INTEGER,
            references: {
              model: 'rooms',
              key: 'room_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          }
        ),
      queryInterface.addColumn(
        'players', 'user_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'user_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      ),
      queryInterface.addColumn(
        'messages', 'user_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'user_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      ),
      queryInterface.addColumn(
        'players', 'room_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'rooms',
            key: 'room_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      ),
      // queryInterface.addColumn(
      //   'rooms', 'host_id', {
      //     type: Sequelize.INTEGER,
      //     references: {
      //       model: 'players',
      //       key: 'player_id',
      //     },
      //     onUpdate: 'CASCADE',
      //     onDelete: 'SET NULL',
      //   }
      // ),
      // queryInterface.addColumn(
      //   'rooms', 'guest_id', {
      //     type: Sequelize.INTEGER,
      //     references: {
      //       model: 'players',
      //       key: 'player_id',
      //     },
      //     onUpdate: 'CASCADE',
      //     onDelete: 'SET NULL',
      //   }
      // ),
      queryInterface.addColumn(
        'handcards', 'player_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'players',
            key: 'player_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      ),
      queryInterface.addColumn(
        'handcards', 'room_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'rooms',
            key: 'room_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      ),
      queryInterface.addColumn(
        'discards', 'room_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'rooms',
            key: 'room_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      ),
      queryInterface.addColumn(
        'decks', 'room_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'rooms',
            key: 'room_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        'messages',
        'room_id'
      ),
      queryInterface.removeColumn(
        'players',
        'user_id'
      ),
      queryInterface.removeColumn(
        'messages',
        'user_id'
      ),
      queryInterface.removeColumn(
        'players',
        'room_id'
      ),
      // queryInterface.removeColumn(
      //   'rooms',
      //   'host_id'
      // ),
      // queryInterface.removeColumn(
      //   'rooms',
      //   'guest_id'
      // ),
      queryInterface.removeColumn(
        'handcards',
        'player_id'
      ),
      queryInterface.removeColumn(
        'handcards',
        'room_id'
      ),
      queryInterface.removeColumn(
        'discards',
        'room_id'
      ),
      queryInterface.removeColumn(
        'deck',
        'room_id'
      )
    ])
  }
};
