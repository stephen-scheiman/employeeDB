SELECT dept.name AS Department,
CONCAT(first_name,' ',last_name) AS Name, 
title AS Title
FROM employee_db.employee emp
JOIN role ON emp.role_id = role.id
JOIN department dept ON role.department_id=dept.id
ORDER BY department_id ASC;