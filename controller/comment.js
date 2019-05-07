module.exports = {
  serializeComment: serializeComment,
  addCommentByTopicId: addCommentByTopicId,
  upCountByCommentId: upCountByCommentId,
  replyComment: replyComment
};

var sDateTime = require('silly-datetime');
var CommentModel = require('../models/comment');
var showdown = require('showdown');

var TopicController = require('./topic');

function serializeComment(comment) {
  let commentObj = {
    id: comment.id,
    publisher_id: comment.publisher.id,
    publisher_name: comment.publisher.username,
    publisher_avatar: comment.publisher.avatar,
    upCount: comment.upCount,
    createdTime: sDateTime.fromNow(comment.createdTime)
  };

  var converter = new showdown.Converter();
  converter.setOption('optionKey', 'value');
  converter.setOption('simplifiedAutoLink', 'true');
  commentObj.content = converter.makeHtml(comment.content);
  return commentObj;
}

async function addCommentByTopicId(req, res) {
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
    return res.status(500).json({
      err_code: 500,
      message: 'Internet Error.'
    });
  }
}

async function upCountByCommentId(req, res) {
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

async function replyComment(req, res) {
  try {
    let comment = req.body;
    let topic_id = req.body.topic_id;
    let currentUser = req.user;

    comment.publisher = currentUser._id;
    comment.replyToComment = req.params.comment_id;
    comment.type = 1;

    let commentRet = await new CommentModel(comment).save();

    TopicController.addCommentToTopic(
      topic_id,
      commentRet._id,
      currentUser._id
    );

    res.redirect(`/topics/${topic_id}#${commentRet._id}`);
  } catch (err) {
    return res.status(500).json({
      err_code: 500,
      message: 'Internet Error.'
    });
  }
}
