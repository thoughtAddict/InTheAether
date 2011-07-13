var express  = require('express');
var app      = express.createServer();
var nowjs    = require("now");
var everyone = nowjs.initialize(app);
var _        = require('underscore')._;
var Backbone = require('backbone');
var models   = require('./models/models');
var mongoose = require('mongoose');

// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Routes
app.get('/', function(req, res){
    res.render('home', {locals: {
        title: 'In The Aether'
    }});
});

app.get('/css/*.(js|css)', function(req, res){
    res.sendfile('./'+req.url);
});

app.get('/lib/*.(js)', function(req, res){
    res.sendfile('./'+req.url);
});

app.get('/images/*.(jpg|gif|png)', function(req, res){
    res.sendfile('./'+req.url);
});

app.get('/League/Of/Somewhat/ExtraOrdinary/Men', function(req, res){
    res.render('index', {locals: {
        title: 'League of Somewhat Extraordinary Men'
    }});
});

app.get('/JonsHouse', function(req, res){ res.redirect('/League/Of/Somewhat/ExtraOrdinary/Men'); });
app.get('/JustinsHouse', function(req, res){ res.redirect('/League/Of/Somewhat/ExtraOrdinary/Men'); });
app.get('/MikesHouse', function(req, res){ res.redirect('/League/Of/Somewhat/ExtraOrdinary/Men'); });
app.get('/RichardsHouse', function(req, res){ res.redirect('/League/Of/Somewhat/ExtraOrdinary/Men'); });
app.get('/RobsHouse', function(req, res){ res.redirect('/League/Of/Somewhat/ExtraOrdinary/Men'); });
app.get('/SeansHouse', function(req, res){ res.redirect('/League/Of/Somewhat/ExtraOrdinary/Men'); });
app.get('/StevesHouse', function(req, res){ res.redirect('/League/Of/Somewhat/ExtraOrdinary/Men'); });


// Mongo DB
mongoose.connect('mongodb://localhost/loeg');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
    name		: { type: String }
  , date		: { type: String } 
  , message		: { type: String }
});


mongoose.model('Message', MessageSchema)

var Message = mongoose.model('Message');




var transportModel = new models.TransportModel();
//everyone.now.transportModel = transportModel;
//everyone.now.transportModel = new models.TransportModel();



everyone.connected(function(){
    var theDate = new Date();
    console.log("Joined: " + this.user.clientId + " (" + theDate + ")");
    
    Message.find({}, function(err, docs){
		everyone.now.populateLastConversation(docs);
    });
});

everyone.disconnected(function(){
    var theDate = new Date();
    console.log("Left: " + this.now.name + " (" + theDate + ")");
    
    //everyone.now.memberLogoff(this.now.name);
});

everyone.now.distributeMessage = function(theMessage){

    var theDate = new Date();
    everyone.now.receiveMessage(this.now.name, util.timeString(theDate), theMessage);
        
    var newMessage = new Message();
    newMessage.name = this.now.name;
    newMessage.date = util.timeString(theDate);
    newMessage.message = theMessage;
    newMessage.save(function (err) {
		if (err) {
			console.log('Error : ' + err.message);
		}
	});    
};

everyone.now.memberLogin = function(memberName){

	var theDate = new Date();
    console.log("Joined: " + this.user.clientId + " (" + memberName + ")");
    
    ////var memberModel = new models.MemberModel({clientId: this.user.clientId, clientName: memberName});
    ////transportModel.memberList.add(memberModel); 
    //everyone.now.transportModel.memberList.add(memberModel);
    
    //console.log("# present: " + transportModel.memberList.size());
    //console.log("# PRESENT: " + everyone.now.transportModel.memberList.size());
    
    var newMessage = new Message();
    newMessage.name = memberName;
    newMessage.date = util.timeString(theDate);
    newMessage.message = "JOIN";
    newMessage.save(function (err) {
		if (err) {
			console.log('Error : ' + err.message);
		}
	});     
        
    everyone.now.updateMemberList(memberName, "JOIN");
    
};

everyone.now.memberLogoff = function(memberName){ 

    everyone.now.updateMemberList(memberName, "LEFT");
}








app.listen(80);
console.log("Express server listening on port %d", app.address().port);


// General functions

util = {

    zeroPad: function (digits, n) {
        n = n.toString();
        while (n.length < digits)
          n = '0' + n;
        return n;
    },

    timeString: function (date) {
        var minutes = date.getMinutes().toString();
        var hours = date.getHours().toString();
        return this.zeroPad(2, hours) + ":" + this.zeroPad(2, minutes);
    }

}
