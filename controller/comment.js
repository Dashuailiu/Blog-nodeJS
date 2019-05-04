var CommentModel = require('../models/comment');
var TopicController = require('../controller/topic');

module.exports = {
  addCommentByTopicId: async function(req, res) {
    try {
      let currentUser = req.user;

      let comment = req.body;
      let topic_id = req.params.topic_id;
      comment.publisher = currentUser._id;
      let commentRet = await new CommentModel(comment).save();

      TopicController.addCommentToTopic(
        topic_id,
        commentRet._id,
        currentUser._id
      );
      res.redirect(`/topics/${topic_id}#${commentRet._id}`);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        err_code: 500,
        message: 'Internet Error.'
      });
    }
  },
  upCountByCommentId: async function(req, res) {
    try {
      let currentUser = req.user;

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

      TopicController.countUp(req.params.topic_id, currentUser._id, action);
      // await CommentModel.findByIdAndUpdate(req.params.comment_id, {
      //   $inc: { upCount: 1 }
      // });

      return res.status(200).json({
        err_code: 0,
        action: action,
        message: 'Ok.'
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        err_code: 500,
        message: 'Internet Error.'
      });
    }
  }
};
