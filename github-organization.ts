import rp = require('request-promise');
import { GitHubApi } from './github-api';

const GitHubAPIBaseURI = 'https://api.github.com/';

interface ILicense {
    body: string;
}

interface IRepository {
    name: string;
    license: any;
    private: boolean;
}

export class GitHubOrganization {

    private _accessToken: string;

    public Name: string;

    /**
     * Constructor for the GitHubOrganization class.
     * @param name The name of the GitHub organization.
     * @param token An access token to authenticate requests to the GitHub API.
     */
    constructor(name: string, token: string) {

        if (!name)
            throw "The organization name is required!";

        if (!token)
            throw "The authorization token is required!";

        this.Name = name;
        this._accessToken = token;
    }

    /**
     * This method checks each repository in the organization to make sure each one has a LICENSE.
     * A PULL request is created automatically for each repository that is missing a LICENSE.
     */
    public CreateLicensePullRequests(): void {

        console.log(`${this.Name}: Getting the list of repositories in the organization.`);

        GitHubApi.GetRepositories(this.Name, this._accessToken)
            .then((repos: IRepository[]) => {

                for (let i = 0; i < repos.length; i++) {
                    let repo = repos[i];
                    console.log(`${repo.name}: Repository is ${repo.private ? 'private' : 'public'}`);
                    if (repo.license)
                        console.log(`${repo.name}: Repository already has a license.`);
                    else {
                        console.log(`${repo.name}: Repository does not yet have a license. It will be added.`);
                        this.createBranch(repo.name);
                    }
                }
            })
            .catch(function (err) {
                console.log(`${this.Name}: There was an error getting the list of repositories for the indicated organization. ${err}`);
            });
    }

    /**
     * This method creates a LICENSE file in the specific repository and branch.
     * The branch will later be used when creating a PULL request for the LICENSE.
     * @param repoName The name of a repository in which to create the LICENSE.
     * @param branchName The name of the branch in which to create the LICENSE.
     */
    private createLicenseFile(repoName: string, branchName: string) {

        GitHubApi.GetLicense(this._accessToken)
            .then((license: ILicense) => {

                let licenseText = license.body
                    .replace('[year]', `${new Date().getFullYear()}`)
                    .replace('[fullname]', this.Name);

                GitHubApi.DoPut(`repos/${this.Name}/${repoName}/contents/LICENSE`, {
                    "branch": branchName,
                    "message": "Adding the MIT license to this repository since it did not have a license yet.",
                    "content": Buffer.from(licenseText).toString('base64') // Copyright (c) [year] [fullname]
                }, this._accessToken).then(data => {
                    console.log(`${repoName}: Created the license file`);
                    this.createPullRequest(repoName, branchName);
                }).catch(err => {
                    console.log(`${repoName}: Error creating the license file`);
                });

            }).catch(err => {
                console.log(`${repoName}: There was an error getting the MIT license information.`);
            });
    }

    /**
     * This method creates a branch in the specific repository, which will later be used in a PULL request.
     * @param repoName The name of a repository in which to create the branch.
     */
    private createBranch(repoName: string) {

        GitHubApi.DoGet(`repos/${this.Name}/${repoName}/git/refs/heads`, this._accessToken).then((data: any[]) => {

            if (data.length > 0) {
                let d1 = data[0];
                let sha = d1.object ? d1.object.sha : null;
                if (sha) {
                    // Automatically generate the name of the branch using the current time.
                    let branchName = `license-branch-${Date.now()}`;

                    GitHubApi.DoPost(`repos/${this.Name}/${repoName}/git/refs`, {
                        "ref": `refs/heads/${branchName}`,
                        "sha": sha
                    }, this._accessToken).then(data => {
                        console.log(`${repoName}: Created branch successfully!`);
                        this.createLicenseFile(repoName, branchName);

                    }).catch(err => {
                        console.log(`${repoName}: Error creating the branch. ${err}`);
                    });
                }
            }
        }).catch(err => {
            console.log(`${repoName}: error getting head info about the repository. ${err}`);
        });
    }

    /**
     * This method creates a PULL request for the specified branch and repository.
     * @param repoName The name of a repository in which to create the PULL request.
     * @param branchName The name of the branch in which to create the PULL request.
     */
    private createPullRequest(repoName: string, branchName: string) {
        GitHubApi.DoPost(`repos/${this.Name}/${repoName}/pulls`, {
            title: 'Suggesting the MIT License for this repository',
            body: 'This repository really should have a license. Please pull this in.',
            head: branchName,
            base: 'master',
        }, this._accessToken).then(data => {
            console.log(`${repoName}: Successfully created the PULL request!`);
        }).catch(err => {
            console.log(`${repoName}: Error creating the PULL request. ${err}`);
        });
    }

}

