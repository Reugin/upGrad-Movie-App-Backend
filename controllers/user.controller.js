const User = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
const TokenGenerator = require('uuid-token-generator');
const Joi = require('joi'); // Import Joi for validation


// Create a token generator with a specific secret key
const tokenGenerator = new TokenGenerator();

// Sign up a new user
exports.signUp = (req, res) => {
  const { email_address, first_name, last_name, password, mobile_number } = req.body;

  // Define the validation schema for user registration
  const userValidationSchema = Joi.object({
    email_address: Joi.string().email().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    password: Joi.string().required(),
    mobile_number: Joi.string(), // Optional field
  });

  // Validate user data against the schema
  const { error } = userValidationSchema.validate(req.body);

  if (error) {
    return res.sendError(400, error.details[0].message);
  }

  // Generate a UUID for the user
  const uuid = uuidv4();

  // Create a new user object
  const newUser = new User({
    first_name,
    last_name,
    contact: mobile_number, // Using the provided mobile_number
    email:email_address, // Using the provided email
    password,
    username: `${first_name}_${last_name}`, // Change this as needed
    uuid,
    accesstoken: tokenGenerator.generate(uuid), // Assuming tokenGenerator is defined elsewhere
    isLoggedIn: false,
  });

  // Save the user to the database
  newUser
    .save()
    .then(() => {
      res.sendSuccess('User created successfully');
    })
    .catch((err) => {
      res.sendError(500,err.message)
    });
};

// Log in a user
exports.login = (req, res) => {
  const { username, password } = req.body;
  const userValidationSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  // Validate user data against the schema
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.sendError(400, error.details[0].message);
  }

  console.log(`username ${username} password ${password}`)
  // Find the user by username and password
  User.findOne({ username:username, password })
    .then((user) => {
      if (user) {
        // Update the user's isLoggedIn status
        user.isLoggedIn = true;
        user.save();


        res.header('access-token', user.accesstoken)
        res.sendSuccess({ message: 'Login successful','access-token': user.accesstoken, id: user.uuid });
      } else {
        
        res.status(401).json({ message: 'Login failed. Invalid username or password.' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Log out a user
exports.logout = (req, res) => {
  const { uuid } = req.body;
  const userValidationSchema = Joi.object({
    uuid: Joi.string().required(),
  });

  // Validate user data against the schema
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.sendError(400, error.details[0].message);
  }

  // Find the user by their unique ID
  User.findOne({ uuid: uuid })
    .then((user) => {
      if (user) {
        // Update the user's isLoggedIn status
        user.isLoggedIn = false;
        user.save();

        res.status(200).json({ message: 'Logged Out successfully.' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Get coupon code for a user
exports.getCouponCode = (req, res) => {
    const authorizationHeader = req.headers.authorization;
    const couponCodeToFind = req.query.code; 
  
    console.log(`authorizationHeader ${authorizationHeader}  couponCodeToFind ${couponCodeToFind}`)
    // Step 1: Extract the user ID from the authorization header
    let token = null
    if (authorizationHeader) {
       token = authorizationHeader.split(' ')[1]; // Assuming you're using Bearer token format
    }else{
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (couponCodeToFind == "" ) {
      return res.sendError(400, "Coupon Code Token Not Found")
    }
  
    // Step 2: Find the user by user ID
    User.findOne({ accesstoken: token })
      .then((user) => {
        if (user) {
          // Step 3: Search for the coupon with the specified code
          const coupon = user.coupens.find((coupon) => coupon.id == couponCodeToFind);
  
          if (coupon) {
            res.status(200).json(coupon);
          } else {
            res.status(404).json({ message: 'Coupon not found for the specified code' });
          }
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  };
  
  // Book a show for a user
  exports.bookShow = (req, res) => {
    const { customerUuid, bookingRequest } = req.body;

    const authorizationHeader = req.headers.authorization;
  
    console.log(`authorizationHeader ${authorizationHeader}`)
    // Step 1: Extract the user ID from the authorization header
    let token = null
    if (authorizationHeader) {
       token = authorizationHeader.split(' ')[1]; // Assuming you're using Bearer token format
    }else{
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

  
    console.log(`customerUUid  ${customerUuid}, bookingRequest ${bookingRequest}`)
    // Find the user by their unique ID and access token
    User.findOne({ accesstoken: token, uuid: customerUuid })
      .then((user) => {
        if (user) {

          bookingRequest.reference_number = Math.floor(Math.random() * 1000000)
          // Add the booking request to the user's bookingRequests
          user.bookingRequests.push(bookingRequest);
  
          // Save the updated user
          user.save();
  
          res.status(201).json({ message: 'Show booked successfully', reference_number:bookingRequest.reference_number});
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  };


  function addUsers(){
    User.insertMany([
      {
         "userid": 1,
         "email":"a@b.com", 
         "first_name": "user1", 
         "last_name": "user1", 
         "username":"test",
         "contact":"9898989898", 
         "password":"test@123",
         "role":"user", 
         "isLoggedIn": false, 
         "uuid":"5555", 
         "accesstoken":"66666",
         "coupens":[
            {
               "id":101,discountValue: 101 
            },
            {"id":102,discountValue: 102 
            }
         ],
         "bookingRequests":[
            {
               "reference_number":29783,
               "coupon_code":101,show_id: 1003,tickets:[1,3]
            },
            {
               "reference_number":19009,
               "coupon_code":201,show_id: 1002,tickets:[1]
            }
         ]
      },
      {
         "userid": 2,
         "email":"p@q.com", 
         "first_name": "user2", 
         "last_name": "user2", 
         "username":"user", 
         "contact":"9898989898", 
         "password":"user@123",
         "role":"admin", 
         "isLoggedIn": false, 
         "uuid":"11122", 
         "accesstoken":"2211",
         "coupens":[
            {
               "id":103,discountValue: 103 
            },
            {
               "id":104,discountValue: 104 
            }
         ],
         "bookingRequests":[
            {
               "reference_number":29783,
               "coupon_code":101,show_id: 1003,tickets:[1,3]
            },
          {
               "reference_number":19009,
               "coupon_code":201,show_id: 1002,tickets:[1]
            }
         ]
      }
   ])
  }
  