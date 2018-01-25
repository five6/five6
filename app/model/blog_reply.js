'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const BlogReplySchema = new mongoose.Schema({
    _id: { type: Object },
    content: { type: String },
    blogId: { type: String },
    replyId: { type: String },
    author_id: { type: String },
    stars: { type: Array, default: [] },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
  });
  return mongoose.model('BlogReply', BlogReplySchema);
};
