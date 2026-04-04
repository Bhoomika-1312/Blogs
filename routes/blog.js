const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const blogController = require("../controllers/blogController");
const { requireAuth } = require("../middlewares/requireAuth");

const UPLOADS = path.join(__dirname, "..", "public", "uploads");
if (!fs.existsSync(UPLOADS)) {
  fs.mkdirSync(UPLOADS, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOADS);
  },
  filename(req, file, cb) {
    const safe = file.originalname.replace(/[^\w.\-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({ storage });

const router = Router();

router.get("/add-new", requireAuth, blogController.getAddNewPage);
router.post("/", requireAuth, upload.single("CoverImage"), blogController.createBlog);
router.get("/edit/:id", requireAuth, blogController.getEditPage);
router.post(
  "/edit/:id",
  requireAuth,
  upload.single("CoverImage"),
  blogController.updateBlog,
);
router.post("/delete/:id", requireAuth, blogController.deleteBlog);
router.post("/comment/:blogId", requireAuth, blogController.addComment);
router.post("/:id/like", requireAuth, blogController.toggleLike);
router.get("/:id", blogController.getBlogById);

module.exports = router;
