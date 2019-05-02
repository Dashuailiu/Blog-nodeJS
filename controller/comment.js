var CommentModel = require('../models/comment');
var TopicModel = require('../models/topic');

module.exports = {
  addCommentByTopicId: async function(req, res) {
    if (!req.session.user) {
      return res.render('login.html');
    }

    let comment = req.body;
    let topic_id = req.params.topic_id;
    comment.publisher = req.session.user._id;
    let commentRet = await new CommentModel(comment).save();

    await TopicModel.findByIdAndUpdate(topic_id, {
      $push: {
        comments: commentRet._id
      }
    });
    res.redirect(`/topics/${topic_id}#${commentRet._id}`);
  },
  upCountByCommentId: async function(req, res) {
    if (!req.session.user) {
      return res.status(403).json({
        err_code: 403,
        message: 'Please log in.'
      });
    }

    await CommentModel.findByIdAndUpdate(req.params.comment_id, {
      $inc: { upCount: 1 }
    });

    return res.status(200).json({
      err_code: 0,
      message: 'Ok.'
    });
  }
};
