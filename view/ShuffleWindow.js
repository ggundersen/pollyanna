App.View.ShuffleWindow = BaseWindow.extend({

	events: {
		'click button.close' : 'cancelWindow',
		'click button.submit' : 'shufflePlayers'
	},

	initialize: function(options) {
		$('body').append(this.el);
		$(this.el).html(
			'<h4>Shuffle settings</h4>' +
			'<form>' +
				'<label>' +
					'<span class="label-title">Shuffle by gender <span class="optional"> (optional):</span></span>' +
					'<input type="radio" name="gender" class="gender" value="yes">Yes</input>' +
					'<input type="radio" name="gender" class="gender" value="no">No</input>' +
				'</label>' +
				'<button class="submit">Shuffle</input>' +
				'<button class="close">Cancel</button>' +
				'<span class="error"></span>' +
			'</form>'
		);
	},

	getByGender: function(coll, gen) {
		return coll.where({ gender: gen });
	},

	getFilteredPlayers: function() {
		var options = this.getUserOptions(),
			result;

		if ( _.isUndefined(options.gender) || options.gender === 'no' ) {
			result = [ this.collection.models ];
		} else {
			result = [
				this.getByGender(this.collection, 'male'),
				this.getByGender(this.collection, 'female'),
			];
		}

		return result;
	},

	getUserOptions: function() {
		return {
			gender: $('.gender:checked').val()
		};
	},

	isValidConfig: function(players) {
		if (players.length === 1) {
			return players[0].length > 0;
		} else {
			return players[0].length > 0 || players[1].length > 0;
		}
	},

	shufflePlayers: function(evt) {
		evt.preventDefault();

		var playersByGroup = this.getFilteredPlayers(),
			result = [];

		console.log('players by group');
		console.log(playersByGroup);

		if ( !this.isValidConfig(playersByGroup) ) {
			this.notifyUser('There are no players to shuffle!');
			return;
		}
		if (playersByGroup.length === 1) {
			result = App.Algorithm.Shuffle( playersByGroup[0] );
		} else {
			tempResult = _.map(playersByGroup, function(group) {
				return App.Algorithm.Shuffle( group );
			});
			result = tempResult[0].concat(tempResult[1]);
		}
		this.trigger('shuffle', result);
		this.resetWindow();	
	}

});