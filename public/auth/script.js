const firebaseConfig = {
    apiKey: "AIzaSyBLLXdSBgd9wjT4JZjr5S20lPBOEzFnR4A",
    authDomain: "fl-mng.firebaseapp.com",
    projectId: "fl-mng",
    storageBucket: "fl-mng.appspot.com",
    messagingSenderId: "695753157916",
    appId: "1:695753157916:web:01d2479327d7902cdcded9"
};

firebase.initializeApp(firebaseConfig);

var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
    callbacks: {
        signInSuccessWithAuthResult: async function (authResult, redirectUrl) {
            console.log(authResult, redirectUrl);
            return authResult.user.getIdTokenResult().then(async user => {
                await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    redirect: 'follow',
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify({
                        idToken: user.token
                    })
                }).then((response) => {
                    return response.json();
                }).then(data => {
                    console.log(data);
                    if (data.error) {
                        alert(data.error);
                        console.log(data.error);
                    } else {
                        console.log('redirecting...');
                        window.location.replace(window.location.search);
                    }
                });
                return user;
            });
        }
    },
    signInFlow: 'popup',
    signInOptions: [
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            customParameters: {
                prompt: 'select_account'
            }
        }
    ]
});