/**
 * This is the main entry point to your Probot app
 * @param {import('probot').Probot} app
 */
export default (app) => {
  app.log.info("Probot app has been loaded!");

  app.on(
    ["pull_request.opened", "pull_request.synchronize"],
    async (context) => {
      const { pull_request, repository } = context.payload;
      const prNumber = pull_request.number;
      const owner = repository.owner.login;
      const repo = repository.name;
      const ref = pull_request.head.ref;

      // Create a deployment
      try {
        const res = await context.octokit.repos.createDeployment({
          owner,
          repo,
          ref,
          task: "deploy",
          auto_merge: true,
          required_contexts: [],
          environment: "production",
          description: `Deploying PR #${prNumber}`,
          transient_environment: true,
          production_environment: false,
        });

        const deploymentId = res.data.id;
        app.log.info(`Created deployment with ID: ${deploymentId} for PR #${prNumber}`);

        // Post a comment to indicate deployment start
        await context.octokit.issues.createComment({
          owner,
          repo,
          issue_number: prNumber,
          body: `Deployment for PR #${prNumber} has started.`,
        });

        // Simulate deployment process (replace this with actual deployment logic)
        const deploymentUrl = `http://localhost/${prNumber}`; // Placeholder URL
        const logUrl = `http://localhost/logs/${prNumber}`;   // Placeholder log URL

        // Update deployment status to success
        await context.octokit.repos.createDeploymentStatus({
          owner,
          repo,
          deployment_id: deploymentId,
          state: "success",
          log_url: logUrl,
          description: "Deployment was successful!",
          environment_url: deploymentUrl,
          auto_inactive: true,
        });

        // Post a comment with the deployment URL and log URL
        await context.octokit.issues.createComment({
          owner,
          repo,
          issue_number: prNumber,
          body: `Deployment successful! View the deployed app at [${deploymentUrl}](${deploymentUrl}) and logs at [${logUrl}](${logUrl}).`,
        });
      } catch (error) {
        app.log.error(error);

        // If deployment fails, post a failure status
        await context.octokit.repos.createDeploymentStatus({
          owner,
          repo,
          deployment_id: deploymentId,
          state: "failure",
          log_url: "",
          description: "Deployment failed.",
        });

        // Post a comment with the error message
        await context.octokit.issues.createComment({
          owner,
          repo,
          issue_number: prNumber,
          body: `Deployment failed: ${error.message}`,
        });
      }
    }
  );
};
