const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const auth = require("../middleware/auth");

//______________________________post api (author creation)__________________________________>>>
router.post("/authors", authorController.createAuthor);

//_______________________________post api for login aouthor ________________________________>>>
router.post("/login", authorController.loginAuthor);

//______________________________post api (blog creation)_____________________________________>>>
router.post("/blogs", auth.authentication,blogController.createBlog);

//______________________________get api (blog document)______________________________________>>>

router.get("/blogs", auth.authentication, blogController.getBlogs);

//______________________________put api (blog updation)_______________________________________>>>
// router.put("/blogs/:blogId", auth.authentication,auth.authorization,blogController.updatedBlog);
router.put(
  "/blogs/:blogId",
  auth.authentication,
  auth.authorization,
  blogController.updateblogs
);


//_______________________________delete api-1_________________________________________________>>>
router.delete("/blogs/:blogId", auth.authentication,auth.authorization,blogController.deletedBlog);

//_______________________________delete api-2_________________________________________________>>>
router.delete("/blogs",auth.authentication,auth.authoriseByQuery, blogController.deleteByQueryParams);

//===============================================================================================

module.exports = router;
