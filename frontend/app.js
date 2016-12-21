$(document).ready(function() {
  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    auth: {
      redirectUrl: AUTH0_CALLBACK_URL,
      responseType: 'token',
      params: { scope: 'openid email' } //Details: https://auth0.com/docs/scopes

    }
  });

  $('.btn-login').click(function(e) {
    e.preventDefault();
    lock.show();
  });

  $('.btn-logout').click(function(e) {
    e.preventDefault();
    logout();
  })

  lock.on("authenticated", function(authResult) {
    alert('called');
    //set token in localStorage after authenticated,
    localStorage.setItem('id_token', authResult.idToken);

    lock.getProfile(authResult.idToken, function(error, profile) {

      if (error) {
        // Handle error
        console.error(error);
        return;
      }
      console.log('profile: ', profile);

      //checkPrefs(profile)
      console.log('authResult.idToken', authResult.idToken);


      retrieve_profile();
      console.log(retrieve_profile());
      // Display user information
      // show_profile_info(profile);
      //check p
      checkPreference(profile);
    });
  });

function loadQuiz(){
  console.log('loadQuiz');
  $('#result').load('/questions.html #main');
};

//Show dogs
var checkPreference = function( profile ){
    //access database with get request to backend (ajax) using jwt to veryify good connection
    var idToken = localStorage.getItem('id_token');
    console.log('new token: ', idToken);

    var request = $.ajax({

      url: 'http://localhost:3000/checkprefs', //we wouldn't want to hardcode this
      method: 'POST',

      //need to send authorization header
      headers: {
        'Authorization': 'Bearer ' + idToken
      },
      //equivalent to req.body
      data: {
        userid: profile.user_id
      }
    });

    request.done(function(results){
      console.log('results: ',results);
      if (results) {
        //if we have a profile
      }
      else {
        loadQuiz();
        //if we don't have a profile redirect to questionnaire

        // alert("We don't have your profile! Take our quick quiz to set your preferences!");
        // var questionnaire = [
        //   "<section class='create-account'><h1>Create Account</h1> </br><p>Let's start off with the basics</p></br></br><h2>Your Living Situation</h2></br><p>Some shelters have restrictions based on age and residence type. We want to ensure thematches we show are available for you.<br>We also need to know if you have restrictions on pet types, allergies, and what kind of pet you’re looking for.</p>",
        //   "  <br>We also need to know if you have restrictions on pet types, allergies, and what kind of pet you’re looking for.</p></br></br>",
        //   "<div class='container'><div class='boxes'><div class='col-xs-8 col-xl-4'><p2>Any allergies?</p><br><label><input type='checkbox' name='restrictions'>Allergic to dogs</label></div><div class='col-xs-8 col-xl-4'><label><input type='checkbox' name='restrictions'>Allergic to cats</label></div></div>",
        //   "<div class='boxes'><div class='col-xs-8 col-xl-4'><p2>Who lives with you?</p><br><label><input type='checkbox' name='restrictions'>I have children</label></div><div class='col-xs-8 col-xl-4'><label><input type='checkbox' name='restrictions'>I have a dog</label></div><div class='col-xs-8 col-xl-4'><label><input type='checkbox' name='restrictions'>I have a cat</label></div></div>",
        //   "<div class='boxes'><div class='col-xs-12'></br><p2>Residence Type?</p><br><div class='col-xs-4'><label><input type='radio' name='residence'>House</label></div><div class='col-xs-4'><label><input type='radio' name='residence'>Apartment (no weight restriction)</label></div><div class='col-xs-4'><label><input type='radio' name='residence'>Apartment (weight restriction)</label></div></div></div></section>",
        //
        //   "<section class='create-account'><h1>Your Activity</h1></br><p>Tell us how you like to spend your time (select all that apply)</p></br><p>I like to...</p></br>",
        //   "<div class='container'><div class='boxes'><div class='col-xs-8 col-xl-4'><label><input type='checkbox' name='activity'>Sleep all the time</label></div><div class='col-xs-8 col-xl-4'><label><input type='checkbox' name='activity'>Snuggle on the couch</label></div><div class='col-xs-8 col-xl-4'><label><input type='checkbox' name='activity'>Play outside 24/7</label></div><div class='col-xs-8 col-xl-4'><label><input type='checkbox' name='activity'>Go running/jogging/swimming</label></div><div class='col-xs-8 col-xl-4'><label><input type='checkbox' name='activity'>I have a cat</label></div></div></div>",
        //   "<div class='pet'><div class='col-xs-8 col-xl-4'><p3>I am looking for a (select all that apply)</p></br><label><input type='checkbox' name='restrictions'>Dog</label></div><div class='col-xs-8 col-xl-4'><label><input type='checkbox' name='restrictions'>Cat</label></div></div></section>",
        //   "<section class='buttons'><div class='container'><div class='row'><div class='col-xs-6 col-xl-4'><a href='question_one.html' class='sign_up btn btn-primary btn-lg active' role='button' aria-pressed='true'>Back</a></div><div class='col-xs-6 col-xl-4'><a href='question_two.html' class='sign_up btn btn-primary btn-lg active' role='button' aria-pressed='true'>See Results</a></div></div></div></section>"
        // ]
        // $('#container').append(questionnaire);

      }
      // for (var i = 0, x = results.length; i<x; i++){
      //   $('.main_ul').append('<li>' + results[i].size + '</li>');
      // }
    });
  };


  //retrieve the profile:
  var retrieve_profile = function() {
    var id_token = localStorage.getItem('id_token');
    console.log('id_token is: ', id_token);
    if (id_token) {
      console.log('we have it');
      lock.getProfile(id_token, function (err, profile) {
        if (err) {
          return alert('There was an error getting the profile: ' + err.message);
        }
        // Display user information
        show_profile_info(profile);
      });
    }
  };

  var show_profile_info = function(profile) {
    console.log('In the profile!');
    //  $('.nickname').text(profile.nickname);
     $('.btn-login').hide();
    //  $('.avatar').attr('src', profile.picture).show();
     $('.btn-logout').show();
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    window.location.href = "/";
  };

  retrieve_profile();
});
