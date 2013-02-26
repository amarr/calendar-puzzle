(function(root) {
	/**
	 * Lays out events for a single  day
	 *
	 * @param {Array} events An array of event objects. Each event object consists
	 *                       of a start and end time  (measured in minutes) from 9am,
	 *                       as well as a unique id. The start and end time of each
	 *                       event will be [0, 720]. The start time will be less than
	 *                       the end time.
	 *
	 * @return {Array} An array of event objects that has the width, the left and top
	 *                 positions set, in addition to the id, start and end time. The 
	 *                 object should be laid out so that there are no overlapping events.
	 *
	 * function layOutDay(events) {...}
	 */
	function layOutDay(events) {
		console.profile('a');

		var touchedEvents = [];

		for(var i = 0, l = events.length; i < l; i++) {
			var event = events[i];

			event.collisions = [];
			event.top = event.start;
			event.left = 0;
			event.width = 600;

			touchedEvents.push(event);
		}

		while(touchedEvents.length > 0) {
			var event = touchedEvents.pop();

			for(var j = 0; j < touchedEvents.length; j++) {
				var otherEvent = touchedEvents[j];

				if(eventsCollide(event, otherEvent)) {
					event.collisions.push(otherEvent.id);
					otherEvent.collisions.push(event.id);
				}
			}
		}

		// Events are sorted so highest collision count is first
		var sortedEvents = _.sortBy(events, function(event) {
			return event.collisions.length * -1;
		});

		_.each(sortedEvents, function(event) {
			event.width = 600 / (event.collisions.length + 1);
			var otherLeft = event.width;

			_.each(event.collisions, function(id) {
				var otherEvent = getEventById(sortedEvents, id);

				otherEvent.width = event.width;
				otherEvent.left = otherLeft;

				otherLeft += event.width;

				removeEventById(sortedEvents, id);
			});
		});

		console.profileEnd('a');
		return events;
	}

	/**
	 * Checks to see if two events collide.
	 * @param  {Event} event1
	 * @param  {Event} event2
	 * @return {Boolean}
	 */
	function eventsCollide(event1, event2) {
		// event2 starts within event1
		if(event1.start <= event2.start && event1.end >= event2.start) {
			return true;
		}

		// event2 ends within event1
		if(event1.start <= event2.end && event1.end >= event2.end) {
			return true;
		}

		return false;
	}

	function eventOccursAtMinute(event, minute) {
		return event.start <= minute && event.end >= minute;
	}

	function removeEventById(events, id) {
		for(var i = 0, l = events.length; i < l; i++) {
			if(events[i].id == id) {
				events.splice(i, 1);
				break;
			}
		}
	}

	function getEventById(events, id) {
		for(var i = 0, l = events.length; i < l; i++) {
			if(events[i].id == id) {
				return events[i];
			}
		}	
	}

	var hourMap = ['9:xx AM','10:xx AM','11:xx AM','12:xx PM','1:xx PM','2:xx PM','3:xx PM','4:xx PM','5:xx PM','6:xx PM','7:xx PM','8:xx PM','9:xx PM'];
	function toTimeStr(number) {
		var hours = Math.floor(number / 60);
		var minutes = number % 60;

		if(minutes < 10) {
			minutes += '0';
		}

		return hourMap[hours].replace('xx', minutes);
	}

	function renderEvent(id, top, left, height, width) {
		var el = $('<div id='+id+'></div>').addClass('event').css({top:top,left:left,height:height,width:width});
		buffer.append(el);
	}

	function renderLine(top, minutes) {
		var line = $el('div').addClass('line').css({top:top,left:0});
		line.append($el('small', toTimeStr(minutes)));
		buffer.append(line);
	}

	var buffer = $el('div');
	function renderBuffer() {
		$('.inner').append(buffer.html());
		buffer = $el('div');
	}

	function $el(name, text) {
		if(text) {
 			return $(document.createElement(name)).text(text);
 		}
 		else {
 			return $(document.createElement(name));
 		}
	}

	root.app = {
		layOutDay : layOutDay,
		toTimeStr : toTimeStr,
		renderEvent : renderEvent,
		renderLine : renderLine,
		renderBuffer : renderBuffer
	}
})(this);

// Startup
(function() {
	var events = [
		{id:2, start:30, end:150}, // 9:30 - 11:30
		{id:4, start:190, end: 370},
		{id:5, start:215, end: 295},
		{id:6, start:400, end: 430},
		{id:7, start:420, end: 450},
		{id:8, start:440, end: 480},
		{id:9, start:425, end: 455},		
		{id:0, start:540, end:600}, // 6:00 - 7:00
		{id:1, start:560, end:620}, // 6:20 - 7:20
		{id:3, start:610, end:710} // 7:10 - 8:10
	];

	var res = app.layOutDay(events);

	$(function() {
		for(var i = 0, l = 720; i <= l; i++) {
			if(i % 30 == 0) {
				app.renderLine(i, i);
			}
		}

		_.each(res, function(minute, i) {
			var h = minute.end - minute.start;
			app.renderEvent(minute.id, minute.top, minute.left + 60, h, minute.width);
		});

		app.renderBuffer();
	});
})();