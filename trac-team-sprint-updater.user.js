var TracUpdateSprintDates = function() {
	// Function to determine week of year
	Date.prototype.getWeek = function() {
		var onejan = new Date(this.getFullYear(), 0, 1);
		return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
	};

	// Adds custom method to Arrays using JS' prototyping
	Array.prototype.indexOfContaining = function(search) {
		for (var i = 0; i < this.length; i++) {
			if (this[i].indexOf(search) != -1) {
				return i;
			}
		}

		return -1;
	};
};

TracUpdateSprintDates.prototype = {
		getCurrentDate: function() {
			return new Date();
		},
		
		getSprintStartAndEndDate: function(offset) {
			var currentDate = this.getCurrentDate();

			// Calculate the offset
			if (offset != undefined) {
				// If the current week is odd, the next sprint starts in at least 14
				// days.
				if (currentDate.getWeek() % 2 != 0) {
					offset = offset * 14;
				} else {
					offset = offset * 7;
				}
				currentDate.setDate(currentDate.getDate() + offset);
			}

			/*
			 * Since we have sprints every two weeks, our Milestones are defined
			 * from odd week to even week (e.g. 45-46). If the current week is odd,
			 * append the next week to the current week. If the current week is
			 * even, get the previous week first and then append current week.
			 */
			var dayOffset = currentDate.getDay() - 1;
			dayOffset = currentDate.getDate() - dayOffset;
			
			var weekNumber = currentDate.getWeek();
			if (weekNumber % 2 == 0) {
				dayOffset -= 7;
			}
			var start = new Date(currentDate.setDate(dayOffset));
			var end = new Date(start);
			end = new Date(end.setDate(end.getDate() + 11));

			return {
				'start' : start,
				'end' : end
			};
		},
		
		/**
		 * @param offset May be used to get sprint data for next sprint "offset = 1" or previous sprint "offset = -1"
		 * @returns A string like "<year> KW<week start>-<week end>" 
		 */
		getSprintStartAndEndWeeks: function(offset) {
			var obj = this.getSprintStartAndEndDate(offset);
			var year = obj.start.getFullYear();
			var startWeek = obj.start.getWeek();
			var endWeek = obj.end.getWeek();
			
			if (startWeek < 10)
				startWeek = "0" + startWeek;
			if (endWeek < 10)
				endWeek = "0" + endWeek;

			var kw = startWeek + "-" + endWeek;

			return kwString = year + " KW" + kw;
		}
};