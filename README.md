# Gmail API
The API contains auth and gmail router endpoints:
1. auth:
- POST: To accept credentials json in the request body and store it in a local file
- GET: To extract code from the redirected url in order to generate a token file
2. gmail:
- POST: To send an email using OAuth2-client

# Start API 
- Navigate to root folder and run 'npm install'
- Navigate to ./config/default.json and ./config/dev.json and update configurations as needed
- Set toEmailId and fromEmailId in the configurations
- Run 'npm start'

# Execution Steps
- Go to https://developers.google.com/gmail/api/quickstart/nodejs and turn on the Gmail API
- Configure your OAuth client for Web browser and add the origin URI as http://localhost:1000
- Download the client configurations json and replace 'web' key with 'installed'
- Go to postman, use http://localhost:1000 as a POST url with client configurations json as request json body and execute [ NOTE: You can change the port number to any number but you will need to configure the same in the config file ]
- The endpoint should respond with 200 status and 'Credentials stored successfully!' message
- It should also redirect to the auth url and allow you to select the gmail account
- On selecting the account, the browser should display 'Token extracted successfully!' message
- Use http://localhost:1000/sendmail as a POST url and execute
- The endpoint should respond with 200 status and 'Email sent successfully!' message
