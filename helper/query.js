const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "indigoshades11",
    database: "employee_db",
  },
  console.log(`Connected to the courses_db database.`)
);

// FUNCTION TO GET ALL DEPARTMENTS

const getAllDepartments = () => {
  return db.promise().query("SELECT * FROM department");
};

// FUNCTION TO GET ALL ROLES

const getAllRoles = () => {
  return db
    .promise()
    .query(
      "SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON department.id = role.department_id;"
    );
};

// FUNCTION TO GET ALL ROLE TITLES

const getRoleTitles = () => {
  return db.promise().query("SELECT title FROM role");
};

// FUNCTION TO SEND ROLE ID

const sendRoleId = (roleTitle) => {
  return db
    .promise()
    .query(`SELECT * FROM role WHERE role.title = '${roleTitle}'`);
};

// FUNCTION TO GET ALL EMPLOYEES

const getAllEmployees = () => {
  return db
    .promise()
    .query(
      "select emp.id, emp.first_name, emp.last_name, r1.title, d.name as department, r2.salary, m.first_name as manager from employee emp left join employee m on m.id=emp.manager_id left join role r1 on r1.id=emp.role_id left join role r2 on r2.id=r1.id left join department d on d.id=r1.department_id;"
    );
};

// FUNCTION TO ADD DEPARTMENT

const addDepartment = (departmentName) => {
  db.query(
    `INSERT INTO department (name) VALUES ('${departmentName}');`,
    (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
};

// FUNCTION TO SEND DEPARTMENT ID

const sendDepartmentId = (departmentTitle) => {
  return db
    .promise()
    .query(
      `SELECT id FROM department WHERE department.name = '${departmentTitle}'`
    );
};

// FUNCTION TO ADD ROLE

const addRole = (title, salary, departmentId) => {
  db.query(
    `INSERT INTO role (title, salary, department_id) VALUES ('${title}', '${salary}', '${departmentId}');`,
    (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
};

// FUNCTION TO ADD EMPLOYEE WITH NO MANAGER

const addEmployee = (firstName, lastName, roleId) => {
  db.query(
    `INSERT INTO employee (first_name, last_name, role_id) VALUES ('${firstName}', '${lastName}', '${roleId}');`,
    (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
};

// FUNCTION TO ADD EMPLOYEE UNDER A MANAGER

const addEmployeeWithManager = (firstName, lastName, roleId, managerId) => {
  db.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', '${roleId}', '${managerId}');`,
    (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
};

// FUNCTION TO UPDATE EMPLOYEE ROLE

const updateEmployeeRole = (employeeName, employeeID, newRoleId) => {
  db.query(
    `UPDATE employee SET role_id = ${newRoleId} WHERE id= ${employeeID}`,
    (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
};

module.exports = {
  getAllDepartments,
  getAllRoles,
  getAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  addEmployeeWithManager,
  updateEmployeeRole,
  getRoleTitles,
  sendRoleId,
  sendDepartmentId,
};
