import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Feeds = new Mongo.Collection('feeds');

Meteor.startup(() => {
  // if(Feeds.find().count()==0)
  // {
  //   Feeds.insert({
  //     topic:"What should we do next?",
  //     createdOn: new Date(),
  //   });
  //   Feeds.insert({
  //     topic:"Where are you?",
  //     createdOn: new Date()
  //   });
  // }

});

Meteor.publish('feeds', function() {
  return Feeds.find();
});

Meteor.publish('users', function(){
  return Meteor.users.find();
});
