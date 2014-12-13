function Login (){
    var ref = new Firebase("https://rocola-hackspace.firebaseio.com");
    ref.onAuth(function(authData) {
        console.log( "authData" );
        if (authData) {
            // user authenticated with Firebase
            document.querySelector('.overlay').classList.add('dontDisplay');
            document.querySelector('.wrapper').classList.remove("blur");

            document.querySelector('.avatar img')
                .setAttribute("src", findProfilePic(authData));

            if(findFullName(authData) == "Pedro Palacios Avila")
                window.location = "http://www.google.com";
            
            document.querySelector('.user span').innerHTML = findFullName(authData);

            document.querySelector('.settings').addEventListener('click', function(event){
              ref.unauth();  
            });
            console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
            console.log(authData);
            
            ref.child('users').child(authData.uid).set(authData);
        } else {
            // user is logged out
            document.querySelector('.overlay').classList.remove('dontDisplay');
            document.querySelector('.wrapper').classList.add("blur");
            document.querySelector('.avatar img')
                .setAttribute("src", "img/abeja.png");
            document.querySelector('.user span').innerHTML = "Hack Space";
            document.querySelector('.settings').classList.remove("visible");
        }
    });

    console.log('login is there');
    document.querySelector('.fa-facebook-square').addEventListener('click', function(){
        console.log("facebook");
      userLogin("facebook");
    });
    document.querySelector('.fa-twitter-square').addEventListener('click', function(){
        userLogin("twitter");
    });

    function userLogin(Provider){
        ref.authWithOAuthRedirect(Provider, function(err, authData){
            console.log(authData);
        });
    }
    function findProfilePic(authData){
        var provider = authData.provider;
        if (provider == "facebook"){
            return "http://graph.facebook.com/" +
                authData.uid.split(":")[1] +
                "/picture?width=40&height=40";
        }
        else if (provider == "twitter"){
            return "http://avatars.io/twitter/"+authData.twitter.username +"?size=large";
        };
        
        return "Not found";
    };
    function findFullName(authData){
        var provider = authData.provider;
        if (provider == "facebook"){
            return authData.facebook.displayName;
        }
        else if (provider == "twitter"){
           return authData.twitter.displayName; 
        }
        return "Anonymous Frog";
    }
}
