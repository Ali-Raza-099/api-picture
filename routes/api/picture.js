var express = require("express");
var router = express.Router();
const { Picture } = require("../../modals/pictureModal");
const validatePicture = require("../../middleware/validatePicture");
const multer = require("multer");

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../../public/Images");
  },
  filename: (req, file, cb) => {
    cb(null, file.filename + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: Storage,
}).single("image");

router.post("/", upload, async (req, res) => {
  const picture = await new Picture({
    Title: req.body.name,
    Price: req.body.Price,
    image: req.file.filename,
  });
  picture.save();
});
/* GET home page. */
router.get("/", async (req, res) => {
  try {
    const picture = await Picture.find();
    res.send(picture);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
// get one picture
router.get("/:id", async (req, res) => {
  try {
    const picture = await Picture.findById(req.params.id);
    if (!picture) {
      return res
        .status(404)
        .send("The Picture with the given ID was not found");
    }
    res.send(picture);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

router.put("/:id", async (req, res) => {
  let picture = await Picture.findById(req.params.id);
  if (!picture) {
    return res.status(404).send("The Picture with the given ID was not found");
  }
  picture.Title = req.body.Title;
  picture.Price = req.body.Price;
  await picture
    .save()
    .then(() => {
      res.send(picture);
    })
    .catch((err) => {
      return res.status(500).json({ msg: err.message });
    });
});

router.delete("/:id", async (req, res) => {
  try {
    const picture = await Picture.findByIdAndDelete(req.params.id);
    if (!picture) {
      return res
        .status(404)
        .send("The Picture with the given ID was not found");
    }
    res.send(picture);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

module.exports = router;
