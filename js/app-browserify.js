// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone'),
	React = require('react'),
	Parse = require('parse')

console.log('loaded')

window.P = Parse

var APP_ID = 'UG6BEIIX5wt4ZnHsvtylJj7lyoaaOtOvXyHGR2b5',
	JS_KEY = 'YluvUhQUs6ldsfbcDml6CdPUlGuV9diPXRkeksqm',
	REST_API_KEY = 'gpc8Qv7NaG7lGrK5WLUyh7s60qTQO8j3ELZAdPhf'

	Parse.initialize(APP_ID,JS_KEY)

//----------------Model & Collection------------------

var MediumModel = Backbone.Model.extend({
	url: "https://api.parse.com/1/classes/Story",

	parseHeaders: {
		"X-parse-Application-Id": APP_ID,
		"X-Parse-REST-API-Key": REST_API_KEY
	}
})

var MediumCollection = Backbone.Collection.extend({
	url: "https://api.parse.com/1/classes/Story",

	parseHeaders: {
		"X-parse-Application-Id": APP_ID,
		"X-Parse-REST-API-Key": REST_API_KEY
	},

	parse: function(responseData){
		return responseData.results
	}
})


//---------------------VIEWS--------------------------

var LoginView = React.createClass({

	render: function(){
		return (
			<div id = "loginView">
				<Header /> 
				<LoginBox sendInfo={this.props.sendInfo}/>
				<SignupButton />
			</div>
		)
	}
})

var Header = React.createClass({

	render: function(){
		return <h1>The Wicked Professional</h1>
	}
})

var SignUpDialog = React.createClass({
	render: function(){
		return <h4>Share Your Story. Create Your Free Account Below.</h4>
	}
})

var SignupButton = React.createClass({

	_getSignup: function(e){
		location.hash = 'signup'
	},

	render: function(){
		return <button onClick = {this._getSignup}>Don't have a User Name?<br/>Sign Up!</button>
	}
})

var LoginBox = React.createClass({
	_getLogin: function(event){
		if(event.which===13){
			var password = event.target.value,
				username = this.refs.usernameInput.getDOMNode().value
			this.props.sendInfo(username,password)
		}
	},

	render: function(){
		return (
			<div id="loginBox">
				<input type = "text" placeholder = "username" ref = "usernameInput" />
				<input type = "password" placeholder = "password" onKeyPress = {this._getLogin} />
			</div>
		)
	}
})

var SignupView = React.createClass({

	render: function(){
		return (
			<div id = "signUpView">
				<Header />
				<SignUpDialog />
				<SignBox sendInfo={this.props.sendInfo}/>
			</div>
		)
	}
})

var SignBox = React.createClass({
	_getLoginClick: function(event){
		if(event.which===13){
			var password = event.target.value,
				username = this.refs.usernameInput.getDOMNode().value
			this.props.sendInfo(username,password)
		}
	},

	render: function(){
		return (
			<div id = "signUpBox">
				<input type = "text" placeholder = "username" ref = "usernameInput" />
				<input type = "password" placeholder = "password" onKeyPress = {this._getLoginClick} />
			</div>
		)
	}
})

var HomeView = React.createClass({
	// componentDidMount: function(){
	// 	var self = this
	// 	var update = function(){self.forceUpdate()}
	// 	this.props.stories.on('sync change', update)
	// },


	render: function(){
		return(
			<div id="homeView">
				<HomeHeader />
				<Newsfeed stories = {this.props.stories} />
			</div>	
		)
	}
})

// TestWriteStory processStory = {this.props.processStory} stories = {this.props.stories}
			
var HomeHeader= React.createClass({
	_renderWriteStoryView: function(e){
		location.hash = 'write'
	},

	_renderLogOut : function(e){
		location.hash = 'logout'
	},

	render: function(){
		return (
			<div id="homeDiv">
				<h5>The Wicked Professional</h5>
				<div id= "buttonDiv">
					<button onClick={this._renderWriteStoryView}>WriteStory</button>
					<button>Profile</button>
					<button onClick={this._renderLogOut}>Log Out</button>
				</div>
			</div>
		)
	}
})

