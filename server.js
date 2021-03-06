// Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  // port; if not default 3306
  port: 3306,
  // username
  user: "root",
  // password
  password: "1410Wilno",
  database: "employee_tracker"
});

connection.connect(function (err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Roles",
        "View All Departments",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "Exit"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewAll();
          break;

        case "View All Employees By Department":
          viewByDept();
          break;

        // case "View All Employees By Manager":
        //   viewByMgr();
        //   break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "Update Employee Manager":
          updateMgr();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "View All Departments":
          viewDepartments();
          break;

        case "Exit":
          connection.end();
          break;

      }
    });
}

function viewAll() {

  const query = `SELECT employee.id, employee.first_name, employee.last_name, title, salary, name department, concat(manager.first_name, " ", manager.last_name) manager FROM employee 
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON manager.id = employee.manager_id;`;

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

function viewRoles() {
  const query = "SELECT role.id, title, salary, name department FROM role LEFT JOIN department ON department.id = role.department_id;";

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

function viewDepartments() {
  const query = "SELECT * FROM department";

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

function viewByDept() {
  // for now it shows dept names + roles; it should show dept names + employee names
  var query = `SELECT department.name department, employee.first_name, employee.last_name, role.title FROM department 
  INNER JOIN role ON department.id = role.department_id 
  INNER JOIN employee ON employee.role_id = role.id
  ORDER BY role.department_id;`;
  connection.query(query, function (err, res) {

    if (err) throw err;
    console.table(res);
    runSearch();

  });
}

function search(sql) {
  return new Promise( (resolve, reject) =>{
    connection.query(sql, (error, data)=> {
      resolve(data);
    })
  })
}

function addEmployee() {
  search("SELECT id, title FROM role").then((roleData)=> {
    const newRoles = roleData.map( (results)=> {
      return results.title;
    })

    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is your new employee first name?"
        },
        {
          name: "last_name",
          type: "input",
          message: "What is your new employee last name?"
        },
        {
          name: "title",
          type: "list",
          message: "What is your new employee title?",
          choices: newRoles
        },
        {
          name: "manager_id",
          type: "input",
          message: "What is your new employee manager ID?"
        }
      ])
      .then(function (answer) {

        let roleObject = roleData.find((data) => {
          return data.title === answer.title;
        })

        // console.log(roleObject);
        const roleId = roleObject.id;
        console.log(answer.title, roleId);

        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: roleId,
            // salary: answer.salary,
            manager_id: answer.manager_id
          },
          function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " new employee added!\n");
          })

        runSearch();
      });
  })
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is your new role title?"
      },
      {
        name: "salary",
        type: "input",
        message: "What is your new role salary?"
      },
      {
        name: "department_id",
        type: "input",
        message: "What is your new role department ID?"
      }
    ])
    .then(function (answer) {

      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " New role added!\n");
        }
      );
      viewRoles();
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is your new department name?"
      }
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.name
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " new department added!\n");
        }
      );
      viewDepartments();
    });
}


function updateRole() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is your employee first name?"
      },
      {
        name: "last_name",
        type: "input",
        message: "What is your employee last name?"
      },
      {
        name: "role_id",
        type: "input",
        message: "What is your employee new role ID?"
      }
    ])
    .then(function (answer) {

      connection.query(
        `UPDATE employee SET role_id = "${answer.role_id}" WHERE (first_name = "${answer.first_name}" AND last_name = "${answer.last_name}")`,
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " Role updated!\n");
        }
      );

      runSearch();
    });
}

function removeEmployee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the first name of the employee you want to remove?"
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the last name of the employee you want to remove?"
      }
    ])
    .then(function (answer) {

      connection.query(
        `DELETE FROM employee WHERE (first_name = "${answer.first_name}" AND last_name="${answer.last_name}")`,
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " employee removed!\n");
        }
      );
      runSearch();
    });

}