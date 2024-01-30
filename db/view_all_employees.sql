SELECT emp.id AS 'Employee Number',
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