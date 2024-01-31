const mysql = require("mysql2");
const Table = require("cli-table3");
const inquirer = require("inquirer");

// Connect to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employee_db",
});

class SQLqueries {
  // View all employees method
  viewAllEmployees() {
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
    JOIN department ON role.department_id=department.id
    ORDER BY emp.last_name, emp.first_name`;
    db.query(sql, function (err, result) {
      console.table(result);
    });
  }
  // View all departments method
  viewAllDepartments() {
    const sql = `SELECT id,name FROM department`;
    db.query(sql, function (err, result) {
      console.table(result);
    });
  }
  // View all roles method
  viewAllRoles() {
    const sql = `SELECT title AS Title, salary AS Salary,department.name AS Department 
    FROM employee_db.role
    JOIN department ON department_id=department.id;`;
    db.query(sql, function (err, result) {
      console.table(result);
    });
  }
  // View all employees by Department method
  viewAllbyDept() {
    const sql = `SELECT dept.name AS Department,
    CONCAT(first_name,' ',last_name) AS Name, 
    title AS Title
    FROM employee_db.employee emp
    JOIN role ON emp.role_id = role.id
    JOIN department dept ON role.department_id=dept.id
    ORDER BY department_id ASC;`;
    db.query(sql, function (err, result) {
      console.table(result);
    });
  }
  viewAllbyMgr() {
    // Execute the SQL query for reports to manager
    const mgrList = `SELECT DISTINCT
    CONCAT(mgr.first_name,' ',mgr.last_name) AS 'managers', mgr.id
    FROM employee emp
    JOIN employee mgr
    ON emp.manager_id=mgr.id;`;

    db.query(mgrList, (error, results) => {
      if (error) {
        throw error;
      }
      // Format the query results as choices for Inquirer
    const mgrChoices = results.map((row) => ({
      value: row.id,
      name: row.managers,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeManager",
          message: "Which manager would you like to view the employees for?",
          choices: mgrChoices,
        },
      ])
      .then((answer) => {
        const mgrName = answer["employeeManager"];
        const sql = `SELECT * FROM employee WHERE manager_id ='${mgrName}'`;
        db.query(sql, function (err, result) {
          if (err) {
            console.log("Error updating Employee Manager:" + err);
          } else {
            console.table(result);
          }
        });
      });
    });
  }
}
module.exports = { SQLqueries };
