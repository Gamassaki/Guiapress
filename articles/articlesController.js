const express = require("express")
const router = express.Router()
const Category = require("../categories/category")
const slugify = require("slugify")
const Article = require("./Article")
const adminAuth = require("../middelwares/adminAuth")

router.get("/admin/articles", adminAuth, (req, res)=>{
    Article.findAll({
        include: [{model: Category}]
    }).then((articles)=>{
        res.render("admin/articles/index", {articles: articles})
    })
})

router.get("/admin/articles/new", adminAuth, (req, res)=>{
    
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories: categories})
    })

})

router.post("/article/save", (req, res)=>{
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect("/admin/articles")
    })
})

router.post("/articles/delete", (req, res) =>{
    var id = req.body.id
    if(id != undefined)
        if(!isNaN(id))

            Article.destroy({
                where:{id:id}
            }).then(()=>{
                res.redirect("/admin/articles")
            })

        else
            res.redirect("/admin/articles")
    else
        res.redirect("/admin/articles")
})

router.get("/admin/articles/edit/:id", adminAuth,(req, res)=>{
    var id = req.params.id

    if (!isNaN(id))
        Article.findByPk(id).then(article =>{
            if(article != undefined)
                Category.findAll().then(categories=>{

                    res.render("admin/articles/edit",{article:article, categories:categories})

                }).catch(err=>{
                    res.redirect("/admin/articles/")
                })
            else
                res.redirect("/admin/articles")
        }).catch(err=>{
                res.redirect("/admin/articles/")
        })
    else
        res.redirect("/admin/articles/")
})

router.post("/article/update", (req, res)=>{
    var id = req.body.id
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.update({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    },{
        where:{id:id}
    }).then(()=>{
        res.redirect("/admin/articles")
    })

})

router.get("/articles/page/:num", (req, res)=>{
    var page = req.params.num
    var offset
    
    if(isNaN(page))
        offset = 0
    else
        offset = (parseInt(page) -1) * 4

    Article.findAndCountAll({
        limit: 4,
        order: [['id','DESC']],
        offset: offset
    }).then(articles=>{

        var next = true
        if(offset + 4 >= articles.count)
            next = false


        var result = {
            page: parseInt(page),
            next: next,
            articles:articles
        }

        Category.findAll().then(categories=>{
            if(articles.count < (parseInt(page) -2) * 4 + 4)
                res.redirect("/")
            else
                res.render("admin/articles/page",{result: result, categories: categories})
        })
     })
})

module.exports = router