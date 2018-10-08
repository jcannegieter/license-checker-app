import rp = require('request-promise');

const GitHubAPIBaseURI = 'https://api.github.com/';

/**
 * This class is a way of abstracting some of the logic for calling the GitHub API.
 */
export class GitHubApi {

    /**
     * This method gets the list of repositories in a GitHub organization.
     * @param orgName The name of the GitHub organization.
     * @param token An access token used to gain access to the list of repositories.
     */
    public static GetRepositories(orgName: string, token: string): rp.RequestPromise {
        return GitHubApi.DoGet(`orgs/${orgName}/repos`, token);
    }

    /**
     * This method returns the MIT license template, which is used when adding a license to a repository.
     * @param token An access token to authenticate the request with GitHub.
     */
    public static GetLicense(token: string): rp.RequestPromise {
        return GitHubApi.DoGet('licenses/mit', token);
    }

    /**
     * This method performs a GitHub API GET request.
     * @param uri The portion of the API url after the base.
     * @param token An access token to authenticate the request with GitHub.
     */
    public static DoGet(uri: string, token: string): rp.RequestPromise {
        return rp({
            uri: `${GitHubAPIBaseURI}${uri}`,
            qs: { "access_token": token },
            json: true,
            headers: { 'User-Agent': 'Request-Promise' }
        });
    }

    /**
     * This method performs a GitHub API PUT request.
     * @param uri The portion of the API url after the base.
     * @param body An object containing items to include in the body of the request.
     * @param token An access token to authenticate the request with GitHub.
     */
    public static DoPut(uri: string, body: any, token: string): rp.RequestPromise {
        return rp({
            uri: `${GitHubAPIBaseURI}${uri}`,
            body: body,
            qs: { "access_token": token },
            json: true,
            method: 'PUT',
            headers: { 'User-Agent': 'Request-Promise' }
        });
    }

    /**
     * This method performs a GitHub API POST request.
     * @param uri The portion of the API url after the base.
     * @param body An object containing items to include in the body of the request.
     * @param token An access token to authenticate the request with GitHub.
     */
    public static DoPost(uri: string, body: any, token: string): rp.RequestPromise {
        return rp({
            uri: `${GitHubAPIBaseURI}${uri}`,
            body: body,
            qs: { "access_token": token },
            json: true,
            method: 'POST',
            headers: { 'User-Agent': 'Request-Promise' }
        })
    }
}