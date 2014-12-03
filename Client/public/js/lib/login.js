function Login (){
    var ref = new Firebase("https://rocola-hackspace.firebaseio.com");
    ref.onAuth(function(authData) {
        if (authData) {
            // user authenticated with Firebase
            document.getElementsByClassName('overlay-login')[0].classList.add('dontDisplay');
            document.getElementsByClassName('wrapper')[0].classList.remove("blur");
            document.getElementById('profile-pic')
                .setAttribute("src", findProfilePic(authData));
            console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
            console.log(authData);
        } else {
            // user is logged out
            document.getElementsByClassName('overlay-login')[0].classList.remove('dontDisplay');
            document.getElementsByClassName('wrapper')[0].classList.add("blur");
            document.getElementById('profile-pic').setAttribute("src","");
        }
    });

    console.log('login is there');
    document.getElementById('feisbuk').addEventListener('click', function(){
      userLogin("facebook");
    });
    document.getElementById('tuitah').addEventListener('click', function(){
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
}
