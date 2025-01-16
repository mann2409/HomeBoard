import Amplify from 'aws-amplify';

Amplify.configure({
    Auth: {
        region: 'us-east-1', // Replace with your region
        userPoolId: 'us-east-1_GvD7zqW0B', // Replace with your User Pool ID
        userPoolWebClientId: '35uv6egveqkdlf04tgjjht3ipo', // Replace with your App Client ID
        oauth: {
            domain: 'https://us-east-1gvd7zqw0b.auth.us-east-1.amazoncognito.com', // Replace with your Cognito domain
            scope: ['email', 'openid', 'profile'],
            redirectSignIn: 'exp://192.168.0.53:8081', // Replace with your local Expo redirect URL
            redirectSignOut: 'exp://192.168.0.53:8081',
            responseType: 'code', // Or 'token' for Implicit Grant
        },
    },
});
