var Topic = require('../models/topic');

const sectionMapping = {
  1: 'Share',
  2: 'Questions and answers',
  3: 'Recruitment',
  4: 'Client testing'
};

module.exports = {
  //TODO post a topic
  postTopic: async function(req, res) {
    try {
      if (!req.session.user) {
        res.render('login.html');
      }
      var topic = req.body;
      console.log(req.session.user);
      topic.publisher = req.session.user._id;
      await new Topic(topic).save();
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
  //TODO list all topics
  getAllTopics: async function(req, res) {
    //TODO retrieve all instances by query, like 'search'
    let topics = await Topic.find();

    topics.forEach(topic => {
      topic.sectionDescription = sectionMapping[topic.section];
    });

    return topics;
  },
  getTopicById: async function(req, res) {
    try {
      let topic = await Topic.findById(req.params.id);
    } catch (err) {
      return res.status(500).json({
        err_code: 500,
        message: 'Internet Error.'
      });
    }
  }
};
