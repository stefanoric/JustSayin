require('mocha');
require('should');

var github = require('./github');
var jira = require('./jira');
var teamcity = require('./teamcity');
var fs = require('fs');

describe('JustSayin',function(){

    describe('github',function(){

        it('should parse a github post body into a hipchat html message',function(done){
            var sampleJSON = JSON.parse(fs.readFileSync('Samples/github_sample.json'));
            var sampleHTML = fs.readFileSync('Samples/githubtohipchat.html').toString();

            var result = github.parseGithubJsonIntoHipChatMessageHtml(sampleJSON);
            result.should.eql(sampleHTML);

            done();
        })

        it('should return system announcements roomId when key is wildcard and config repoName does not exist',function(done){

            var sampleConfig = {teams: [{team: 'JG.Mobile', roomId:378395 , key:'*' }]};
            var result = github.getRoomIdForConfig(sampleConfig,"someBranch","someRepo")
            result.should.eql(379365);

            done();
        })

        it('should return team roomId when key is wildcard and config repoName does exist',function(done){

            var sampleConfig = {teams: [{team: 'JG.Mobile', roomId:378395 , key:'*',repo:'someRepo' }]};
            var result = github.getRoomIdForConfig(sampleConfig,"someBranch","someRepo")
            result.should.eql(378395);

            done();
        })

        it('should return team roomId when key is found in branch name',function(done){

            var sampleConfig = {teams: [{team: 'JG.Mobile', roomId:456 , key:'someBranch' }]};
            var result = github.getRoomIdForConfig(sampleConfig,"someBranch")
            result.should.eql(456);

            done();
        })
    })

    describe('jira',function(){

        it('should parse a jira post body into a status update html message', function(done){
            var sampleJSON = JSON.parse(fs.readFileSync('Samples/jira_sample.json'));
            var sampleHTML = fs.readFileSync('Samples/jiratohipchat.html').toString();

            var result = jira.parseJiraPostBodyToHtmlMessage(sampleJSON);
            result.should.eql(sampleHTML);

            done();
        })	
    })
	
	describe('teamcity', function(){
		it('should create a red message when there is a failure', function(done){
			var message = 'something happened in Teamcity with a failure run!';
            var result = teamcity.prepareHipChatMessage(message);
            result.color.should.eql('red');
			done();
		})
		
		it('should create a yellow message when there is no failure', function(done){
			var message = 'our team city is soo awesome that we have only success';
            var result = teamcity.prepareHipChatMessage(message);
            result.color.should.eql('yellow');
			done();
		})
	})
})