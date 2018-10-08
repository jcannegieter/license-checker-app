# Readme

The purpose of this application is to inspect each repository (public and private) of a GitHub organization and check to see if it has a license. If a repository is found without a license, the application automatically creates a pull request to add a license.

## Assumptions:

* The user running this application has sufficient permissions to view public and private repositories for the specified GitHub organization.
* The user has created a personal access token at https://github.com/settings/tokens, which will be used when starting the application.
* The repository has been cloned on the local computer.
* All of the required NPM modules have been installed by running npm install.
* The TypeScript files have been built (transpiled to JavaScript). In Visual Studio Code, this could be done using the tsc: build task.
* NodeJS is installed and configured properly on the computer.
* There is not already an existing PULL request for a LICENSE file for a repository. (The code currently does fine when there never was a license or no branches have licenses, but if one has been created already, it won't create another pull request for a LICENSE file.)

## To run the application

1. Open a command prompt and navigate to the "license-checker-app" folder.
2. Run the following command, substituting the two placeholders with actual values of a GitHub organization name and an access token for the user whose account will be used to access the repositories and create the pull request as needed:

    node Startup.js \<OrganizationName\> \<AccessToken\>

3. The application will get the list of repositories for the organization, check to see which ones have licenses, and create PULL requests for any that do not. The output window should show the progress as it performs these actions.
