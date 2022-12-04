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

const getAllRoles = () => {
  return db
    .promise()
    .query(
      "SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON department.id = role.department_id;"
    );
};

// Use this query to get both title and id...still need to relate them for the addEmployee 'SELECT title, id FROM role'

const getRoleTitles = () => {
  return db.promise().query("SELECT title FROM role");
};

// FUNCTION TO SEND ROLE ID

const sendRoleId = (roleTitle) => {
  return db
    .promise()
    .query(`SELECT * FROM role WHERE role.title = '${roleTitle}'`);
};

const getAllEmployees = () => {
  return db
    .promise()
    .query(
      "select emp.id, emp.first_name, emp.last_name, r1.title, d.name as department, r2.salary, m.first_name as manager from employee emp left join employee m on m.id=emp.manager_id left join role r1 on r1.id=emp.role_id left join role r2 on r2.id=r1.id left join department d on d.id=r1.department_id;"
    );
};

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

const sendDepartmentId = (departmentTitle) => {
  return db
    .promise()
    .query(
      `SELECT id FROM department WHERE department.name = '${departmentTitle}'`
    );
};

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
