INSERT INTO department (name)
VALUES ("Sales"),
        ("Marketing"),
        ("Operations"),
        ("Legal"),
        ("Finance"),
        ("Facilities"),
        ("Information Technology");



INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 100000, 001),
        ("Marketing", 80000, 002),
        ("Engineer", 80000, 003),
        ("Attorney", 120000, 004),
        ("Accountant", 80000, 005),
        ("Maintenance Worker", 40000, 006),
        ("Systems Administrator", 80000, 007);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Elliot", "Smith",001,1),
       ("Amira", "Afzal",002,1),
       ("Christoper", "Lee",003,2),
       ("Verónica", "Rodriguez",004,3),
       ("Igor", "Ivanov",005,2),
       ("Sam", "Smith",006,3),
       ("Darth", "Vader",007,3);