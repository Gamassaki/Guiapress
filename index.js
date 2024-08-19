//Express
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const session = require("express-session")
const connection = require("./database/database")

const categoriesController = require("./categories/categoriesController")
const articlesController = require("./articles/articlesController")
const usersController = require("./users/UsersController")

const Article = require("./articles/Article")
const Category = require("./categories/category")
const User = require("./users/User")
const { where } = require("sequelize")

//view engine
app.set('view engine', 'ejs')

//sessions
app.use(session({
    secret: "qbhabalhflvlalfiejkjkshçljfkakfja", cookie: {maxAge:3000000}
}))

//Static
app.use(express.static('public'))

//body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//database
connection
    .authenticate()
    .then(()=>{
        console.log("Conexão feita com sucesso")
    }).catch((error)=>{
        console.log(error)
    })

app.use("/", categoriesController)
app.use("/", articlesController)
app.use("/", usersController)

app.get("/",(req, res)=>{
    Article.findAll({
        order: [['id','DESC']],
        limit: 4
    }).then((articles)=>{
        Category.findAll().then(categories =>{
            res.render("index", {articles: articles, categories: categories})
        })
    })
})

app.get("/:slug",(req, res)=>{
    var slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article =>{
        if(article != undefined)
            Category.findAll().then(categories =>{
                res.render("article", {article: article, categories: categories})
            })
        else
            res.redirect("/")
    }).catch(err => {
        res.redirect("/")
    })
})

app.get("/category/:slug", (req, res)=>{
    var slug = req.params.slug
    Category.findOne({
        where:{slug: slug},
        include: [{model: Article}]
    }).then(category=>{
        if (category != undefined)
            Category.findAll().then(categories=>{
                res.render("index", {articles: category.articles, categories: categories})
            })
        else
            res.redirect("/")
    }).catch(err =>{
        res.redirect("/")
    })
})

 
//Server App
app.listen(8080,(error)=>{
    if(!error)
        console.log("Servidor está rodando")
    else
        console.log(error)
})