
SELECT DISTINCT
CONCAT(mgr.first_name,' ',mgr.last_name) AS 'managers', mgr.id
FROM employee emp
JOIN employee mgr
ON emp.manager_id=mgr.id;

