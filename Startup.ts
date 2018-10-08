import { GitHubOrganization } from './github-organization';

class Startup {
    public static main(): void {

        try {
 
            if (process.argv.length < 4 || process.argv[2] === "--help") {
                this.showHelp();
                return;
            }

            let organizationName = process.argv[2];
            let token = process.argv[3];

            var org = new GitHubOrganization(organizationName, token);
            org.CreateLicensePullRequests();
        } catch (err) {
            console.log(`There was an unhandled exception: ${err}`);
        }
    }

    private static showHelp(): void {
        console.log(`usage: node Startup.js [--help] <organization> <authorization token>`);
    }
}

Startup.main();
