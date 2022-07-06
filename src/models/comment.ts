import mongoose from "mongoose";

interface IComment extends mongoose.Document {
    movie : string;
    user: mongoose.ObjectId;
    content:string;
    createdAt: Date | number;
   
}


const commentsSchema = new mongoose.Schema<IComment>(
{
movie : {
    type : String,
    required : true
}
,
user : {
    type : mongoose.Types.ObjectId,
    required : true,
    ref : "User"

},
content:{
    type : String,
    required : true
}
,
createdAt: { type: Date, required: true, default: Date.now },


},
{
  toJSON: {
    virtuals: true,
  },
  toObject: { virtuals: true },
}
)


const Comment = mongoose.model("Comment", commentsSchema);

export default Comment;
