var CommentModel = require('../models/comment');
var TopicModel = require('../models/topic');

module.exports = {
  addCommentByTopicId: async function(req, res) {
    try {
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
    } catch (err) {
      return res.status(500).json({
        err_code: 500,
        message: 'Internet Error.'
      });
    }
  },
  upCountByCommentId: async function(req, res) {
    try {
      let currentUser = req.session.user;
      if (!currentUser) {
        return res.status(403).json({
          err_code: 403,
          message: 'Please log in.'
        });
      }

      let comment = await CommentModel.findById(req.params.comment_id);
      let action = 'up';

      if (comment.upCountUser.indexOf(currentUser._id) === -1) {
        comment.upCountUser.push(currentUser._id);
        comment.upCount++;
      } else {
        comment.upCountUser.splice(
          comment.upCountUser.indexOf(currentUser._id),
          1
        );
        comment.upCount--;
        action = 'down';
      }

      await comment.save();
      // await CommentModel.findByIdAndUpdate(req.params.comment_id, {
      //   $inc: { upCount: 1 }
      // });

      return res.status(200).json({
        err_code: 0,
        action: action,
        message: 'Ok.'
      });
    } catch (err) {
      return res.status(500).json({
        err_code: 500,
        message: 'Internet Error.'
      });
    }
  }
};
