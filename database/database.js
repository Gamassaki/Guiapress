const Sequelize = require("sequelize")

const connection = new Sequelize('guiapress', 'root', '1234567890',{
    host: 'localhost',
    dialect: 'mysql',
    timezone:"+01:00"
})

module.exports = connection
