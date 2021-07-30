const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const conversationsControllers = require("../controllers/conversations-controllers");
const checkAuth = require("../middleware/check-auth");

// router.use(checkAuth);
router.get("/conversation/:cid", conversationsControllers.getConversationById);
router.get("/:uid", conversationsControllers.getUsersConversations);
router.post(
  "/",
  [check("sender").not().isEmpty(), check("receiver").not().isEmpty()],
  conversationsControllers.createConversation
);

module.exports = router;
