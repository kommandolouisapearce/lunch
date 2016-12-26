module.exports = function (token, url) {
	return function (req, res, next) {
		if(req.body.token == token) {
		        console.log("it is okay");
		        var mongodb = require('mongodb');
		        var MongoClient = mongodb.MongoClient;
		        var userName = req.body.user_name;
		        var text = req.body.text;
		        var db = req.db;
		        var message = "";
		        var textlist = text.split(' ');
		        switch(textlist[0]) {
		                case "list":
		                        MongoClient.connect(url, function (err, db) {
		                                var collection = db.collection('lunchlist');
		                                collection.find({}).toArray(function (err, result) {
				                        if (err) {
				                                console.log(err);
				                        } else if (result.length) {
				                                console.log(result);
				                                var items = [];
				                                result.forEach(function (item) {
				                                	items.push(item.name);
				                        	});
				                        	message = JSON.stringify(items);
				                       		var botPayload = {
				                         	       "response_type": "in_channel",
				                                	text : message
				                        	};
				                       		if (userName !== 'slackbot') { // avoid infinite loop
				                                	return res.status(200).json(botPayload);
				                        	} else {
				                               		return res.status(200).end();
				                       		}
				                        } else {
				                                console.log('No document(s) found with defined "find" criteria!');
				                        }
				                        db.close();
		                                });
		                        });'
		                        break;
		                case "add":
		                        MongoClient.connect(url, function (err, db) {
		                            	var collection = db.collection('lunchlist');
					    	var input = "";
					    	textlist.shift()			        
		                            	if(textlist.length > 1) {
					    		input = textlist.join(' ');
					   	}
					    	else {
							input = textlist[0];
					    	}
					    	var user1 = {name: input};
					    	collection.update({name: input},user1, {upsert: true}, function (err, result) {
		                              		if (err) {
		                                		console.log(err);
		                              		} else {
		                                		message = JSON.stringify("Added " + input + " to database");
		                                		var botPayload = {
		                                        		"response_type": "in_channel",
		                                       		 	text : message
		                                		};
				                        	if (userName !== 'slackbot') { // avoid infinite loop
				                                	return res.status(200).json(botPayload);
				                        	} else {
				                                	return res.status(200).end();
				                        	}
		                              		}
		                              		db.close();
		                            	});
		                        });
		                        break;
		                case "remove":
					MongoClient.connect(url, function (err, db) {
		                        	console.log("removing");
		                        	var collection = db.collection('lunchlist');
		                            	var input = "";
		                           	 textlist.shift()
		                            	if(textlist.length > 1) {
		                                	input = textlist.join(' ');
		                           	}
		                            	else {
		                                	input = textlist[0];
		                            	}

		                            	collection.remove({name: input}, function (err, result) {
		                              		if (err) {
		                               			 console.log(err);
		                              		} else {
		                                		message = JSON.stringify("Removed " + input + " from database");
		                               			var botPayload = {
		                                       			"response_type": "in_channel",
		                                        		text : message
		                                		};
		                                		if (userName !== 'slackbot') { // avoid infinite loop
		                                        		return res.status(200).json(botPayload);
		                                		} else {
		                                        		return res.status(200).end();
		                                		}

		                              		}
		                              		db.close();
		                            	});
		                        });
		                        break;

				case "random":
        				MongoClient.connect(url, function (err, db) {
               					var collection = db.collection('lunchlist');
                				collection.find({}).toArray(function (err, result) {
               						if (err) {
                        					console.log(err);
                					} else if (result.length) {
                        					console.log(result);
								message = result[Math.floor(Math.random() * (result.length - 0) + 0)].name;
                						var botPayload = {
                       							"response_type": "in_channel",
                        						text : message
                						};
                						if (userName !== 'slackbot') { // avoid infinite loop
                        						return res.status(200).json(botPayload);
                						} else {
                        						return res.status(200).end();
                						}
                					} else {
                        					console.log('No document(s) found with defined "find" criteria!');
                					}
               						 db.close();
                				});
        				});
		                        break;					
		                default:
		                        message = "error";
		        }
		}
		else {
		        console.log("no no no");
		}
	}
}
