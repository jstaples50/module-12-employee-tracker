const inquirer = require("inquirer");
const {
  printAllEmployees,
  addEmployeePrompt,
  printAllRoles,
  updateEmployeeRolePrompt,
  addRolePrompt,
  printAllDepartments,
  addDepartmentPrompt,
} = require("./helper/inquirer");

const callMainMenuPrompt = () => {
  console.log("\n");
  const mainMenu = {
    type: "list",
    name: "mainMenu",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit",
    ],
  };
  return inquirer.prompt([mainMenu]);
};

const main = async () => {
  const menuChoice = await callMainMenuPrompt();
  const choice = menuChoice.mainMenu;
  if (choice === "View All Employees") {
    await printAllEmployees();
    main();
  } else if (choice === "Add Employee") {
    await addEmployeePrompt();
    main();
  } else if (choice === "Update Employee Role") {
    await updateEmployeeRolePrompt();
    main();
  } else if (choice === "View All Roles") {
    await printAllRoles();
    main();
  } else if (choice === "Add Role") {
    await addRolePrompt();
    main();
  } else if (choice === "View All Departments") {
    await printAllDepartments();
    main();
  } else if (choice === "Add Department") {
    await addDepartmentPrompt();
    main();
  } else {
    console.log(
      "\nThank You For Using The Employee Tracker!\nSee You Next Time!"
    );
    return;
  }
};

main();