var Newsfeed = React.createClass({
	_renderStory: function(storyObj){
		return <News key={storyObj.id} story={storyObj} />
	},

	render: function(){
		var storyArray = this.props.stories
		console.log(storyArray)
		window.storyArray = storyArray

		return(
			<div id="storyBox">
				{storyArray.map(this._renderStory)}
			</div>
		)
		
	}
})

var News = React.createClass({
	render: function(){
		// window.storyy = this.props.story 
		return(
			<div className="story">
				<p>{this.props.story.get('title')}</p>
				<p>{this.props.story.get('blogPost')}</p>
			</div>
		)
	}
})


var WriteView = React.createClass({
	// _keyPressHandler: function(event){
	// 	if(event.which === 13){
	// 		var textBox = event.target
	// 		var newStory = textBox.innerHTML
	// 		textBox.innerHTML = ''
	// 		this.props.processStory(newStory)
	// 	}
	// },

	_clicktoSubmit: function(e){
		location.hash = 'home'
	},

	render: function(){
		return(
			<div id="writeView">
				<Header />
				<input type = "text" placeholder = "Title" ref = "titleInput" id="titleInput" />
				<input type = "text" placeholder = "Tell Your Story" ref = "storyInput" id="storyInput" />
				<button onClick = {this._clicktoSubmit}>Save</button>
			</div>
		)
	}
})

//----------------ROUTER-------------

var MediumRouter = Backbone.Router.extend({
	routes:{
		'logout':'showlogOut',
		'write': 'showBlog',
		'home': 'showHome',
		'signup': 'showSignUp',
		'login': 'showLogin'
		
	},

	processLogin: function(){
		Parse.User.logIn().then(
			function(){
				alert("Thanks for logging in " + username)
				location.hash = "home"
			},
			function(){
				alert('Password is not valid. If you do not have an account, please sign up.')
			}
	)},


	processSignup: function(username,password){
		var newUser = new Parse.User()
		newUser.set('username',username)
		newUser.set('password',password)
		newUser.signUp().then(
			function(user){
				alert("Thanks for signing up " + username+ '!')
				location.hash = 'home'
			})
	// .fail(
	// 	function(error))
	},

	processStory: function(title,blog){
		var storyModel = new MediumModel(),
			modelParams = {
				title: title,
				blogPost: blog,
				userid: Parse.User.current().id
			}
			storyModel.set(modelParams)
			this.sc.add(storyModel)
			storyModel.save(null, {
				headers: storyModel.parseHeaders
			})
	},

	showLogin: function(){
		console.log('showing login view')
		React.render(<LoginView sendInfo = {this.processLogin} />, document.querySelector("#container"))
	},

	showSignUp: function(){
		console.log('showing signup')
		React.render(<SignupView sendInfo = {this.processSignup} />, document.querySelector("#container"))
	},

	showHome: function(){
		console.log('going home')
		var paramObject = {
			userid: Parse.User.current().id
			},
			stringifiedParamObject = JSON.stringify(paramObject)
		this.sc.fetch({
			headers: this.sc.parseHeaders,
			processData:true,
			data: {
				where: stringifiedParamObject
			}
		})
		React.render(
			<HomeView processStory = {this.processStory.bind(this)} stories={this.sc}/>, document.querySelector("#container"))
	},

	showBlog: function(){
		React.render(<WriteView sendInfo = {this.processStory.bind(this)} stories={this.sc} />, document.querySelector("#container"))
	},

	showlogOut: function(){
		Parse.User.logOut().then(
			function(){
				location.hash = "login"
			}
		)
		this.pc.reset()
	},


	initialize: function(){
		this.sc = new MediumCollection()
		location.hash = 'login'
		Backbone.history.start()
	}
})

var mr = new MediumRouter()


// 	showSignUp: function(username,password){

// }