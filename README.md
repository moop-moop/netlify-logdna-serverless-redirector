# Netlify Functions Template

Serverless functions, services for uwhealth.org in node.js project

## 1. Getting Started

### Local Development Environment Assumptions

1. VSCode is being used as the IDE.

2. Windows NVM is uesd to version Node. <https://github.com/coreybutler/nvm-windows>

3. Prettier VSCode plugin used. <https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode>

4. ESLint VSCode plugin used. <https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint>

### Create a repository from this template

There is button on this repository at the top to create a new repository from this template. It's essentially a shallow detached clone.

[GitHub.com Help: Creating a repository from a template](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template)

>*Note: Clone the repo only if you plan on editing the actual template*

> ```bash
> git clone git@github.com:UWHealth/netlify-functions-template.git
> ```

### Install dependencies

```bash
npm install
```

## 2. Running Locally

### Netlify (netlify-cli)

**Do not install the netlify-cli npm package globally!**

You will encounter mixed up behavior as npm and the command might start crossing the local versus globally installed netlify command. And netlify is updating the netlify-cli package regularly. It's still a work in-progress.

You will need to run netlify dev either through npm:

`npm start` or directly `npx netlify dev` (both are synonamous)

#### Link your Netlify project

You should connect your project to a Netlify site in order to use the DevOps features of Netlify. If your project is brand new you will need a create a new Netlify "Site" (less common) to link. If you are pulling down an exisitng project that already has a Netlify "Site" (more common) you need a piece of the Netlify Site information. All the pertinent information in listed on a Netlify > Site Details > Site Information.

```bash
npm run netlify:link
```

#### Development Server: Start serverless functions with Netlify for active development

You are required to link Netlify to a Site before doing this step. While running, a browser refresh is required for reloading the serverless functions. This process brings down configured environment variables from the linked Netlify Site.

```bash
npm run start
```

Open [http://localhost:8888](http://localhost:8888) with your browser to see the result.

#### Netlify Build Simulation: Run a Netlify build to simulate the *entire* Netlify build process (less actual file deployment)

This process brings down environment variables from the linked Netlify Site like `npm run start`, but also builds the project with Netlify build plugins similar to watch you see building directly on the Netlify infrastrucutre. The log output is also very similar as in the Netlify Log GUI.

```bash
npm run build:dev
```

## 3. Tests and Linting

### ESLint

ESLint statically analyzes your code to quickly find problems. ESLint is built into most text editors and you can run ESLint as part of your continuous integration pipeline. We use a popular starting [ESLint config provided by AirBnB](https://github.com/airbnb/javascript). you can add custom rules in the .eslintrc.js file in the project root.

**To perform ESLint on all Javascript files in the project run the following command:**

```bash
npm run lint
```

_Beware of local/cache directories created that should not be linted. You can exclude them in the .eslintrc.js file. Otherwise, you linting may take many minutues._

### 4. Jest

>[Jest](https://jestjs.io/) is a delightful JavaScript Testing Framework with a focus on simplicity. It works with projects using: Babel, TypeScript, Node, React, Angular, Vue and more!

Jest tests and mock data can be included in the directory alongside the service it is for. Example: \<service name\>.test.js, \<service name\>.mock.js

**To run all tests:**

```bash
npm run test
```

**To run in a multifunctional mode that allows you to dyanmically watch and run the test code:**

```bash
npm run test:watch
```

## 5. JavScript Notes and information

### const versus import

When including libraries for **serveless** function outside of the Next.js framework, you will need to use the following format:

```JavaScript
const _ = require('lodash');

exports.handler = async (event, context) => {
  try {
    const subject = event.queryStringParameters.name || 'World';
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}. ${_.upperCase('Are you having a nice day?')}` })
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
```

... rather than the **ES6** format:

```JavaScript
import { upperCase } from 'lodash';

export async function handler(event, context) {
  try {
    const subject = event.queryStringParameters.name || 'World';
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}. ${upperCase('Are you having a nice day?')}` })
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
```

## 6. The Serverless Functions

Custom serverless functions: Plain vanilla serverless fucntion source can be kept in the `/serverless` directory by default. The `netlify.toml` configuration file is set to deploy these fuctions on the Netlify platform from this directory. The directorty path is configurable both in the `netlify.toml` and in the Netlify GUI.

## 7. Redirects, Rewrites, Proxying and Headers

Redirects, Rewrites, Proxying and Headers can be confgured directly in the netlify.toml, \_redirects and \_headers configuration files. The netlify.tomml file is referenced last in the priority of rules. The \_headers and \_redirects files need to be present the Publish directory. The headers and redirects do not seem to operate consistenly with netlify dev, which is still in Beta.

Information about the use of the \_redirects and \_headers configuration files:

- [\_redirects Redirect Options](https://docs.netlify.com/routing/redirects/redirect-options/)
- [\_redirects Rewrite and Proxying Options](https://docs.netlify.com/routing/redirects/rewrites-proxies/)
- [\_headers Options](https://docs.netlify.com/routing/headers/)

Information about configuring these items in the netlify.toml configuration file:

- [netlify.toml Redirects](https://docs.netlify.com/configure-builds/file-based-configuration/#redirects)
- [netlify.toml Headers](https://docs.netlify.com/configure-builds/file-based-configuration/#headers)
