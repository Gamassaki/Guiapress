const Sequelize =  require("sequelize")
const connection = require("../database/database")

const User = connection.define('Users',{
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },password:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

//User.sync({force: true})

module.exports = User