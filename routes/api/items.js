const express = require("express");
const router = express.Router();
const Item = require("../../models/items");
const auth = require('../../middleware/auth')

//@route get All Items
//@access public
router.get("/", (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then(items => {
      res.status(200).json({ items });
    });
});

//@route Create an Item
//@access public
router.post("/", auth, (req, res) => {
  const item = new Item({    
    name: req.body.name   
  });
  item
    .save()
    .then(item => {
      res.status(201).json({
          item, 
        message: "item created"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:id', auth, (req, res) => {
   Item.findById(req.params.id)
    .then(item => item.remove()
    .then(() => res.status(200).json({message:'item deleted'}))
    .catch(err => res.status(500).json({error:err}))
    )
})


module.exports = router;
