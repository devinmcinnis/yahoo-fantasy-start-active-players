// Start Active Players in Yahoo Fantasy Hockey League

// So, you want to set your lineup for the rest of the season? Or maybe it's
// just to make sure you have guys playing for the week while you're away.
// Either way, I've got you covered!

// ****************************************
// **** DON'T WANT TO READ EVERYTHING? ****
// ****************************************
// Copy and paste this code into your browser's console while you're on your
// fantasy team's roster page. Yes, all of it. Don't know how to get to your
// console? I've got you covered there too.

// Chrome:
//   Windows: CTRL + SHIFT + J
//   Mac: CMD + OPT + J

// Firefox:
//   Windows: CTRL + SHIFT + K
//   Mac: CMD + OPT + K

// Safari:
//   Preferences > Advanced > Show Developer Tools
//   Mac: CMD + OPT + I

// Internet Explorer
//   Windows: F12 > Console

// If none of those work, try Google

// To start, if you don't modify anything, this will start setting your
// lineups from today until the last day of the season. The ONLY thing you
// should modify is the startDate below. To modify it, remove the "// "
// before so the line starts at "var". Then, set the date you want to start
// setting your lineup.

// If something goes wrong, you can always type in "clearInterval(timer)"
// (without the quotation marks) to cancel this script OR you can refresh
// the page and everything will go back to normal.

// I've also left comments in the code if you want to see what's going on
// underneath the hood. So, without further ado..

// timer is a global object so if anything goes wrong, we can cancel it
// with "clearInterval(timer)" (without the quotation marks)
// Mostly for testing purposes
var timer = undefined;

// To request pages without needing to load all of its files, we're including
// jQuery (a JavaScript library) to be able to fake page requests through AJAX
var body = document.getElementsByTagName('body')[0];
var jq = document.createElement('script');
jq.setAttribute('src', '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js');
body.appendChild(jq);

// Since we need jQuery, we're only running the rest of the code after its loaded
jq.onload = function () {

  // Date you want to start setting your active players, YYYY-MM-DD
  // Make sure it's set within the same quotation marks on either side
  // You can leave this commented out; it'll start on today's date
  // var startDate = '2014-12-31';

  // Last game of the season is played on April 13th :(
  var endOfSeason = new Date('2014-04-13');

  // If you've specified a custom start date, use that
  // If not, use today as a starting point
  var date = undefined;

  if (typeof startDate !== 'undefined') {
    date = new Date(startDate);
  } else {
    date = new Date();
  }

  // Undefined variables (for now) to store dates
  var daysRemaining = undefined;
  var newYear = undefined;
  var newMonth = undefined;
  var newDay = undefined;

  // The URL holds the information to your league and team IDs
  var url = window.location.href;

  // Let's break down the URL
  // What we need is the League's ID and your Team's ID
  // http://hockey.fantasysports.yahoo.com/hockey/[leagueID]/[teamID]/
  url = url.split('hockey/');
  url = url[1].split('/');
  var leagueID = url[0];
  var teamID = url[1];
  var crumb = '';
  var startActiveUrl = '';

  // Now, there's a little crumb that we need to add to the end of the URL
  // I'm not sure if it's the same for everyone so let's just find and use it
  var els = document.getElementsByTagName("a");

  // For every <a> element (button/link) on the page
  for (var i = 0, l = els.length; i < l; i++) {
    var el = els[i];

    // If any of their link values contain "crumb"
    if (el.href.match('crumb')) {

      // Save the crumb to a variable so we can use it later
      crumb = el.getAttribute('href');
      crumb = crumb.split('crumb=');
      crumb = crumb[1];
    }
  }

  (function setDaysRemaining () {

    // Hours * minutes * seconds * milliseconds
    var oneDay = 24 * 60 * 60 * 1000;
    var firstDate = date;
    var secondDate = endOfSeason;

    // Calculate the days remaining based on the startDate (or today)
    // and the last game of the season (endOfSeason)
    daysRemaining = Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)) + 1;

    // Set the (currently) undefined variables
    setNewDate();

    // Set the day to the starting day plus 1
    date.setDate(parseInt(newDay, 10) + 1);

    // Start a timer, fun
    timer = setInterval(function() {

      // At the end of this, we subtract 1 from the amount of days left in
      // the season. If the daysRemaining is above 0 before that, run this
      // part of the code
      if (daysRemaining > 0) {

        // Update the date
        setNewDate();

        // Let's create a new URL from your settings
        startActiveUrl = 'http://hockey.fantasysports.yahoo.com/hockey/' + leagueID + '/' + teamID + '/startactiveplayers?date=' + newYear + '-' + newMonth + '-' + newDay + '&crumb=' + crumb;

        // Here, we're going to use the jQuery script we loaded before to
        // send a GET request. Reason being was to send many requests
        // without having to download any files. Every byte counts for
        // us Canadians!
        jQuery.get(startActiveUrl);

        // Little note for you in the console
        console.log('Setting roster for: ' + date);

        // Since we may need to set newDay to a string (if its a single digit
        // day, 1 to 9), convert it back into an integer/number so we can
        // calculate the next date
        newDay = parseInt(newDay, 10);

        // Calculate the next date
        date.setDate(newDay + 1);

      } else {

        // If there are no more days remaining from startDate (or today) and
        // endOfSeason, cancel the timer and show an alert box
        clearInterval(timer);
        alert('All of your lineups have been set!');

      }

      // Remember above we talked about subtracting 1 from the total days
      // remaining? This is it
      daysRemaining -= 1;

    // JavaScript time is run in milliseconds
    // 1000ms = 1s
    // Run the timer every second
    }, 200);

  })();

  function setNewDate () {

    // From the new date we created, get the values for year, month, day
    newYear = date.getFullYear();

    // Note: in JavaScript, months run 0 to 11, so April is month 3, not 4
    // For Yahoo though, we need the actual month number
    newMonth = date.getMonth() + 1;
    newDay = date.getDate();

    // Same as in the beginning, if a month or day is a single digit,
    // add a '0' in front of it; again, for Yahoo
    if (newMonth.toString().length === 1) {
      newMonth = '0' + newMonth;
    }

    if (newDay.toString().length === 1) {
      newDay = '0' + newDay;
    }
  }

  // That's it! You're all set to get your lineups rolling with a little code.
  // Welcome to the lazy, but efficient, life of programming :)
}

