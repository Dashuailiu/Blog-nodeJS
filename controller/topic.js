var sDateTime = require('silly-datetime');
var TopicModel = require('../models/topic');

const sectionMapping = {
  1: 'Sharing',
  2: 'Questions and answers',
  3: 'Recruitment',
  4: 'Client testing'
};

module.exports = {
  //TODO post a topic
  postTopic: async function(req, res) {
    try {
      if (!req.session.user) {
        return res.render('login.html');
      }
      var topic = req.body;
      topic.author = req.session.user._id;

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

      let topicsObj = [];

      topics.forEach(t => {
        let lastComment = t.comments.length
          ? t.comments[t.comments.length - 1]
          : null;

        topicsObj.push({
          id: t.id,
          authorAvatar: t.author.avatar,
          lastAuthorAvatar: lastComment ? lastComment.publisher.avatar : '',
          viewCount: t.viewCount,
          lastCommentTime: lastComment
            ? sDateTime.fromNow(lastComment.createdTime)
            : sDateTime.fromNow(t.lastModifiedTime),
          title: t.title,
          sectionDescription: sectionMapping[t.section][0],
          commentCount: t.comments.length
        });
      });

      res.render('index.html', {
        user: req.session.user,
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
      let topicShowObj = {
        //* Topic render
        id: req.params.topic_id,
        title: topic.title,
        createdTime: sDateTime.fromNow(topic.createdTime),
        section: sectionMapping[topic.section],
        content: topic.content,
        viewCount: topic.viewCount,
        commentCount: topic.comments.length,

        //* Topic author render
        author_id: topic.author.id,
        author: topic.author.username
      };

      //* Comment render
      let commentsObj = [];
      let user_id = req.session.user ? req.session.user._id : null;

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
        user: req.session.user,
        topic: topicShowObj,
        comments: commentsObj
      });
    } catch (err) {
      return res.status(500).json({
        err_code: 500,
        message: 'Internet Error.'
      });
    }
  }
};
