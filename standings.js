var _ = require('lodash'),
	jsdom = require('jsdom');

function Team(teamLink, gamesPlayed, wins, losses, overtimeLosses, points) {
	if (!teamLink) throw new Error('teamLink must be specified when creating a Team');

	this.teamLink = teamLink;
	this.gamesPlayed = gamesPlayed || 0;
	this.wins = wins || 0;
	this.losses = losses || 0;
	this.overtimeLosses = overtimeLosses || 0;
	this.points = points || 0;
}

// maps team marker on nhl.com to reddit link
var teamLinkMap = {
		'SJS': 'http://sanjosesharks.reddit.com/#sharksMedium',
		'PHX': 'http://coyotes.reddit.com/#coyotesMedium',
		'ANA': 'http://anaheimducks.reddit.com#ducksMedium',
		'CGY': 'http://calgaryflames.reddit.com/#flamesMedium',
		'VAN': 'http://canucks.reddit.com/#canucksMedium',
		'LAK': 'http://LosAngelesKings.reddit.com/#kingsMedium',
		'EDM': 'http://edmontonoilers.reddit.com/#oilersMedium'
	},
	sidebarTemplate = _.template('[](<%= teamLink %>)|<%= gamesPlayed %>|<%= wins %>|<%= losses %>|<%= overtimeLosses %>|<%= points %>|'),
	teams= [];

jsdom.env(
	"http://www.nhl.com/ice/standings.htm",
	["http://code.jquery.com/jquery.js"],
	function (errors, window) {
		var $ = window.jQuery,
			today = new Date(),
			pacificRows = $('th:contains("Pacific")').parent().parent().parent().find('tbody tr');
		
		console.log('*Updated ' + (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear() + '* [See current standings](https://www.google.com/search?q=nhl+pacific+division+standings)\n\nTeam|GP|W|L|OT|PTS\n:----|:----|:----|:----|:----|:----|');
		pacificRows.each(function () {
			var cells = $(this).find('td'),
				team = new Team(
					teamLinkMap[$(cells[1]).find('a').attr('rel')],
					cells[2].innerHTML,
					cells[3].innerHTML,
					cells[4].innerHTML,
					cells[5].innerHTML,
					cells[6].innerHTML 
				);

			console.log(sidebarTemplate(team));
		});
	}
);



