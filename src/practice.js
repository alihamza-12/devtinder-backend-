
//--------------------------------------------- For Practice Episode :04-----------------------------------------

// Creating a Express server
// const express = require("express");

// const app = express();

// // Middleware
// app.use(express.json());

// // Test route
// //Request Handler
// app.use("/test", (req, res) => {
//   res.send("Hello Server is Created Successfully..");
// });

// //For request Query---------->http://localhost:3000/hello?user=Don&password=random
// app.get("/hello", (req, res) => {
//   console.log(req.query);
//   res.send(req.query);
// });

// //For request Param(Dynamic Routes)---------->http://localhost:3000/user/7645/Don
// app.get("/user/:userId/:userName", (req, res) => {
//   console.log(req.params);
//   res.send(req.params);
// });

// //Request Handler(GET)
// app.get("/user", (req, res) => {
//   res.send({ firstName: "Don", lastName: "haha" });
// });
// //Request Handler(POST)
// app.post("/user", (req, res) => {
//   console.log(req.body);
//   res.send(req.body);
// });
// //Request Handler(PATCH)
// app.patch("/user", (req, res) => {
//   res.send("This is PATCH request");
// });
// //Request Handler(DELETE)
// app.delete("/user", (req, res) => {
//   res.send("This is delete request");
// });

// app.listen(3000, () => {
//   console.log("Server is successfully Listening to Port:3000");
// });

/*
Routes
/abc
/ab?c --------------------->optional (b) or not
/ab+c --------------------->one or more (b)
/ab*c --------------------->zero or more (b)
*/

// -------------------------------Episode 05 : Middlewares & Error Handling-----------------------
// const express = require("express");

// const app = express();

// //Chaining of middleware
// app.use("/", (req, res, next) => {
//   console.log("Handler 1(Middleware 1)");
//   next();
// });
// app.get(
//   "/user",
//   (req, res, next) => {
//     console.log("Handler 2(Middleware 2)");
//     next();
//   },
//   (req, res, next) => {
//     console.log("Handler 3(Middleware 3)");
//     next();
//   },
//   (req, res) => {
//     console.log(
//       "Final handler(Request Handler from here the response is sended)"
//     );
//     try {
//       res.send("User Data");
//     } catch (err) {
//       res.status(500).send("something wrong");
//     }
//   }
// );

// // -----------if not using try catch
// // app.use("/", (err, req, res, next) => {
// //   if (err) {
// //     res.status(500).send("Something Wrong");
// //   }
// // });

// app.listen(3000, () => {
//   console.log("Server is successfully Listening to Port:3000");
// });

// -------------------------------Episode 05 : why need  Middlewares (Protected admin routes) -----------------------

// const express = require("express");

// const app = express();

//If you want to check the token first and then go to protected route in that way we need middlewares

//Middleware for /admin routes
// app.use("/admin", (req, res, next) => {
//   //Logic for validating the token of admin
//   const token = "abc";
//   const isAuth = token === "xyz";
//   console.log("Admin Authentication is checked");
//   if (!isAuth) {
//     res.status(401).send("UnAuthenticated Request");
//   } else {
//     next();
//   }
// });

// //getAllUsers (Protected Route only for admin)
// app.get("/admin/getAllUsers", (req, res) => {
//   res.send("Here is all the Users Data");
// });
// //deletedUsers (Protected Route only for admin)
// app.get("/admin/deletedUsers", (req, res) => {
//   res.send("Here is all the Deleted Users");
// });

// // -----------if not using try catch
// // app.use("/", (err, req, res, next) => {
// //   if (err) {
// //     res.status(500).send("Something Wrong");
// //   }
// // });

// app.listen(3000, () => {
//   console.log("Server is successfully Listening to Port:3000");
// });

// -------------------------------Episode 05 : Using seprate file  Middlewares (Protected user routes) -----------------------
//Src-->middlewares(folder)-->userAuth.js

// const express = require("express");

// const app = express();
// const {userAuth}= require('./middlewares/userAuth')

// //If you want to check the token first and then go to protected route in that way we need middlewares

// //Middleware for /admin routes------->here import the userAuth
// app.use("/user", userAuth );

// //getAllUsers (Protected Route only for admin)
// app.get("/user/getAllProducts", (req, res) => {
//   res.send("Here is all the Users Data");
// });
// //deletedUsers (Protected Route only for admin)
// app.get("/user/deletedProducts", (req, res) => {
//   res.send("Here is all the Deleted Users");
// });

// // -----------if not using try catch
// // app.use("/", (err, req, res, next) => {
// //   if (err) {
// //     res.status(500).send("Something Wrong");
// //   }
// // });

// app.listen(3000, () => {
//   console.log("Server is successfully Listening to Port:3000");
// });
