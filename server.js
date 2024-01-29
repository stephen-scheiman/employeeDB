const inquirer = require("inquirer");
const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employee_db",
});

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

const initialQuestion = async function() {
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
        console.log("View All Departments");
        initialQuestion();
        break;
      case "View All Roles":
        console.log("View All Roles");
        initialQuestion();
        break;
      case "View All Employees":
        viewAllEmployees();
        initialQuestion();
        break;
      case "Add a Department":
        console.log("Add a Department");
        addDepartment();
        break;
      case "Add a Role":
        console.log("Add a Role");
        addRole();
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
}

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

const addRole = function () {
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

    .then((answer) => {
      const newRoleName = answer["roleAdd"];
      console.log(newRoleName);
      const newRoleSalary = answer["newRoleSalary"];
      console.log(newRoleSalary);
      const newRoleDept = answer["newRoleDept"];
      console.log(newRoleDept);
    });
};

const addEmployee = function () {
  console.log("Functionality to add employee");
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
        choices: ["test"], //will need database query here!!!!
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
      console.log(firstName);
      const lastName = answer["lastName"];
      console.log(lastName);
      const newEmpRole = answer["newEmpRole"];
      console.log(newEmpRole);
      const newEmpManager = answer["newEmpManager"];
      console.log(newEmpManager);
    });
};

const updateEmployeeRole = function () {
  console.log("Function to update employee role");
};

const viewAllEmployees = function () {
  const sql = `SELECT first_name AS 'First Name', last_name AS 'Last Name' FROM employee`;
  db.query(sql, function(err,result){
    console.log(result);
  });
  return;
}

initialQuestion();
