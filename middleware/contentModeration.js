const BannedWord = require('../models/BannedWord');
const User = require('../models/User');

// Check if text contains banned words
exports.checkBannedWords = async (text) => {
  if (!text) return { clean: true, words: [] };

  const bannedWords = await BannedWord.find(); // array of docs
  const foundWords = [];

  const textLower = text.toLowerCase();

  for (let wordDoc of bannedWords) {
    const word = wordDoc.word.toLowerCase();
    // Use word boundaries to match whole words
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(textLower)) {
      foundWords.push(word);
    }
  }

  return {
    clean: foundWords.length === 0,
    words: foundWords
  };
};

// increase flagged attempts
const incAttempts = async (req) => {
  if (req.session.user) {
    await User.findByIdAndUpdate(req.session.user._id, {
      $inc: { flaggedContentAttempts: 1 } // increment 
    });
  }
}

// Middleware to validate profile content
exports.validateProfileContent = async (req, res, next) => {
  try {
    const { bio, interests } = req.body;

    const BioCheck = await exports.checkBannedWords(bio);
    const interestsCheck = await exports.checkBannedWords(interests);

    if (!BioCheck.clean) {
      // Log flagged attempt
      await incAttempts(req)
      req.session.error_msg = `Bio Content contains inappropriate words: ${BioCheck.words.join(', ')}`;
      return res.redirect('/profile/edit');
    }

    if (!interestsCheck.clean) {
      // Log flagged attempt
      await incAttempts(req)
      req.session.error_msg = `interests Content contains inappropriate words: ${interestsCheck.words.join(', ')}`;
      return res.redirect('/profile/edit');
    }

    next();
  } catch (error) {
    console.error('Content moderation error:', error);
    next(error);
  }
};

exports.validateSkill = async (req, res, next) => {
  try {
    const { name } = req.body
    const check = await exports.checkBannedWords(name)
    if (!check.clean) {
      await incAttempts(req)
      req.session.error_msg = `Skills Content contains inappropriate words: ${name}`;
      return res.redirect('/profile/edit');
    }
    next()
  }
  catch (err) {
    console.error('Content moderation error:', error);
    next(error);
  }
}

exports.validateProject = async (req, res, next) => {
  try {
    const { name, description, githubLink, liveLink } = req.body
    const nameCheck = await exports.checkBannedWords(name)
    const descriptionCheck = await exports.checkBannedWords(description)
    const githubLinkCheck = await exports.checkBannedWords(githubLink)
    const liveLinkCheck = await exports.checkBannedWords(liveLink)
    if (!nameCheck.clean) {
      await incAttempts(req)
      req.session.error_msg = `Project name contains inappropriate words: ${name}`;
      return res.redirect('/profile/edit');
    }
    if (!descriptionCheck.clean) {
      await incAttempts(req)
      req.session.error_msg = `Project description contains inappropriate words: ${name}`;
      return res.redirect('/profile/edit');
    }
    if (!githubLinkCheck.clean) {
      await incAttempts(req)
      req.session.error_msg = `Github Link contains inappropriate words: ${name}`;
      return res.redirect('/profile/edit');
    }
    if (!liveLinkCheck.clean) {
      await incAttempts(req)
      req.session.error_msg = `Live Link contains inappropriate words: ${name}`;
      return res.redirect('/profile/edit');
    }
    next()
  }
  catch (err) {
    console.error('Content moderation error:', error);
    next(error);
  }
}