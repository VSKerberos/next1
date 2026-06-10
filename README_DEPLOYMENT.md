Azure Static Web Apps deployment

Steps to publish this Next.js project to Azure Static Web Apps (SWA):

1) Decide build mode
   - If your app is fully static (uses only SSG / no getServerSideProps or server-only APIs), you can use `next build` to generate a static 'out' folder.
     - Run locally: npm ci && npm run build
     - This produces an 'out' folder you can serve as static site.
   - If you rely on SSR or server-side APIs, Azure Static Web Apps static hosting may not be suitable; consider Azure App Service instead.

2) Create Azure Static Web App
   - In the Azure Portal, create a new Static Web App.
   - During creation you can connect your GitHub repository and choose the branch (master).
   - If you use the portal GitHub integration, Azure will create the necessary workflow and secrets automatically.

3) Or create a deployment token instead (manual secret)
   - Create the Static Web App in Azure without linking GitHub, then go to Deployment Tokens and create a token.
   - In your GitHub repo, go to Settings > Secrets > Actions and create a secret named AZURE_STATIC_WEB_APPS_API_TOKEN with that token value.

4) Workflow
   - This repo contains a workflow at .github/workflows/azure-static-web-apps.yml that runs on push to master.
   - The workflow will: npm ci && npm run build and then call the Azure/static-web-apps-deploy action.
   - By default it expects AZURE_STATIC_WEB_APPS_API_TOKEN to be set as a secret. If you used Azure's portal connection, the secret may already be created for you.

5) Output location notes
   - If you use `npm run export`, change the workflow output_location to 'out'.
   - If you rely on Next-specific static hosting features, the default workflow uses output_location: '.next'. Adjust if you encounter missing assets in deployment.

6) Run locally to validate
   - npm ci
   - npm run build
   - npm run start (to test production server) or npm run export and serve the 'out' folder

If you want, I can: create the Azure Static Web App resource using Azure CLI commands, or adjust the workflow to use 'out' as artifact if you prefer next export. Tell me which and I will proceed.
