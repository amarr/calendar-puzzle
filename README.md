calendar-puzzle
===============

My implementation of this calendar puzzle.

### Description 

This puzzle is a calendar rendering problem. The input is a list of events and the output is a calendar display similar to Outlook, Google Calendar, etc. Although there is a decent amount of front-end work, the crux of the problem is finding a robust algorithm for laying out the events. The algorithmic difficulty of this problem is quite high, so candidates who submit a robust solution should be regarded as pretty technical.

### Part 1

Write a function (JavaScript) to lay out a series of events on the calendar for a single day.

Events will be placed in a container. The top of the container represents 9am and the bottom represents 9pm. The width of the container will be 620px (10px padding on the left and right) and the height will be 720px (1 pixel for every minute between 9am and 9pm). The objects should be laid out so that they do not visually overlap. If there is only one event at a given time slot, its width should be 600px.

There are 2 major constraints:

+ Every colliding event must be the same width as every other event that it collides width.
+ An event should use the maximum width possible while still adhering to the first constraint.

The input to the function will be an array of event objects with the start and end times of the event. Example (JavaScript):

```javascript
[
  { id: 1, start: 60, end: 120 },  // Event from 10am to 11am
  { id: 2, start: 100, end: 240 }, // Event from 10:40am to 1pm
  { id: 3, start: 700, end: 720 }  // Event from 8:40pm to 9pm 
]
```

The function should return an array of event objects that have the left and top positions set (relative to the top left of the container), in addition to the id, start, and end time.

```javascript
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
```

### Part II

Use your function from Part I to create a web page that is styled with the following calendar events:

+ An event that starts at 9:30 am and ends at 11:30 am
+ An event that starts at 6:00 pm and ends at 7:00pm
+ An event that starts at 6:20pm and ends at 7:20pm
+ An event that starts at 7:10pm pm and ends at 8:10 pm

## My Solution

In a very short overview:

First, I identify collisions:

```
For each event
  Initialize empty list of collisons
  For each minute the event occurs
    Identity if other event also occurs at this time. If so, add it to the current event's collision list.
```

Running time is N events * M minutes per event. Room for optimization here...

Next the list of events is sorted in descending order of greatest number of collisions.

Finally, we determine the required values, starting we the obvious:

```
Element top = start minute
```

Lastly we determine true width and left:

```
For each event
  if no collisions exist:
    width = MAX
    left = 0
  else:
    width = MAX / number of collisions
    left = 0
    (incrementingLeft = left)
    For each colliding event
      (incrementingLeft += width)
      collider's width = width
      collider's left = incrementingLeft
      remove collider from sorted list
```
    
In this way we ensure we are working with the event with the greatest collision count first and we can apply the same values to colliding events. After applying the values, we simply remove them from the list to ensure we only visit each event once.
