const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/project2', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const Schema = mongoose.Schema;
const BlogPost = new Schema({

  email: String,
  password: String,
  type:{
      type:Number,
      default:3
  },
  status:{
    default:null,
    type:String
  }
},{
    collection: "data"
});
const PostModel = mongoose.model('data', BlogPost);
module.exports = PostModel
