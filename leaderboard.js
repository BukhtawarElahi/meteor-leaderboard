PlayersList=new Meteor.Collection('players');
if(Meteor.isClient){
  Meteor.subscribe('thePlayers');
 /* Template.leaderboard.player=function(){
    return PlayersList.find();
  }*/

  Template.leaderboard.helpers({

    'player':function(){
      var currentUserId=Meteor.userId();
        return PlayersList.find({},{sort:{score:-1,name:1}});
    },

    'count':function(){
      return PlayersList.find().count();
    },
    'selectedClass':function(){
      var playerId=this._id;
      var selectedPlayer=Session.get('selectedPlayer');
      if(selectedPlayer==playerId){
        return 'selected';
      }
    },
    'showSelectedPlayer':function(){
      var selectedPlayerId=Session.get('selectedPlayer');
      return PlayersList.findOne(selectedPlayerId);

    }

  });

  Template.leaderboard.events({
    'click li.player': function(){
      var playerId=this._id;
        Session.set('selectedPlayer',playerId);
        var selectedPlayer=Session.get('selectedPlayer');
        console.log(selectedPlayer);
    },
    'click #increment': function(){
        var selectedPlayerId=Session.get('selectedPlayer');
        Meteor.call('modifyPlayerScore',selectedPlayerId,5);
        },

    'click #decrement':function(){
      var selectedPlayerId=Session.get('selectedPlayer');
      Meteor.call('modifyPlayerScore',selectedPlayerId,-5);
          },

    'click #removePlayer':function(){
        var playerId=Session.get('selectedPlayer');
        //PlayersList.remove({_id:selectedPlayerId});
        Meteor.call('removePlayer', playerId);
    }
   
  });

  Template.addPlayerForm.events({
    /*'submit form':function(event,template){
    var playerName=template.find('#playerName').value;
    */
     'submit form':function(event){
      //var name='#playerName'.value;
      event.preventDefault();
      var playerName=event.target.playerName.value;
      console.log(playerName);
      Meteor.call('insertPlayerData',playerName);
    }
  });

}

if (Meteor.isServer){
  Meteor.publish('thePlayers',function(){
    var currentUserId=this.userId;
    return PlayersList.find({createdBy: currentUserId})
    //return PlayersList.find();
  });

  Meteor.methods({
    'insertPlayerData':function(playerName){
      var currentUserId=this.userId;
      //var playerName=template.find('#playerName').value;
      PlayersList.insert({
          name:playerName,
          score:0,
          createdBy:currentUserId
      });
    },
    'removePlayer':function(playerId){
      var currentUserId=this.userId;
      PlayersList.remove(playerId);
    },
    'modifyPlayerScore':function(selectedPlayerId,scoreValue){
        PlayersList.update({_id: selectedPlayerId},{$inc:{score:scoreValue}});
    }


  });
}