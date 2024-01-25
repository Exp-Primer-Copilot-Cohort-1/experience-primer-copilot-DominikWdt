//Create web server
// 1. Import express
const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
// 2. Import comment model
const Comment = require('../models/comment')
// 3. Import auth middleware
const auth = require('../middleware/auth')
// 4. Import user model
const User = require('../models/user')

// 5. Create comment
// @route POST /comments
// @desc Create a new comment
// @access Private
router.post(
  '/',
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
  ],
  async (req, res) => {
    // 1. Find the validation errors in this request and wrap them in an object with handy functions
    const errors = validationResult(req)
    // 2. If there are errors, return Bad request and the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      })
    }
    try {
      // 3. Create a new comment
      const comment = new Comment({
        ...req.body,
        owner: req.user._id,
      })
      // 4. Save the comment
      await comment.save()
      // 5. Return the comment
      res.status(201).json(comment)
    } catch (error) {
      // 6. If there is an error, return Server Error and the error
      res.status(500).json({
        error: error.message,
      })
    }
  }
)

// 6. Get all comments
// @route GET /comments
// @desc Get all comments
// @access Public
router.get('/', async (req, res) => {
  try {
    // 1. Get all comments
    const comments = await Comment.find({})
    // 2. Return all comments
    res.json(comments)
  } catch (error) {
    // 3. If there is an error, return Server Error and the error
    res.status(500).json({
      error: error.message,
    })
  }
})

// 7. Get comment by id
// @route GET /comments/:id
// @desc Get comment by id
// @access Public
router.get('/:id', async (req, res