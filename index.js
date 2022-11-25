const inquirer = require('inquirer');
const cTable = require('console.table');
const { getAllDepartments, getAllRoles, getAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, getRoleTitles, sendRoleId } = require('./helper/query');


// FUNCTION TO PRINT ALL EMPLOYEES

const printAllEmployees = async () => {
  results = await getAllEmployees();
  console.table('\nEmployees', results[0]);
}

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
    addEmployee(data.employeeFirstName, data.employeeLastName, newEmployeeRoleId, 1);
    await main();
  })
};
      
// FUNCTION TO PRINT ALL ROLES

const printAllRoles = async () => {
  results = await getAllRoles();
  console.table('\nRoles', results[0]);
}


// Calling main


const callMainMenuPrompt = () => {
  const mainMenu = {
    type: 'list',
    name: 'mainMenu',
    message: 'What would you like to do?',
    choices: [
      'View All Employees',
      'Add Employee',
      'Update Employee Role',
      'View All Roles',
      'Add Role',
      'View All Departments',
      'Add Department',
      'Quit'
    ]
  };
  return inquirer.prompt([mainMenu])
  }


const main = async () => {
  const menuChoice = await callMainMenuPrompt();
  const choice = menuChoice.mainMenu;
  if (choice === 'View All Employees') {
    await printAllEmployees()
    main();
  } else if (choice === 'Add Employee') {
    addEmployeePrompt();
  } else if (choice === 'Update Employee Role') {
    main();
  } else if (choice === 'View All Roles') {
    await printAllRoles();
    main();
  } else if (choice === 'Add Role') {
    main();
  } else if (choice === 'View All Departments') {
    main();
  } else if (choice === 'Add Department') {
    main();
  } else {
    console.log('\nThank You For Using The Employee Tracker!\nSee You Next Time!');
    return;
  }
}

main();