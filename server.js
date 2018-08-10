// require express
var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
// create the express app
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/restful_Task_API');

var TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  completed: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});




//  ### setting schema in Model

// seeting schema and getting schema by storing it in var Task
var Task = mongoose.model('Tasks', TaskSchema);



// Use native promises
mongoose.Promise = global.Promise;

const session = require('express-session');
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  }
}))

// app.HTTP_VERB('URL', function (req, res){});  // HTTP_VERB is either 'get' or 'post' etc...

// use it!
// app.use(bodyParser.urlencoded({
//   extended: true
// }));

app.use(bodyParser.json());

// static content
app.use(express.static(path.join(__dirname, "./static")));

app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));


// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// root route
app.get('/', function (req, res) {
  res.json({message:"hi"})
});

// post route for adding a tasks
app.post('/tasks', function (req, res) {
 console.log('post data',req.body);
 Task.create(req.body,function(err,task){
   if(err){
     console.log(err);
     //send back an object, add a message stat
     res.json({message:false, error:err})
   }else{
    res.json({message:true, data:task})
   }
 })
// res.json({message:"in the post route"})
})

app.put('/tasks/:id',function(req,res){
  console.log('put data',req.params.id, req.body);
  
  let id = req.params.id;
  
  Task.findById(id, function(err,task){
    if(err){
      console.log('err',err);
      res.json({message:false,error:err})
    }else{
      task.title = req.body.title;
      task.description = req.body.description;
      task.completed = req.body.completed;
      task.save()
      // task.save(function(err,task){
      //   if(err){
      //     res.json({message:false, error:err})
      //   }else{
      //     res.json({message:false, data:task})
      //   }
      // });

      res.json({message:true,data:task})
    }
  })

})

app.delete('/tasks/:id',function(req,res){
  console.log('delete route',req.params.id);
  Task.remove({_id: req.param.id},function(err,task){
    if(err){
      console.log(err);
      res.json({message:false, error:err})
    }else{
     res.json({message:true, data:task})
    }
  })
  
})
 
app.get('/tasks',function(req,res){
  Task.find({},function(err,task){
    if(err){
      console.log(err);
      res.json({message:false, error:err})
    }else{
     res.json({message:true, data:task})
    }
  })
})

// app.get('/tasks/:id',function(req,res){
  
//   Task.find({_id:req.params.id},function(err,data){
//     if(err){
//       console.log('err',err);
//       res.json({message:false,error:err})
//     }else{
//       res.json({message:true,data:data})
//     }
//   })
// })


// tell the express app to listen on port 8000
app.listen(8000, function () {
  console.log("listening on port 8000");
});