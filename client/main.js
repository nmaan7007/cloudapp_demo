import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import './main.html';

Meteor.subscribe('users',()=>{
  console.log("Users Ok");
})

Meteor.subscribe('feeds',()=>{
  console.log('Feeds imported');
});

Feeds = new Mongo.Collection('feeds');
//EVENTS
Template.registration.events({
  'submit .js-register':function(event){
    event.preventDefault();
    var username = $("[name=user_name]").val();
    var email = $("[name=email_id]").val();
    var password = $("[name=password]").val();
    console.log(password);
    Accounts.createUser({
      username: username,
      email: email,
      password: password
    }, function(error, result) {

      if(error){
        $(".registration_error_field").text(error.reason);
      console.log(error.reason);
    }else {
      $("#sign-up-modal").modal('hide');
      $(".modal-backdrop").remove();
    }
  });
  },
});

Template.login_form_template.events({
  'submit .js-login_form':function(event){
    event.preventDefault();
    var email = $("[name=email_id_login]").val();
    var password = $("[name=password_login]").val();
    Meteor.loginWithPassword(email,password, function(error, result){
      $(".login_error_field").text(error.reason+"*");
    });
  },
  'click .js-show-sign-up': function(event){
    $(".registration_error_field").text('');
    $("#sign-up-modal").modal('show');
    $(".js-register").trigger('reset');

  },
  'click .js-forgot-password':function(event){
    $("#fpswd-modal").modal('show');
  },

});

Template.body.events({
  'click .logout_account':function(event){
    Meteor.logout(()=>{
      console.log("Logged out");
    });
  },
});
Template.forgot_password.events({
  'submit .js-forgot-password':function(event){
    var options ={};
    email = event.target.email_id.value;
    console.log(email);
    Accounts.forgotPassword({email:email},(error,result)=>{
      if(error){
        $("#password-reset-info").text(error.reason);
      }else{
        $("#password-reset-info").text('You will receive a reset link on respective email-id');
        $("#fpswd-modal").modal('hide');
        $(".modal-backdrop").remove();
      }
    });
  }
});

Template.enter_feed.events({
  'submit .js-enter-feed': function(event){
    var feed = event.target.feed_topic.value;
    console.log(feed);
    Feeds.insert({
      createdBy:Meteor.user()._id,
      createdOn:new Date(),
      topic: feed,
    }, ()=>{
      console.log('successfully saved');
    });
  },
});
Template.discussion_board.events({
  'click .js-feed-click':function(event){
    console.log('Clicked feed');
  }
});
//END OF EVENTS

// HELPERS CODE
Template.discussion_board.helpers({
  feeds:function(){
    console.log(Feeds.find({},{sort:{createdOn: -1}}));
    return Feeds.find({},{sort:{createdOn: -1}});
  },
  getUser: function(user_id){
    var user = Meteor.users.findOne({_id:user_id});
    console.log(user);
    if(user){
      return user.emails[0].address;
    }
    else{
      return 'Anonymous';
    }
  },
});

Template.body.helpers({
  current_user:function(){
    if(Meteor.user()){
      return Meteor.user().username;
    }
    else{
      return false;
    }
  },
});
