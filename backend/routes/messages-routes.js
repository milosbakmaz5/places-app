const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const messagesControllers = require("../controllers/messages-controllers");
const checkAuth = require("../middleware/check-auth");

// router.use(checkAuth);

router.get("/:cid", messagesControllers.getConversationsMessages);
router.post(
  "/",
  [
    check("conversation").not().isEmpty(),
    check("sender").not().isEmpty(),
    check("text").not().isEmpty(),
  ],
  messagesControllers.createMessage
);

module.exports = router;
