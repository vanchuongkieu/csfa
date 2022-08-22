#!/usr/bin/env node

const fs = require("fs");
const inquirer = require("inquirer");
const { createSpinner } = require("nanospinner");

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

function createfolder(folderpath) {
  if (!fs.existsSync(folderpath)) {
    fs.mkdirSync(folderpath, { recursive: true });
  }
  successHandler();
}

function createfile(filepath, content = "") {
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, content);
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function switchchoose(version, chooselist) {
  const answers = await inquirer.prompt({
    name: "filename",
    type: "input",
    message: "Enter file name:",
  });
  const spinner = createSpinner("Creating...\n").start();
  await sleep();
  if (answers.filename) {
    const result = [];
    chooselist.forEach((item) => {
      const selected = item.toLowerCase();
      const pluralize = `${selected}s`;
      const versionfolder = version !== "empty" ? `v${version}/` : "";
      const folderpath = `${process.cwd()}/src/api/${versionfolder}${pluralize}`;
      const filepath = `${folderpath}/${answers.filename}.${selected}.js`;
      createfolder(folderpath);
      switch (selected) {
        case "controller":
          const controllertemplate = `module.exports = {
  ${answers.filename}: async (req, res, next) => {
    try {
      res.status(200).send('${answers.filename}');
    } catch (err) {
      next(err)
    }
  },
};
`;
          createfile(filepath, controllertemplate);
          result.push(`- ${pluralize}/${answers.filename}.${selected}.js`);
          break;
        case "service":
          const serivcetemplate = `module.exports = {
  ${answers.filename}: () => {
    return []
  },
};
`;
          createfile(filepath, serivcetemplate);
          result.push(`- ${pluralize}/${answers.filename}.${selected}.js`);
          break;
        case "service":
          const middlewaretemplate = `module.exports = {
  ${answers.filename}: () => {
    return []
  },
};
`;
          createfile(filepath, middlewaretemplate);
          result.push(`- ${pluralize}/${answers.filename}.${selected}.js`);
          break;
        case "model":
          const filecapitalize = capitalizeFirstLetter(answers.filename);
          const modeltemplate = `const mongoose = require('mongoose');

const ${answers.filename}Schema = mongoose.Schema({});

module.exports = mongoose.model('${filecapitalize}', ${answers.filename}Schema);
`;
          createfile(filepath, modeltemplate);
          result.push(`- ${pluralize}/${answers.filename}.${selected}.js`);
          break;
        case "route":
          const routetemplate = `const express = require('express');

const router = express.Router();

module.exports = router;
`;
          createfile(filepath, routetemplate);
          result.push(`- ${pluralize}/${answers.filename}.${selected}.js`);
          break;
        default:
          process.exit();
      }
    });
    spinner.success({ text: "Done" });
    console.log(result.join("\n"));
    process.exit();
  } else {
    spinner.error({ text: "Please enter file name..." });
    switchchoose(version, chooselist);
  }
}

async function actions(version) {
  const answers = await inquirer.prompt({
    name: "actions",
    type: "checkbox",
    message: "Select the item you want to create:",
    choices: ["Controller", "Service", "Model", "Route", "Middleware"],
  });
  const spinner = createSpinner("Checking...").start();
  if (answers.actions.length === 0) {
    spinner.error({ text: "Created failed" });
    process.exit();
  }
  spinner.success({ text: `Selected: ${answers.actions.length} item` });
  switchchoose(version, answers.actions);
}

(async function start() {
  console.clear();
  const answers = await inquirer.prompt({
    name: "version",
    type: "input",
    message: "Enter your api version:",
    default: "empty",
  });
  actions(answers.version);
})();
