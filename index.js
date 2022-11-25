const inquirer = require('inquirer');
const cTable = require('console.table');
const { getAllDepartments, getAllRoles, getAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, getRoleTitles, sendRoleId } = require('./helper/query');


const mainMenu = {
  type: 'list',
  name: 'main-menu',
  message: 'What would you like to do?',
  choices: [
    'View All Employees',
    'Add Employee',
    'Update Employee Role',
    'View All Roles',
    'Add Role',
    'View All Departments',
    'Add Department'
  ]
};

// TODO: Create way to add default of NULL to managerID field

const addEmployeePrompt = async () => {
  // FUNCTIONS

  // Experiments to get data from sql database and parse it into array

  const getRoleTitlesForInquirer = (array) => {
    rolesArray().then((data) => {
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

  // EXECUTION

  const choices = [];

  getRoleTitlesForInquirer(choices);

  inquirer.prompt([
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
      console.log(data);
      const newEmployeeRoleId = await getRoleID(data.assignRole);
      console.log(newEmployeeRoleId);
      addEmployee(data.employeeFirstName, data.employeeLastName, newEmployeeRoleId, 1);
    });
};


// FUNCTION TO PRINT ALL ROLES

const printAllRoles = async () => {
  results = await getAllRoles();
  console.table('\nRoles', results[0]);
}


addEmployeePrompt();

