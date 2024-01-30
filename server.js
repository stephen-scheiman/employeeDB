const inquirer = require("inquirer");
const mysql = require("mysql2");
const Table = require("cli-table3");

// Connect to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employee_db",
});

const viewAllEmployees = async function () {
  const sql = `SELECT first_name AS 'First Name', last_name AS 'Last Name', role_id AS Role, manager_id AS 'Reports To' FROM employee`;
  db.query(sql, function (err, result) {
    console.table(result);
  });
}

const viewAllDepartments = async function () {
  const sql = `SELECT name FROM department`;
  db.query(sql, function (err, result) {
    console.table(result);
  });
}

const viewAllRoles = async function () {
  const sql = `SELECT title,salary,department_id FROM role`;
  db.query(sql, function (err, result) {
    console.table(result);
  });
}

console.clear();

console.log(`
{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}
{} _____ __  __ ____  _     _____   _______ _____ {}
{}| ____|  \\/  |  _ \\| |   / _ \\ \\ / / ____| ____|{}
{}|  _| | |\\/| | |_) | |  | | | \\ V /|  _| |  _|  {}
{}| |___| |  | |  __/| |__| |_| || | | |___| |___ {}
{}|_____|_|  |_|_|_  |_____\\___/_|_| |_____|_____|{}
{}|  \\/  |  / \\  | \\ | |  / \\  / ___| ____|  _ \\  {}
{}| |\\/| | / _ \\ |  \\| | / _ \\| |  _|  _| | |_) | {}
{}| |  | |/ ___ \\| |\\  |/ ___ \\ |_| | |___|  _ <  {}
{}|_|  |_/_/   \\_\\_| \\_/_/   \\_\\____|_____|_| \\_\\ {}
{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}
`);

const initialQuestion = async function () {
  inquirer
    .prompt([
      {
        type: "list",
        name: "initial_question",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update Employee Role",
        ],
      },
    ])
    .then((answers) => {
      switch (answers["initial_question"]) {
        case "View All Departments":
          viewAllDepartments();
          setTimeout(() => initialQuestion(),100);
          break;
        case "View All Roles":
          viewAllRoles();
          setTimeout(() => initialQuestion(),100);
          break;
        case "View All Employees":
          viewAllEmployees();
          setTimeout(() => initialQuestion(),100);
          break;
        case "Add a Department":
          console.log("Add a Department");
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          //setTimeout(() => initialQuestion(),100);
          break;
        case "Add an Employee":
          console.log("Add an Employee");
          addEmployee();
          break;
        case "Update Employee Role":
          console.log("Update Empoyee Role");
          updateEmployeeRole();
      }
    });
};

const addDepartment = function () {
  console.log("Function to add department");
  const addDepartmentQuestions = inquirer
    .prompt([
      {
        type: "input",
        name: "departmentAdd",
        message: "What is the name of the department you want to add?",
      },
    ])

    .then((answer) => {
      let newDepartmentName = answer["departmentAdd"];
      console.log(newDepartmentName);
    });
};

const addRole = async function () {
  console.log("Function to add role");
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleAdd",
        message: "What is the name of the role you want to add?",
      },
      {
        type: "input",
        name: "newRoleSalary",
        message: "What is the salary of the role?",
      },
      {
        type: "input",
        name: "newRoleDept",
        message: "Which department does the new role belong to?",
      },
    ])

    .then(async (answer) => {
      const newRoleName = answer["roleAdd"];
      const newRoleSalary = answer["newRoleSalary"];
      const newRoleDept = answer["newRoleDept"];
      const sql = `INSERT INTO role (title, salary, department_id) VALUES ('${newRoleName}', '${newRoleSalary}', '${newRoleDept}')`;
      db.query(sql, function(err,result){
        if (err) {
          console.log('Error inserting Role into Database:' + err);
        } else {
        console.log("Role Added to Database");}
      });
      viewAllRoles();
    });
};

const addEmployee = function () {
// Execute the SQL query
db.query('SELECT id, title FROM role', (error, results) => {
  if (error) {
    throw error;
  }
  // Format the query results as choices for Inquirer
  const choices = results.map((row) => ({
    value: row.id,
    name: row.title,
  }))
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the first name of the employee you want to add?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the last name of the employee you want to add?",
      },
      {
        type: "list",
        name: "newEmpRole",
        message: "What is the role of the new employee?",
        //choices: ["test"], //will need database query here!!!!
        choices: choices,
      },
      {
        type: "list",
        name: "newEmpManager",
        message: "Which manager does the new role report to?",
        choices: ["test"], //will need db query here!
      },
    ])

    .then((answer) => {
      const firstName = answer["firstName"];
      const lastName = answer["lastName"];
      const newEmpRole = answer["newEmpRole"];
      const newEmpManager = answer["newEmpManager"];
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', '${newEmpRole}', '${newEmpManager}')`;
      db.query(sql, function(err,result){
        if (err) {
          console.log('Error inserting Role into Database:' + err);
        } else {
        console.log("Employee Added to Database");}
      });
    });
});
}
const updateEmployeeRole = function () {
  console.log("Function to update employee role");
};



initialQuestion();
