var express=      require("express"),
 methodOverride=    require("method-override"),
 expressSanitizer=  require("express-sanitizer"),
 app=             express(),
 bodyparser=    require("body-parser"),
 mongoose=      require("mongoose");
 
 mongoose.connect("mongodb://localhost/restful_blog_app");
 app.set("view engine","ejs")
 
 app.use(express.static("public"))
 
 app.use(bodyparser.urlencoded({extended:true}))
 app.use(expressSanitizer());//For removing threat of adding dangerous script files by the user
 app.use(methodOverride("_method"))
 
 //Mongoose/Model config
 var blogSchema=new mongoose.Schema({
     
     title:String,
     image:String,
     body:String,
     created:{type:Date,default:Date.now}
 })
 
 var Blog=mongoose.model("Blog",blogSchema)
 
 /*Blog.create({
     title:"Test Blog",
     image:"https://vetstreet.brightspotcdn.com/dims4/default/10dae76/2147483647/thumbnail/645x380/quality/90/?url=https%3A%2F%2Fvetstreet-brightspot.s3.amazonaws.com%2F3a%2F54%2F5ae8bfcc41b381c27a792e0dd891%2FAP-KWDHXS-645sm8113.jpg",
     body:"This is a blog post"
     
 })
 */
 //RestFul Routes
 app.get("/",function(req,res){
     res.redirect("/blogs")
 })
 
 //Index route
 
 app.get("/blogs",function(req,res){
     //
     Blog.find({},function(err,blogs){
         if(err){
             console.log(err)
         }
         else{
             res.render("index",{blogs:blogs})
         }
             
         
     })
 })
 
 ///New Route
 app.get("/blogs/new",function(req, res) {
     res.render("new")
 })
 
 //CREATE ROUTE
 app.post("/blogs",function(req,res){
  //Blog create
  console.log(req.body)
  req.body.blog.body=req.sanitize(req.body.blog.body)
  console.log("==========================")
  console.log(req.body)
  Blog.create(req.body.blog,function(err,newBlog){
   if(err){
    res.redirect("/new")
   }
   else{
    //redirect to index
    res.redirect("/blogs")
   }
  })
  
 })
 
 //show route
 app.get("/blogs/:id",function(req, res) {
    //res.send("Show page !") 
    Blog.findById(req.params.id,function(err,foundBlog){
     if(err){
      res.redirect("/blogs")
     }
     else{
      res.render("show",{blog:foundBlog})
     }
     
    })
 })
 
 //EDIT ROUTE
 app.get("/blogs/:id/edit",function(req, res) {
  Blog.findById(req.params.id,function(err,foundBlog){
   if(err){
    res.redirect("/blogs")
   }
   else{
    res.render("edit",{blog:foundBlog})
    
   }
  })
     //res.render("edit")
 })
 
 ///UPDATE ROUTE
  app.put("/blogs/:id",function(req,res){
  //res.send("UPDATE ROUTE!")
   req.body.blog.body=req.sanitize(req.body.blog.body)//for sanitizing
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
    if(err){
     res.redirect("/blogs");
    }
    else{
     res.redirect("/blogs/"+req.params.id);
    }
   })
  })
  
  //DELETE ROUTE
  app.delete("/blogs/:id",function(req,res){
   //res.send("Destroy & Delete Route")
   Blog.findByIdAndRemove(req.params.id,function(err){
    if(err){
     res.redirect("/blogs")
    }
    else{
     res.redirect("/blogs")
    }
     
    
   })
  })
 
 
 app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Blog Server has Started")
})