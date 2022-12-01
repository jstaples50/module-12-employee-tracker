const inquirer = require('inquirer');
const cTable = require('console.table');
const { getAllDepartments, getAllRoles, getAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, getRoleTitles, sendRoleId, sendDepartmentId } = require('./query');


// HELPER FUNCTIONS

const getRoleTitlesForInquirer = (array) => {
    rolesArray()
    .then((data) => {
      data[0].forEach(title => getValues(title, array));
    });
  }
  
const rolesArray = async () => {
    const results = await getRoleTitles();
    return results;
  }
  
const getValues = (body, array) => {
    for (let value of Object.values(body)) {
      array.push(value);
    }
  }
  
// FUNCTION TO GET ROLE ID
  
const getRoleID = async (roleTitle) => {
    const results = await sendRoleId(roleTitle);
  
    
    // Isolates the id from the body of the results object;
    
    const { id } = results[0][0];
    return id;
  }
  
// FUNCTION TO GET DEPARTMENT ID
  
const getDepartmentId = async (departmentName) => {
    const results = await sendDepartmentId(departmentName);
  
    const { id } = results[0][0];
    return id;
  }
  
  
// FUNCTION TO PRINT ALL EMPLOYEES
  
const printAllEmployees = async () => {
    results = await getAllEmployees();
    console.table('\nEmployees', results[0]);
  }
  
// FUNCTION TO ADD EMPLOYEE
// TODO: Create way to add default of NULL to managerID field
      
const addEmployeePrompt = async () => {
    const choices = [];
    
    getRoleTitlesForInquirer(choices);
    
    await inquirer.prompt([
      {
        type: 'input',
        name: 'employeeFirstName',
        message: "Enter new employee's first name",
      }, 
      {
        type: 'input',
        name: 'employeeLastName',
        message: "Enter new employee's last name"
      },
      {
        type: 'list',
        name: 'assignRole',
        message: "Pick new employee's role",
        choices: choices,
      }
    ])
    .then(async (data) => {
      const newEmployeeRoleId = await getRoleID(data.assignRole);
      addEmployee(data.employeeFirstName, data.employeeLastName, newEmployeeRoleId, 1);
      console.log(`\n\nNew employee ${data.employeeFirstName} ${data.employeeLastName} added!`);
    })
  };
        
// FUNCTION TO PRINT ALL ROLES
// TODO: Join tables so department name is shown instead of department Id
  
const printAllRoles = async () => {
    results = await getAllRoles();
    console.table('\nRoles', results[0]);
  }
  
// FUNCTION TO UPDATE EMPLOYEE ROLE
  
const updateEmployeeRolePrompt = async () => {
    const roleChoices = [];
    getRoleTitlesForInquirer(roleChoices);
  
    const employeeChoices = [];
    const employeeIds = [];
    const allEmployeesMeta = await getAllEmployees();
    const allEmployees = allEmployeesMeta[0]
    for (const employee of allEmployees) {
      employeeChoices.push(`${employee.first_name} ${employee.last_name}`);
      employeeIds.push(employee.id);
    }
  
    await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_list',
        message: "Which employee's role do you want to update?",
        choices: employeeChoices
      },
      {
        type: 'list',
        name: 'assignRole',
        message: "Pick employee's new role",
        choices: roleChoices
      }
    ]).then(async (data) => {
      const employeeIndex = employeeChoices.indexOf(`${data.employee_list}`);
      const employeeId = employeeIds[employeeIndex];
      const roleId = await getRoleID(data.assignRole);
      updateEmployeeRole(data.employee_list, employeeId, roleId);
      console.log(`\n\n${data.employee_list} role updated!`);
    });
  }
  
// FUNCTION TO ADD ROLE
  
const addRolePrompt = async () => {
    const departments = [];
  
    const departmentResults = await getAllDepartments();
    for (const department of departmentResults[0]) {
      departments.push(department.name);
    }
  
    await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the new role'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary of the new role'
      },
      {
        type: 'list',
        name: 'department',
        message: 'Pick the department for the new role',
        choices: departments
      }
    ]).then(async (data) => {
      const newDepartmentId = await getDepartmentId(data.department);
      addRole(data.title, data.salary, newDepartmentId);
      console.log(`\n\nNew Role: ${data.title} added!`);
    });
  }
  
// FUNCTION TO PRINT ALL DEPARTMENTS
  
const printAllDepartments = async () => {
    results = await getAllDepartments();
    console.table('\nDepartments', results[0]);
  }
  
// FUNCTION TO ADD DEPARTMENT
  
const addDepartmentPrompt = async () => {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'newDepartment',
        message: 'Enter new department name'
      }
    ]).then(async (data) => {
      addDepartment(data.newDepartment);
      console.log(`\n\nNew Department: ${data.newDepartment} was added!`);
    });
  }

module.exports = { printAllEmployees, addEmployeePrompt, printAllRoles, updateEmployeeRolePrompt, addRolePrompt, printAllDepartments, addDepartmentPrompt }