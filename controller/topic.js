const sectionMapping = {
  1: 'Sharing',
  2: 'Questions and answers',
  3: 'Recruitment',
  4: 'Client testing'
};

module.exports = {
  serializeTopicList: serializeTopicList,
  postTopic: postTopic,
  getAllTopics: getAllTopics,
  getTopicById: getTopicById,
  addCommentToTopic: addCommentToTopic,
  countUp: countUp,
  getAllCreatedTopicsByUserId: getAllCreatedTopicsByUserId,
  getAllParticipatedTopicsByUserId: getAllParticipatedTopicsByUserId,
  getTopicsWithoutComments: getTopicsWithoutComments
};

var sDateTime = require('silly-datetime');
var TopicModel = require('../models/topic');
var showdown = require('showdown');
var commentController = require('./comment');

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
    authorBio: topic.author.bio,
    viewCount: topic.viewCount,
    commentCount: topic.comments.length,
    section: sectionMapping[topic.section],
    sectionAbbre: sectionMapping[topic.section][0],
    createdTime: sDateTime.fromNow(topic.createdTime)
  };

  if (general) {
    var converter = new showdown.Converter();
    converter.setOption('optionKey', 'value');
    converter.setOption('simplifiedAutoLink', 'true');

    topicObj.content = converter.makeHtml(topic.content);
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

async function postTopic(req, res) {
  try {
    var topic = req.body;
    topic.author = req.user._id;

    await new TopicModel(topic).save();
    res.status(200).json({
      err_code: 0,
      message: 'Ok.'
    });
  } catch (err) {
    return res.status(500).json({
      err_code: 500,
      message: 'Internet Error.'
    });
  }
}

async function getAllTopics(req, res) {
  //* retrieve all instances by query, like 'search'
  try {
    let query = {};
    if ([1, 2, 3, 4].indexOf(parseInt(req.query.section)) !== -1) {
      query.section = parseInt(req.query.section);
    }

    if (req.query.search) {
      query.$or = [
        { content: { $regex: req.query.search, $options: 'i' } },
        { title: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const perPage = 15;
    let currentPage = 1;

    if (req.query.page) {
      currentPage = parseInt(req.query.page);
    }

    let topics = await TopicModel.find(query)
      .skip(perPage * (currentPage - 1))
      .limit(perPage)
      .populate('author')
      .populate('comments')
      .populate({
        path: 'comments',
        populate: {
          path: 'publisher'
        }
      })
      .sort('-lastModifiedTime');

    let topicsObj = serializeTopicList(topics);

    const itemCount = topicsObj.length;

    res.render('index.html', {
      currentUser: req.user,
      page: { total: Math.ceil(itemCount / perPage), current: currentPage },
      topics: itemCount ? topicsObj : null
    });
  } catch (err) {
    return res.status(500).json({
      err_code: 500,
      message: 'Internet Error.'
    });
  }
}

async function getTopicById(req, res) {
  try {
    let topic = await TopicModel.findOneAndUpdate(
      { _id: req.params.topic_id },
      {
        $inc: { viewCount: 1 },
        keepTime: true
      }
    )
      .populate('author')
      .populate('comments')
      .populate({
        path: 'comments',
        populate: {
          path: 'publisher'
        }
      });

    let topicShowObj = serializeTopic(topic, true);

    //* Comment render
    let commentsObj = [];
    let user_id = req.user ? req.user._id : null;

    topic.comments.forEach(c => {
      let commentObj = commentController.serializeComment(c);
      commentObj.uped = c.upCountUser.indexOf(user_id) === -1 ? '' : 'uped';
      commentsObj.push(commentObj);
    });
    console.log(commentsObj);

    res.render('./topic/show.html', {
      currentUser: req.user,
      topic: topicShowObj,
      comments: commentsObj
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err_code: 500,
      message: 'Internet Error.'
    });
  }
}

async function addCommentToTopic(topic_id, comment_id, user_id) {
  await TopicModel.findByIdAndUpdate(topic_id, {
    $push: {
      comments: comment_id
    },
    $addToSet: {
      commentUsers: user_id
    },
    lastUser: user_id
  });
}

async function countUp(topic_id, user_id, upAction = 'up') {
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
}

async function getAllCreatedTopicsByUserId(user_id) {
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
}

async function getAllParticipatedTopicsByUserId(user_id) {
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
}

async function getTopicsWithoutComments(req, res) {
  let topics = await TopicModel.find({ comments: [] })
    .sort('lastModifiedTime')
    .limit(5);

  return res.status(200).json({
    code: topics.length !== 0 ? 0 : 1,
    topics: serializeTopicList(topics)
  });
}
