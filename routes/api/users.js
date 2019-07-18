const express = require("express");
const router = express.Router();
const User = require("../../models/users");
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

router.post("/", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if(!name || !email || !password){
    res.status(400).json({
        msg:'please enter all fields'
    })
  }
  User.findOne({email})
  .then(user => {
    if(user) return res.status(400).json({msg: 'user already exist'})
  })
  const newUser = new User({
      name,
      email,
      password
  });
  bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) res.status(400).json({error:err}); 
          newUser.password = hash;
          newUser.save()
          .then(user => {
            
            jwt.sign(
                {id:user.id},
                config.get('jwtSecret'),
                {expiresIn:3600 },
                (err, token) => {
                    if(err) throw err;
                    res.status(200).json({
                        token,
                        user:{
                            id:user.id,
                          name:user.name,
                          email:user.email,
                          password:user.password
                           
                        }
                      })
                }
            )
            
            
          })
      })
  })
});




module.exports = router;
