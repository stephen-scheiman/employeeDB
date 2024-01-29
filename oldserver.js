const express = require('express');
const fs = require('fs');
const mysql = require('mysql2');
const CLI = require('./CLI');
const deptData = fs.readFileSync('./db/view_all_departments.sql','utf8');
const empData = fs.readFileSync('./db/view_all_employees.sql','utf8');
const roleData = fs.readFileSync('./db/view_all_roles.sql','utf8');



const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'password',
    database: 'employee_db'
  }
);

// Query database
// db.query('DESCRIBE role', function (err, results) {
//     console.log(results);
//   });

  // Query database
// db.query('SELECT * FROM employee', function (err, results) {
//   console.log(results);
// });

// const allRoles = db.query(roleData, function(err,result) {
//   return result;
// });

// const allEmps = db.query(empData, function(err,result){
//   return result;
// });

// const allDepts = db.query(deptData, function(err,result){
//   return result;
// })

  // Default response for any other request (Not Found)
  app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    return (`Server running on port ${PORT}`);
  });

  CLI;
