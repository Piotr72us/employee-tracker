-- Drops the programming_db if it already exists
DROP DATABASE IF EXISTS employee_tracker;
-- Creates the DB "employee_tracker" (only works on local connections)
CREATE DATABASE employee_tracker;

-- Uses the DB employee_tracker for all the rest of the script
USE employee_tracker;

-- Creates the table "department"
CREATE TABLE department (
id INT (10) AUTO_INCREMENT NOT NULL,
name VARCHAR(30),
PRIMARY KEY (id)
);

-- Creates the table "role"
CREATE TABLE role (
id INT (10) AUTO_INCREMENT NOT NULL,
title VARCHAR(30),
salary DECIMAL(7,0),
department_id INT(10),
PRIMARY KEY (id)
);

-- Creates the table "employee"
CREATE TABLE employee (
id INT(10) AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT (10),
manager_id INT (10) DEFAULT NULL,
PRIMARY KEY (id)
);


-- Inserts a set of records into the "department" table
INSERT INTO department (name)
VALUE ("Sales"), ("Engineering"), ("Legal"), ("Finance");

-- Inserts a set of records into the "role" table
INSERT INTO role (title, salary, department_id)
VALUE ("Sales Lead", 100000, 1),
      ("Salesperson", 80000, 1),
      ("Lead Engineer", 150000, 2),
      ("Software Engineer", 120000, 2),
      ("Accountant", 125000, 4),
      ("Legal Team Lead", 250000, 3),
      ("Lawyer", 190000, 3);

-- Inserts a set of records into the "employee" table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("John", "Doe", 1, 3),
      ("Mike", "Chan", 2, 1),
      ("Ashley", "Rodriguez", 3, NULL),
      ("Kevin", "Tupik", 4, 3),
      ("Malia", "Brown", 5, NULL),
      ("Sarah", "Lourd", 6, NULL),
      ("Tom", "Allen", 7, 6);


SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;