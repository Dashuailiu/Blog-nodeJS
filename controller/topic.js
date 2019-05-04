var sDateTime = require('silly-datetime');
var TopicModel = require('../models/topic');

const sectionMapping = {
  1: 'Sharing',
  2: 'Questions and answers',
  3: 'Recruitment',
  4: 'Client testing'
};

function serializeTopic(topic, general = false) {
  let lastComment = topic.comments.length
    ? topic.comments[topic.comments.length - 1]
    : null;
  let topicObj = {
    id: topic.id,
    title: topic.title,
    authorId: topic.author.id,
    authorName: topic.author.username,
    authorAvatar: topic.author.avatar,
    viewCount: topic.viewCount,
    commentCount: topic.comments.length,
    section: sectionMapping[topic.section],
    sectionAbbre: sectionMapping[topic.section][0],
    createdTime: sDateTime.fromNow(topic.createdTime)
  };

  if (general) {
    topicObj.content = topic.content;
  } else {
    topicObj.lastAuthorAvatar = lastComment ? lastComment.publisher.avatar : '';
    topicObj.lastCommentTime = lastComment
      ? sDateTime.fromNow(lastComment.createdTime)
      : sDateTime.fromNow(topic.lastModifiedTime);
  }
  return topicObj;
}

function serializeTopicList(topicList) {
  let TopicsObj = [];
  topicList.forEach(t => {
    TopicsObj.push(serializeTopic(t));
  });
  return TopicsObj;
}

module.exports = {
  //TODO post a topic
  postTopic: async function(req, res) {
    try {
      var topic = req.body;
      topic.author = req.user._id;

      await new TopicModel(topic).save();
      res.status(200).json({
        err_code: 0,
        message: 'Ok.'
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        err_code: 500,
        message: 'Internet Error.'
      });
    }
  },
  //* list all topics
  getAllTopics: async function(req, res) {
    //* retrieve all instances by query, like 'search'
    try {
      let topics = await TopicModel.find()
        .populate('author')
        .populate('comments')
        .populate({
          path: 'comments',
          populate: {
            path: 'publisher'
          }
        });

      let topicsObj = serializeTopicList(topics);

      res.render('index.html', {
        currentUser: req.user,
        topics: topicsObj
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        err_code: 500,
        message: 'Internet Error.'
      });
    }
  },
  getTopicById: async function(req, res) {
    try {
      let topic = await TopicModel.findById(req.params.topic_id)
        .populate('author')
        .populate('comments')
        .populate({
          path: 'comments',
          populate: {
            path: 'publisher'
          }
        });

      topic.viewCount++;
      await topic.save();

      //console.log(req.params.topic_id, topic);
      let topicShowObj = serializeTopic(topic, true);

      //* Comment render
      let commentsObj = [];
      let user_id = req.user ? req.user._id : null;

      topic.comments.forEach(c => {
        commentsObj.push({
          id: c.id,
          content: c.content,
          publisher_id: c.publisher.id,
          publisher_name: c.publisher.username,
          //TODO replace later
          publisher_avatar: c.publisher.avatar,
          uped: c.upCountUser.indexOf(user_id) === -1 ? '' : 'uped',
          upCount: c.upCount,
          createdTime: sDateTime.fromNow(c.createdTime)
        });
      });

      res.render('./topic/show.html', {
        currentUser: req.user,
        topic: topicShowObj,
        comments: commentsObj
      });
    } catch (err) {
      return res.status(500).json({
        err_code: 500,
        message: 'Internet Error.'
      });
    }
  },
  addCommentToTopic: async function(topic_id, comment_id, user_id) {
    await TopicModel.findByIdAndUpdate(topic_id, {
      $push: {
        comments: comment_id
      },
      $addToSet: {
        commentUsers: user_id
      },
      lastUser: user_id
    });
  },
  countUp: async function(topic_id, user_id, upAction = 'up') {
    if (upAction === 'up') {
      await TopicModel.findByIdAndUpdate(topic_id, {
        $addToSet: {
          upUsers: user_id
        },
        lastUser: user_id
      });
    } else {
      await TopicModel.findByIdAndUpdate(topic_id, {
        $pull: {
          upUsers: user_id
        }
      });
    }
  },
  getAllCreatedTopicsByUserId: async function(user_id) {
    return await TopicModel.find({
      author: user_id
    })
      .populate('author')
      .populate('comments')
      .populate({
        path: 'comments',
        populate: {
          path: 'publisher'
        }
      });
  },
  getAllParticipatedTopicsByUserId: async function(user_id) {
    return await TopicModel.find({
      $or: [{ upUsers: user_id }, { commentUsers: user_id }]
    })
      .populate('author')
      .populate('comments')
      .populate({
        path: 'comments',
        populate: {
          path: 'publisher'
        }
      });
  },
  serializeTopicList: serializeTopicList
};
