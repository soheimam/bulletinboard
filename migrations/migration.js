// I found this here => http://idothecodes.com/blog/2017/12/3/using-foreign-keys-with-sequelize
// Github : https://github.com/idothecodes/sequelize-foreign-keys

const Sequelize = require('sequelize');

const config = require('../config/config.json');

const logger = console;

const sequelize = new Sequelize(
    config.database,
    process.env.POSTGRES_USERNAME,
    process.env.POSTGRES_PASSWORD,
    config.options,
);


// Create a Location model.
const User = sequelize.define(
    'users', {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: Sequelize.DataTypes.STRING(64),
        email: Sequelize.DataTypes.STRING(64),
        password: Sequelize.DataTypes.STRING(64)
    }, {
        underscored: true,
        name: {
            singular: 'user',
            plural: 'users',
        },
    },
);

// Create a user model.
const Message = sequelize.define(
    'messages', {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: Sequelize.DataTypes.STRING(64),
        comments: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING(64)),
        message: Sequelize.DataTypes.STRING(64),
        title: Sequelize.DataTypes.STRING(64),
    }, {
        underscored: true,
        name: {
            singular: 'message',
            plural: 'messages',
        },
    },
);

function init(User, Message) {
    (async () => {
        try {
            // Make sure we can connection to database.
            await sequelize.authenticate();

            // Establish that a user belongs to one message.
            User.belongsTo(Message);

            // Create the database from scratch.
            await sequelize.sync({
                force: true
            })
        } catch (err) {
            logger.error(err);
        } finally {
            await sequelize.close();
        }

    })();
}


module.exports = {
    User,
    Message,
    init
}