/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/

const User = require("../users/users-model")

async function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({
      status: 401,
      message: "You shall not pass!"
    })
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  const result = await User.findBy({username: req.body.username})
  if(!result.length) {
    next()
  } else {
    next({
      status: 422,
      message: "Username taken"
    })
  }

}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  const { username } = req.body;
  const result = await User.findBy({username: username})
  if (result.length) {
    req.user = result[0]
    next();
  } else {
    next({
      status: 401,
      message: "Invalid credentials"
    })
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
async function checkPasswordLength(req, res, next) {
  const { password } = req.body;
  if (password && password.trim().length > 3) {
    next()
  } else {
    next({
      status: 422,
      message: "Password must be longer than 3 chars"
    })
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,

}