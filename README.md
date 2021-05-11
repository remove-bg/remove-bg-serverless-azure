# Serverless remove.bg API using Microsoft Azure Functions
| <img src="/readme_images/remove-bg-logo.svg" height="40"> | <img src="/readme_images/azure-functions.svg" height="55"> |
| --- | --- |

## What is it?
If you call the [remove.bg API](https://remove.bg/api) you have to provide your API key for authentication. If you are worried about exposing this API key you can set up your own relay function on Microsoft Azure that injects the API key on the server and forwards all other parameters to the remove.bg API and then returns the result.

* It enhances the security of your front end
* Especially for mobile apps
* Use it as a boilerplate to do all kinds of things that our API can't do

## Supported Cloud Function Providers
| | Provider | URL |
| --- | --- | --- |
| <img src="/readme_images/gcf-logo.svg" height="25"> | Google Cloud Functions | https://github.com/remove-bg/remove-bg-serverless-gcf |
| <img src="/readme_images/azure-functions.svg" height="25"> | Microsoft Azure Functions | https://github.com/remove-bg/remove-bg-serverless-azure |


## Setup your remove.bg relay on Microsoft Azure Functions

For general reference check out the official docs: https://docs.microsoft.com/en-us/azure/developer/javascript/how-to/develop-serverless-apps
1. Create a new function with Runtime stack `Node.js`, 14 LTS, choose your desired region
1. Click Deploy
1. In your function Configuration open `Settings > Configuration`
1. Add a `Runtime environment variable` called `REMOVE_BG_API_KEY` and set it to your remove.bg API key

## Deploy with Visual Studio Code
1. Install the `Azure Functions` plugin and log in within Visual Studio Code (https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
1. Navigate to your functions in the Azure Tab in VSCode
1. Open `Application Settings` and add a new Setting called `REMOVE_BG_API_KEY` using your remove.bg API key as value
1. Click on the `Deploy to Function App...`
1. Select your function in the popup

## Calling the cloud function
1. Note the URL logged in the deploy output after `HTTP Trigger Urls:`
1. Replace remove.bg API endpoint with this URL
1. Remove your API key from the header of your call

## Local debugging
For general reference check out the official docs: https://docs.microsoft.com/en-us/azure/developer/javascript/tutorial/vscode-function-app-http-trigger/tutorial-vscode-serverless-node-test-local
1. Your API key is configured in the `Application Settings` in the `Azure Functions`
1. Launch locally with VSCode Launch config `Launch Azure Function locally`

