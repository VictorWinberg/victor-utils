import "dotenv/config";

export default {
  bitbucket: {
    baseUrl: "https://api.bitbucket.org/2.0",
    workspace: process.env.BITBUCKET_WORKSPACE || "",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${process.env.BITBUCKET_APP_SECRET}`,
    },
    user: process.env.BITBUCKET_USER,
    author: "Victor Winberg",
  },
  screenshots: {
    subscriptions: {
      baseUrl: process.env.SCREENSHOTS_SUBSCRIPTIONS_BASE_URL || "",
      manageToken: process.env.SCREENSHOTS_SUBSCRIPTIONS_MANAGE_TOKEN || "",
    },
  },
  deployStuff: {
    repo: process.env.BITBUCKET_DEPLOY_REPO || "",
    valuesFolder: process.env.BITBUCKET_DEPLOY_VALUES_FOLDER || "",
  },
};
