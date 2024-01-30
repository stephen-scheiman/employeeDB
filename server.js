const inquirer = require("inquirer");
const mysql = require("mysql2");
const Table = require("cli-table3");

//const queryAllEmps = require('./db/view_all_employees.sql');
//console.log(queryAllEmps);

// Connect to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employee_db",
});

// View all employees function
const viewAllEmployees = function () {
  const sql = `SELECT emp.id AS 'Employee Number',
  emp.last_name AS 'Last Name',
  emp.first_name AS 'First Name',
  title AS Title,
  department.name AS Department,
  CONCAT(mgr.first_name,' ',mgr.last_name) AS 'Reports to'
  FROM employee emp
  JOIN employee mgr
  ON emp.manager_id=mgr.id
  JOIN role ON emp.role_id = role.id
  JOIN department ON role.department_id=department.id`;
  db.query(sql, function (err, result) {
    console.table(result);
  });
};

// View all departments function
const viewAllDepartments = function () {
  const sql = `SELECT id,name FROM department`;
  db.query(sql, function (err, result) {
    console.table(result);
  });
};

// View all roles function
const viewAllRoles = function () {
  const sql = `SELECT title AS Title, salary AS Salary,department.name AS Department 
  FROM employee_db.role
  JOIN department ON department_id=department.id;`;
  db.query(sql, function (err, result) {
    console.table(result);
  });
};

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

// Initial menu choices
const initialQuestion = function () {
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
          setTimeout(() => initialQuestion(), 100);
          break;
        case "View All Roles":
          viewAllRoles();
          setTimeout(() => initialQuestion(), 100);
          break;
        case "View All Employees":
          viewAllEmployees();
          setTimeout(() => initialQuestion(), 100);
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
};

// Add department function
const addDepartment = function () {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentAdd",
        message: "What is the name of the department you want to add?",
      },
    ])
    .then((answer) => {
      let newDepartmentName = answer["departmentAdd"];
      const sql = `INSERT INTO department (name) VALUES ('${newDepartmentName}')`;
      db.query(sql, function (err, result) {
        if (err) {
          console.log("Error inserting Department into Database:" + err);
        } else {
          console.log("Department Added to Database");
        }
      });
      viewAllDepartments();
      setTimeout(() => initialQuestion(), 500);
    });
};

// Add role function
const addRole = function () {
  // Execute the SQL query for department titles
  db.query("SELECT id,name FROM department", (error, results) => {
    if (error) {
      throw error;
    }
    // Format the query results as choices for Inquirer
    const deptChoices = results.map((row) => ({
      value: row.id,
      name: row.name,
    }));
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
          type: "list",
          name: "newRoleDept",
          message: "Which department does the new role belong to?",
          choices: deptChoices,
        },
      ])

      .then((answer) => {
        const newRoleName = answer["roleAdd"];
        const newRoleSalary = answer["newRoleSalary"];
        const newRoleDept = answer["newRoleDept"];
        const sql = `INSERT INTO role (title, salary, department_id) VALUES ('${newRoleName}', '${newRoleSalary}', '${newRoleDept}')`;
        db.query(sql, function (err, result) {
          if (err) {
            console.log("Error inserting Role into Database:" + err);
          } else {
            console.log("Role Added to Database");
          }
        });
        viewAllRoles();
        setTimeout(() => initialQuestion(), 500);
      });
  });
}

  // Add employee function
  const addEmployee = function () {
    // Execute the SQL query for role titles
    db.query("SELECT id, title FROM role", (error, results) => {
      if (error) {
        throw error;
      }
      // Format the query results as choices for Inquirer
      const roleChoices = results.map((row) => ({
        value: row.id,
        name: row.title,
      }));
      // Execute the SQL query for reports to manager
      const mgrList = `SELECT DISTINCT
      CONCAT(mgr.first_name,' ',mgr.last_name) AS 'manager',mgr.id
      FROM employee emp
      JOIN employee mgr
      ON emp.manager_id=mgr.id;`
      db.query(mgrList, (error, results) => {
        if (error) {
          throw error;
        }
        // Format the query results as choices for Inquirer
        const mgrChoices = results.map((row) => ({
          value: row.id,
          name: row.manager,
        }));
        inquirer
          .prompt([
            {
              type: "input",
              name: "firstName",
              message:
                "What is the first name of the employee you want to add?",
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
              choices: roleChoices,
            },
            {
              type: "list",
              name: "newEmpManager",
              message: "Which manager does the new role report to?",
              choices: mgrChoices,
            },
          ])
          .then((answer) => {
            const firstName = answer["firstName"];
            const lastName = answer["lastName"];
            const newEmpRole = answer["newEmpRole"];
            const newEmpManager = answer["newEmpManager"];
            console.log(newEmpManager);
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', '${newEmpRole}', '${newEmpManager}')`;
            db.query(sql, function (err, result) {
              if (err) {
                console.log("Error inserting Employee into Database:" + err);
              } else {
                console.log("Employee Added to Database");
              }
            });
            viewAllEmployees();
            setTimeout(() => initialQuestion(), 500);
          });
      });
    });
  }

  // Update employee function
  const updateEmployeeRole = function () {
    // Execute the SQL query for all employees
    db.query("SELECT id, CONCAT(last_name,' ',first_name) AS full_name FROM employee", (error, results) => {
      if (error) {
        throw error;
      }
      // Format the query results as choices for Inquirer
      const empChoices = results.map((row) => ({
        value: row.id,
        name: row.full_name,
      }));
      db.query("SELECT id, title FROM role", (error, results) => {
        if (error) {
          throw error;
        }
        // Format the query results as choices for Inquirer
        const roleChoices = results.map((row) => ({
          value: row.id,
          name: row.title,
        }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "employeeName",
              message: "Which employee's role would you like to update?",
              choices: empChoices,
            },
            {
              type: "list",
              name: "employeeRole",
              message: "Which role would you like to assign?",
              choices: roleChoices,
            },
          ])
          .then((answer) => {
            console.log(answer);
            const empName = answer["employeeName"];
            console.log(empName);
            const newRole = answer["employeeRole"];
            console.log(newRole);
            const sql = `UPDATE employee SET role_id ='${newRole}' WHERE employee.id = '${empName}'`;
            db.query(sql, function (err, result) {
              if (err) {
                console.log("Error updating Employee Role:" + err);
              } else {
                console.log("Role Updated");
              }
            });
            viewAllEmployees();
            setTimeout(() => initialQuestion(), 500);
          });
      });
    });
  };


initialQuestion();
