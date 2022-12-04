const inquirer = require("inquirer");
const cTable = require("console.table");
const {
  getAllDepartments,
  getAllRoles,
  getAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  getRoleTitles,
  sendRoleId,
  sendDepartmentId,
  getManagerNames,
} = require("./query");

// HELPER FUNCTIONS

const getRoleTitlesForInquirer = (array) => {
  rolesArray().then((data) => {
    data[0].forEach((title) => getValues(title, array));
  });
};

const rolesArray = async () => {
  const results = await getRoleTitles();
  return results;
};

const getValues = (body, array) => {
  for (let value of Object.values(body)) {
    array.push(value);
  }
};

// Function to get manager names in an array

// const getManagerNamesForInquirer = (array) => {
//   managerNamesArray().then((data) => {
//     data[0].forEach((name) => getValues(name, array));
//   });
// };

// FUNCTION TO GET EMPLOYEE NAMES

const getEmployeeNamesandIds = async (
  employeeChoicesArray,
  employeeIdsArray,
  managersOnly = false
) => {
  const allEmployeesMeta = await getAllEmployees();
  const allEmployees = allEmployeesMeta[0];
  if (managersOnly) {
    for (const employee of allEmployees) {
      if (employee.manager_id === NULL) {
        employeeChoicesArray.push(
          `${employee.first_name} ${employee.last_name}`
        );
        employeeIdsArray.push(employee.id);
      }
    }
  } else {
    for (const employee of allEmployees) {
      employeeChoicesArray.push(`${employee.first_name} ${employee.last_name}`);
      employeeIdsArray.push(employee.id);
    }
  }
};

// Manager names array experiment

const getManagerNamesForInquirer = (array) => {
  managerNamesArray().then((data) => {
    data.forEach((nameSet) => {
      const firstLastNameArray = [];
      getValues(nameSet, firstLastNameArray);
      array.push(firstLastNameArray);
    });
  });
};

const managerNamesArray = async () => {
  const results = await getManagerNames();
  return results[0];
};

// FUNCTION TO GET ROLE ID

const getRoleID = async (roleTitle) => {
  const results = await sendRoleId(roleTitle);

  // Isolates the id from the body of the results object;

  const { id } = results[0][0];
  return id;
};

// FUNCTION TO GET DEPARTMENT ID

const getDepartmentId = async (departmentName) => {
  const results = await sendDepartmentId(departmentName);

  const { id } = results[0][0];
  return id;
};

// FUNCTION TO GET EMPLOYEE ID

// const getEmployeeId = async (employee)

// FUNCTION TO PRINT ALL EMPLOYEES

const printAllEmployees = async () => {
  results = await getAllEmployees();
  console.table("\nEmployees", results[0]);
};

// FUNCTION TO ADD EMPLOYEE
// TODO: Create way to add default of NULL to managerID field

const addEmployeePrompt = async () => {
  const roleChoicesEmployeePrompt = [];
  getRoleTitlesForInquirer(roleChoicesEmployeePrompt);
  // const managerChoicesPrompt = [];
  // getManagerNamesForInquirer(managerChoicesPrompt);

  const managerChoicesPrompt = [];
  const employeeIds = [];

  await inquirer
    .prompt([
      {
        type: "input",
        name: "employeeFirstName",
        message: "Enter new employee's first name",
      },
      {
        type: "input",
        name: "employeeLastName",
        message: "Enter new employee's last name",
      },
      {
        type: "list",
        name: "assignRole",
        message: "Pick new employee's role",
        choices: roleChoicesEmployeePrompt,
      },
      {
        type: "confirm",
        name: "addManager",
        message: "Would you like to add a manager for this employee?",
      },
      {
        type: "list",
        name: "assignManager",
        message: "Pick manager new employee is under",
        choices: managerChoicesPrompt,
        when: (data) => data.addManager === true,
      },
    ])
    .then(async (data) => {
      const newEmployeeRoleId = await getRoleID(data.assignRole);
      if (!data.addManager) {
        addEmployee(
          data.employeeFirstName,
          data.employeeLastName,
          newEmployeeRoleId
        );
      } else {
        // const newEmployeeManagerId = await getManagerID();
        addEmployee(
          data.employeeFirstName,
          data.employeeLastName,
          newEmployeeRoleId
          // newEmployeeManagerId
        );
      }
      console.log(
        `\n\nNew employee ${data.employeeFirstName} ${data.employeeLastName} added!`
      );
    });
};

// FUNCTION TO PRINT ALL ROLES
// TODO: Join tables so department name is shown instead of department Id

const printAllRoles = async () => {
  results = await getAllRoles();
  console.table("\nRoles", results[0]);
};

// FUNCTION TO UPDATE EMPLOYEE ROLE

const updateEmployeeRolePrompt = async () => {
  const roleChoices = [];
  getRoleTitlesForInquirer(roleChoices);

  const employeeChoices = [];
  const employeeIds = [];
  await getEmployeeNamesandIds(employeeChoices, employeeIds);

  await inquirer
    .prompt([
      {
        type: "list",
        name: "employee_list",
        message: "Which employee's role do you want to update?",
        choices: employeeChoices,
      },
      {
        type: "list",
        name: "assignRole",
        message: "Pick employee's new role",
        choices: roleChoices,
      },
    ])
    .then(async (data) => {
      const employeeIndex = employeeChoices.indexOf(`${data.employee_list}`);
      const employeeId = employeeIds[employeeIndex];
      const roleId = await getRoleID(data.assignRole);
      updateEmployeeRole(data.employee_list, employeeId, roleId);
      console.log(`\n\n${data.employee_list} role updated!`);
    });
};

// FUNCTION TO ADD ROLE

const addRolePrompt = async () => {
  const departments = [];

  const departmentResults = await getAllDepartments();
  for (const department of departmentResults[0]) {
    departments.push(department.name);
  }

  await inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the title of the new role",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the salary of the new role",
      },
      {
        type: "list",
        name: "department",
        message: "Pick the department for the new role",
        choices: departments,
      },
    ])
    .then(async (data) => {
      const newDepartmentId = await getDepartmentId(data.department);
      addRole(data.title, data.salary, newDepartmentId);
      console.log(`\n\nNew Role: ${data.title} added!`);
    });
};

// FUNCTION TO PRINT ALL DEPARTMENTS

const printAllDepartments = async () => {
  results = await getAllDepartments();
  console.table("\nDepartments", results[0]);
};

// FUNCTION TO ADD DEPARTMENT

const addDepartmentPrompt = async () => {
  await inquirer
    .prompt([
      {
        type: "input",
        name: "newDepartment",
        message: "Enter new department name",
      },
    ])
    .then(async (data) => {
      addDepartment(data.newDepartment);
      console.log(`\n\nNew Department: ${data.newDepartment} was added!`);
    });
};

module.exports = {
  printAllEmployees,
  addEmployeePrompt,
  printAllRoles,
  updateEmployeeRolePrompt,
  addRolePrompt,
  printAllDepartments,
  addDepartmentPrompt,
};

// TESTS

const testManagers = async () => {
  results = await managerNamesArray();
  console.log(results);
};

// const masterTestArray = [];
// getManagerNamesForInquirer(masterTestArray);
// console.log(masterTestArray);
