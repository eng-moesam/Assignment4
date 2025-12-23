const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

const DataFile="./users.json";
const readData=fs.readFileSync(DataFile,"utf-8");
const users=JSON.parse(readData);

app.use(express.json());

//1. Create an API that adds a new user to your users stored in a JSON file. (ensure that the email of the new user doesn’t exist before)(1 Grades) 
// o URL: POST /user 
  app.post("/userAdd", (req, res) => {

    const { name,email, age} = req.body ;
    const userExists = users.find(user => user.email === email);

  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }
  const newId=users.length > 0 ? users[users.length - 1].id + 1 : 1;
  const newUser = {id:newId, name, age, email };
  users.push(newUser);
  fs.writeFileSync(DataFile, JSON.stringify(users));
 return res.status(201).json({ message: "User added successfully" });
});


//2. Create an API that updates an existing user's name, age, or email by their ID. The user ID should be retrieved from the params. (1 Grade) 
// Note: Remember to update the corresponding values in the JSON file 
// o URL: PATCH /user/:id 

app.patch("/userUpdate/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {  name, age, email } = req.body ;


  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  const emailExists = users.find(user => user.email === email && user.id !== id);
  if (emailExists) {
    return res.status(400).json({ error: "Email already in use by another user" });
  }
   if (name) users[userIndex].name = name;
    if (age) users[userIndex].age = age;
    if (email) users[userIndex].email = email;


  fs.writeFileSync(DataFile, JSON.stringify(users));
 return res.status(200).json({ message: "User updated successfully" });
});



//3. Create an API that deletes a User by ID. The user id should be retrieved from either the request body or optional params. (1 Grade) 
// Note: Remember to delete the user from the file 
// o URL: DELETE /user{/:id}

app.delete("/userDelete{/:id}", (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(user => user.id === parseInt(id));
   
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users.splice(userIndex, 1);
  fs.writeFileSync(DataFile, JSON.stringify(users));
 return res.status(200).json({ message: "User deleted successfully" });
});


//4. Create an API that gets a user by their name. The name will be provided as a query parameter. (1 Grade) 
// o URL: GET /user/getByName 

app.get("/userByName", (req, res) => {
  const { name } = req.query;
  const user = users.find(user => user.name === name);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

      return   res.status(200).json(user);
    
});


//5. Create an API that gets all users from the JSON file. (1 Grade) 
// o URL: GET /user 
app.get("/userGet", (req, res) => {
 return res.status(200).json(users);
});
//6. Create an API that filters users by minimum age. (1 Grade) 
// o URL: GET /user/filter
app.get("/user/filter", (req, res) => {
  const minAge = parseInt(req.query.minAge);
  if (!minAge) {
    return res.status(400).json({ error: "minAge query parameter is required" });
  }
  const filteredUsers = users.filter(user => user.age >= minAge);
  return res.status(200).json(filteredUsers);
});
//7. Create an API that gets User by ID. (1 Grade) 
// o URL: GET /user/:id 

app.get("/userById/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  const user = users.find(user => user.id === parseInt(id));
    if (!user) {
    return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


app.all("{/*dummy}", (req, res) => {
  res.status(404).send('404 Not Found');
});
