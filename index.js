#!/usr/bin/env node

const fs = require("fs");
const inquirer = require("inquirer");
const { createSpinner } = require("nanospinner");

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

function createfolder(folderpath) {
  if (!fs.existsSync(folderpath)) {
    fs.mkdirSync(folderpath, { recursive: true });
  }
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
    validate: function (input) {
      if (input === "") {
        return "Please enter file name";
      }
      return true;
    },
  });
  if (answers.filename) {
    const spinner = createSpinner("Creating...").start();
    await sleep();
    chooselist.forEach((item) => {
      const selected = item.toLowerCase();
      const pluralize = `${selected}s`;
      const versionfolder = version !== "empty" ? `${version}/` : "";
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

          spinner.success({
            text: `${capitalizeFirstLetter(pluralize)}: ${
              answers.filename
            }.${selected}.js`,
          });

          break;
        case "service":
          const serivcetemplate = `module.exports = {}`;
          createfile(filepath, serivcetemplate);

          spinner.success({
            text: `${capitalizeFirstLetter(pluralize)}: ${
              answers.filename
            }.${selected}.js`,
          });
          break;
        case "validation":
          const validationtemplate = `module.exports = {}`;
          createfile(filepath, validationtemplate);

          spinner.success({
            text: `${capitalizeFirstLetter(pluralize)}: ${
              answers.filename
            }.${selected}.js`,
          });
          break;
        case "middleware":
          const middlewaretemplate = `module.exports = {}`;
          createfile(filepath, middlewaretemplate);

          spinner.success({
            text: `${capitalizeFirstLetter(pluralize)}: ${
              answers.filename
            }.${selected}.js`,
          });
          break;
        case "model":
          const filecapitalize = capitalizeFirstLetter(answers.filename);
          const filelowercase = answers.filename.toLowerCase();
          let fileadds = filelowercase.toLowerCase();
          if (filelowercase.charAt(filelowercase.length - 1) !== "s") {
            fileadds = `${filelowercase.toLowerCase()}s`;
          }
          const modeltemplate = `const mongoose = require('mongoose');

const ${filecapitalize}Schema = new mongoose.Schema({
  name: {
    type: String,
    default: ''
  }
}, { collection: '${fileadds}', timestamps: true });

module.exports = mongoose.model('${fileadds}', ${filecapitalize}Schema);
`;
          createfile(filepath, modeltemplate);

          spinner.success({
            text: `${capitalizeFirstLetter(pluralize)}: ${
              answers.filename
            }.${selected}.js`,
          });
          break;
        case "router":
          const routetemplate = `const express = require('express');

const router = express.Router();

module.exports = router;
`;
          createfile(filepath, routetemplate);

          spinner.success({
            text: `${capitalizeFirstLetter(pluralize)}: ${
              answers.filename
            }.${selected}.js`,
          });
          break;
        default:
          process.exit();
      }
    });
    process.exit();
  }
}

async function actions(version) {
  const answers = await inquirer.prompt({
    name: "actions",
    type: "checkbox",
    message: "Select the item you want to create:",
    choices: [
      "Controller",
      "Service",
      "Model",
      "Router",
      "Middleware",
      "Validation",
    ],
    validate: function (input) {
      if (input.length === 0) {
        return "Please seleted";
      }
      return true;
    },
  });
  if (answers.actions.length > 0) {
    switchchoose(version, answers.actions);
  }
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
