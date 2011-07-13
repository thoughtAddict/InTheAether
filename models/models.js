(function () {

    var server = false;
    var models;
    
    if (typeof exports !== 'undefined') {
    
        _ = require('underscore')._;
        Backbone = require('backbone');
        models = exports;
        server = true;
        
    } else {
        models = this.models = {};
    }

    //
    // Models
    //
    
    models.TransportModel = Backbone.Model.extend({
        initialize: function() { 
            this.memberList = new models.MemberCollection();
        }        
    });    
    
    models.MemberModel = Backbone.Model.extend({
        defaults: {
            "clientId": "",
            "clientName": "",
            "status": ""
        }
    });

    
    //
    //Collections
    //   
    
    models.MemberCollection = Backbone.Collection.extend({
        model: models.MemberModel
    });     
    
    

})()
