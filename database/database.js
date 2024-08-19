const Sequelize = require("sequelize")

const connection = new Sequelize('guiapress', 'root', 'MySQLg@m1t0five',{
    host: 'localhost',
    dialect: 'mysql',
    timezone:"+01:00"
})

module.exports = connection