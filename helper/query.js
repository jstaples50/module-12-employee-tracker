const mysql = require('mysql2');
const cTable = require('console.table');
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'indigoshades11',
      database: 'employee_db'
    },
    console.log(`Connected to the courses_db database.`)
  );

// const getAllDepartments = () => {
//     db.query('SELECT * FROM department', (err, results) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         console.table('\nDepartments', results);
//     })
// }

const getAllDepartments = () => {
    return db.promise().query('SELECT * FROM department')
}

const getAllRoles = () => {
    return db.promise().query('SELECT * FROM role')
}

// Use this query to get both title and id...still need to relate them for the addEmployee 'SELECT title, id FROM role'

const getRoleTitles = () => {
    return db.promise().query('SELECT title FROM role')
}

// FUNCTION TO GET ROLE ID

const sendRoleId = (roleTitle) => {
    return db.promise().query(`SELECT * FROM role WHERE role.title = '${roleTitle}'`);
}

// getAllEmployees as a promise

const getAllEmployees = () => {
    return db.promise().query('SELECT * FROM employee');
}


const addDepartment = (departmentName) => {
    db.query(`INSERT INTO department (name) VALUES ('${departmentName}');`, (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`\n\n${departmentName} added to Departments!`);
    })
}

const addRole = (title, salary, departmentId) => {
    db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${title}', '${salary}', '${departmentId}');`, (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(results);
    })
}

// addEmployee as a callback function

const addEmployee = (firstName, lastName, roleId, managerId=null) => {
    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', '${roleId}', '${managerId}');`, (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
    })
} 


const updateEmployeeRole = (employeeName, employeeID, newRoleId) => {
    db.query(`UPDATE employee SET role_id = ${newRoleId} WHERE id= ${employeeID}`, (err, result) => {
        if (err) {
            console.error(err);
            return;
        } else {
            console.log(`\n\nEmployee ${employeeName} updated!`);
        }

    });
}

module.exports = { getAllDepartments, getAllRoles, getAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, getRoleTitles, sendRoleId };