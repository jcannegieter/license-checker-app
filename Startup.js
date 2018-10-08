"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const github_organization_1 = require("./github-organization");
class Startup {
    static main() {
        try {
            if (process.argv.length < 4 || process.argv[2] === "--help") {
                this.showHelp();
                return;
            }
            let organizationName = process.argv[2];
            let token = process.argv[3];
            var org = new github_organization_1.GitHubOrganization(organizationName, token);
            org.CreateLicensePullRequests();
        }
        catch (err) {
            console.log(`There was an unhandled exception: ${err}`);
        }
    }
    static showHelp() {
        console.log(`usage: node Startup.js [--help] <organization> <authorization token>`);
    }
}
Startup.main();
//# sourceMappingURL=Startup.js.map