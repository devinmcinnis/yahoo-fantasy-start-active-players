// Start Active Players in Yahoo Fantasy Hockey League

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

// If none of those work, try Google.

// To start, if you don't modify anything, this will start setting your
// lineups from today until the last day of the season. The ONLY thing you
// should modify is the startDate below. To modify it, remove the "// "
// before so the line starts at "var". Then, set the date you want to start
// setting your lineup.

// If something goes wrong, you can always type in "clearInterval(timer)"
// (without the quotation marks) to cancel this script OR you can refresh
// the page and everything will go back to normal.

// I've also left comments in the code if you want to see what's going on
// underneath the hood.

// timer is a global object. If anything goes wrong,
// we can cancel it with clearInterval(timer)
var timer = undefined;

// To request pages without needing to load all of its files, we're including
// jQuery (a JavaScript library) to be able to fake page requests through AJAX
var body = document.getElementsByTagName('body')[0];
var jq = document.createElement('script');
jq.setAttribute('src', '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js');
body.appendChild(jq);

function getEndDate(sport) {
  // Since end dates change season-to-season
  // We're going to use a default date
  switch (sport) {
    case 'hockey':
      return '04-15';
    case 'football':
      return '01-15'
    case 'baseball':
      return '10-15'
    case 'basketball':
      return '05-01'
    default:
      return '06-01'
  }
}

// Since we need jQuery, we're only running the rest of the code after its loaded
jq.onload = function () {

  // Date you want to start setting your active players, YYYY-MM-DD
  // Make sure it's set within the same quotation marks on either side
  // You can leave this commented out; it'll start on today's date
  // var startDate = 'YYYY-MM-DD';

  // If you've specified a custom start date, use that
  // If not, use today as a starting point
  var date;

  if (typeof startDate !== 'undefined') {
    date = new Date(startDate);
  } else {
    date = new Date();
  }

  // Undefined variables (for now) to store dates
  var daysRemaining, newYear, newMonth, newDay;

  // The URL holds the information to your league and team IDs
  var url = window.location.pathname;
  url = url.split('/');
  var sport = url[url.length - 3];
  var leagueID = url[url.length - 2];
  var teamID = url[url.length - 1];
  var crumb, startActiveUrl;

  // Now, there's a little crumb that we need to add to the end of the URL
  // I'm not sure if it's the same for everyone so let's just find and use it
  var els = document.getElementsByTagName("a"),
    el;

  // For every <a> element (button/link) on the page
  for (var i = 0, l = els.length; i < l; i++) {
    el = els[i];

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
    var endDateString = (new Date()).getFullYear() + '-' + getEndDate(sport);
    var secondDate = new Date(endDateString);

    // Calculate the days remaining based on the startDate (or today)
    // and the last game of the season (endOfSeason)
    daysRemaining = Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)) + 1;

    // Start a timer, fun
    timer = setInterval(function() {
      if (daysRemaining > 0) {

        // Let's create a new URL from your settings
        startActiveUrl = window.location.protocol + '//' + sport + '.fantasysports.yahoo.com/' + sport + '/' + leagueID + '/' + teamID + '/startactiveplayers?date=' + setNewDate() + '&crumb=' + crumb;

        // Here, we're going to use the jQuery script we loaded before to
        // send a GET request. Reason being was to send many requests
        // without having to download any files. Every byte counts for
        // us Canadians!
        jQuery.get(startActiveUrl);

        // Little note for you in the console
        console.log('Setting roster for: ' + date);

        daysRemaining -= 1;

        // Calculate the next date
        date.setDate(date.getDate() + 1);
      } else {
        // If there are no more days remaining from startDate (or today) and
        // endOfSeason, cancel the timer and show an alert box
        clearInterval(timer);
        alert('All of your lineups have been set!');
      }

    // JavaScript time is run in milliseconds
    // 1000ms = 1s
    // Run the timer every second
    }, 500);

  })();

  function setNewDate () {
    // From the new date we created, get the values for year, month, day
    var newYear = date.getFullYear();

    // Note: in JavaScript, months run 0 to 11, so April is month 3, not 4
    // For Yahoo though, we need the actual month number
    var newMonth = date.getMonth() + 1;
    var newDay = date.getDate();

    // Same as in the beginning, if a month or day is a single digit,
    // add a '0' in front of it; again, for Yahoo
    if (newMonth.toString().length === 1) {
      newMonth = '0' + newMonth;
    }

    if (newDay.toString().length === 1) {
      newDay = '0' + newDay;
    }

    return newYear + '-' + newMonth + '-' + newDay;
  }

  // That's it! You're all set to get your lineups rolling with a little code.
  // Welcome to the lazy, but efficient, life of programming :)
}

