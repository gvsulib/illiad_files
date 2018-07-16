var isIE = (function() { // Is this IE?
         var div = document.createElement('div');
         div.innerHTML = '<!--[if lt IE 9]><marquee></marquee><![endif]-->';
         return (div.getElementsByTagName('marquee').length === 1);
      }());

      function createCookie(name,value,days)
      {
      	if (days) {
      		var date = new Date();
      		date.setTime(date.getTime()+(days*24*60*60*1000));
      		var expires = "; expires="+date.toGMTString();
      	}
      	else var expires = "";
      	document.cookie = name+"="+value+expires+"; path=/";
      	$(".close").closest(".update-info").css("display","none");
      }

      function readCookie(name)
      {
      	var nameEQ = name + "=";
      	var ca = document.cookie.split(';');
      	for(var i=0;i < ca.length;i++) {
      		var c = ca[i];
      		while (c.charAt(0)==' ') c = c.substring(1,c.length);
      		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      	}
      	return null;
      }

 $(document).ready(function() {



		function getQueryVar(varName){

    		var queryStr = unescape(window.location.search) + '&';
			var regex = new RegExp('.*?[&\\?]' + varName + '=(.*?)&.*');
			val = queryStr.replace(regex, "$1");
			return val == queryStr ? false : val;
		}




		// Document Delivery Script

		$("option:contains('LIB')").text("Mary Idema Pew Library @ Allendale");
		$("option:contains('STEEL')").text("Steelcase Library @ DeVos");
		$("option:contains('AWRI')").text("Annis Water Research Institute");
		$("option:contains('FREY')").text("Frey Learning Center @ CHS");
		$("option:contains('OCS')").text("Ship books to me");
		$("option:contains('VARI')").text("VanAndel Research Institute");
		$("option:contains('ILL')").text("Please choose a location");

		var pickupLoc  = $("select#NVTGC").val();

		if(pickupLoc != "OCS") {
			$(".illiad-mailing-address").hide();
			$("#NVTGC").change(function(){
				$(".illiad-mailing-address").toggle($(this).val()=='OCS');
			});
		}

		$("#transactionMenu a.menuEdit:last").click(function() { // Add notification that item will be canceled.
			if(confirm("Are you sure you want to cancel this request?")) {
				alert("Your request has been cancelled."); }
				else { return false; }
		});


		$(".lib-table table tbody tr td a").addClass("editlink");
		$(".lib-table table tbody tr td a:contains('Delete')").removeClass("editlink").addClass("delete-link");
		$(".lib-table table tbody tr td a:contains('View')").removeClass("editlink").addClass("view-link");

		$(".lib-table table:contains('Checked Out Items') th:contains('Due Date')").text("Due");
		$(".lib-table table:contains('Checked Out Items') td:contains('Checked Out to Customer')").text("Checked Out");
		$(".lib-table table:contains('Outstanding Requests')").find("a").each(function() {
			var reqNo = $(this).text();
			$(this).text("Show (" + reqNo + ")");
		});

		$("a.menuEdit:contains('Cancel')").css("color", "red").css("display", "block").css("float", "right");

		$("a.delete-link").click(function() {
			if(confirm("Are you sure you want to delete this item?")) {
				alert("Your article has been deleted."); }
				else { return false; }
		});


	/*  Illiad's status messages are ridiculous. The text is rarely helpful,
		and everything is written in a weird hybrid of computer- and
		librarian-ese. We'll hide some of the most offensive ones.
	*/

		if($('.statusNormal').length > 0) { // There is a .statusNormal class

			// Get the text of the status
			var statusText = $('.statusNormal').text();

			// Hide the useless versions
			if(statusText === 'Choose an option from the choices below.' || statusText === 'Enter information below and press the Submit Information button to send.' || statusText === 'When Finished Editing, press the Submit Information button below.') {

				$('.statusNormal').hide();

			} else { // Status might be useful. Style it appropriately.

				$('.statusNormal').addClass('alert').addClass('alert-warning').find('font').removeAttr('color');

			}
		}

		


	/*  Check to see if this is the request submitted page,
	 	the only place this status class appears
	*/

		if($('.statusInformation').length > 0) { // Yup.

		// Get some information about what type of item this is.

			// Get the text of the status
			var statusText = $('.statusInformation').text();

			// Break the status text up into words
			var statusTextWords = statusText.split(' ');

			// Make sure we're really on the request received page,
			// and check for item type
			if(statusTextWords[1] == 'Request' && statusTextWords[2] == 'Received.' && statusTextWords[0 == 'Article']) {

				// Item is an article. Make a readable status.
				$('.statusInformation').addClass('alert alert-success').html('<b>Got it!</b> Most articles come in 1-3 days. We&#8217;ll let you know when it&#8217;s here.');

			} else {

				// Item is either a book or thesis. Make readable status.
				$('.statusInformation').addClass('alert alert-success').html('<b>Got it!</b> Loans from other libraries can take 1-2 weeks. We&#8217;ll let you know when it&#8217;s here.');
			}
		}

		if($(".statusNormal").length > 0 && $(".statusNormal:last-child").text() == "There can be no further renewals.") {

			// This is the page you see when you've renewed an item. The dialogs are terrible.
			// Let's fix that.

			// Get the due date
			var firstAlert = $(".statusNormal:first-child").text();
			var alertChunks = firstAlert.split(" ");
			var dueDate = alertChunks[7];

			// Now hide the terrible status alerts
			$(".statusNormal").hide();

			// Add a nice new one.
			var newAlert = '<p class="alert alert-success" style="margin-bottom: 0;"><b>Got it!</b> We&#8217;ll ask the library we borrowed this from if you can have it until <b>' + dueDate + '</b><br />They probably will. We&#8217;ll email you only if they need it back now.</p>';

			// Put it on the page
			$("#status").prepend(newAlert);
		}


		if(isIE == false) { // Hide this function from IE 8 and below, because it chokes on $.load

		$(".how-to-renew-items").hide();

		// Load checked out items in hidden iframes to see if they allow renewals
		var renewAllowed;
		$(".lib-table").find("table:contains('Checked Out Items')").find("a").each(function(index) {
			var renewNo = $(this).text();
			$("#renewalHack").load('illiad.dll?Action=10&Form=67&Value=' + renewNo + ' #renewal-details', function() {
				var renewAllowed = $("#renewalHack").find("table td:contains('Renewals Allowed')").next("td").text();
				var renewDate = $("#renewalHack").find("table td:contains('Due Date')").next("td").text();
				$(".lib-table table:contains('Checked Out Items') tbody tr:contains('" + renewNo + "')").find("td:last-child").text(renewDate);
				 if($.trim(renewAllowed) === 'Yes') {

				 	// Calculate whether it is currently 7 days before or after the due date to know if the request will go through

				 	var newDate = Date.parse(renewDate);
				 	newDate = newDate / 1000;
				 	var currentDate = Math.round((new Date()).getTime() / 1000);

				 	var diff = newDate - currentDate;
				 	console.log(renewDate);
				 	console.log(newDate);
				 	console.log(currentDate);
				 	console.log(diff);

				 	if(diff > 691200 || diff < -691200) { // Not during renewal period

				 		console.log("Getting here");

				 		$(".lib-table table:contains('Checked Out Items')").find("a:contains(" + renewNo + ")").removeClass('editlink').text("Renewals Allowed (" + renewNo + ")");

				 	} else { // Can be renewed

				 		var renewLink = $("#renewalHack").find("a.menuRenew").attr("href");
				 		$(".lib-table table:contains('Checked Out Items')").find("a:contains(" + renewNo + ")").removeClass('editlink').attr("href", renewLink).attr("id", "lib-renew").text("Renew (" + renewNo + ")");

				 	}

				 } else {
					$(".lib-table table:contains('Checked Out Items')").find("a:contains(" + renewNo + ")").removeClass('editlink').text("No Renewals (" + renewNo + ")");
				 }

			});

		});
		}

	var renewalPage = $(".lib-table").find("td:contains('Renewals Allowed')").next("td").text();

	if(renewalPage == "Yes") { // Hide renewal button if renewals are not allowed during the time period

		var renewDate = $(".lib-table").find("table td:contains('Due Date')").next("td").text();

		// Calculate whether it is currently 7 days before or after the due date to know if the request will go through

				 	var newDate = Date.parse(renewDate);
				 	newDate = newDate / 1000;
				 	var currentDate = Math.round((new Date()).getTime() / 1000);

				 	var diff = newDate - currentDate;

				 	if(diff > 604800 || diff < 0) { // Not during renewal period

				 		$("a.menuRenew:contains('Renew Request')").hide();
				 		$(".lib-table").find("td:contains('Renewals Allowed')").next("td").text("Yes - 7 days before or after Due Date");

				 	} else {
				 		$("a.menuRenew:contains('Renew Request')").text("Request Renewal");
				 	}

	}


	$("#transactionMenu a.menuRenew").click(function() { // Add notification that item will be canceled.
			alert("We&#8217;ll try to renewal this. If the lender says no, we&#8217;ll email you.");
		});

		$("#lib-renew").click(function() { // Add notification that item will be canceled.
			alert("We&#8217;ll try to renewal this. If the lender says no, we&#8217;ll email you.");
		});

	if(($(".row-header:contains('Transaction Information')").length > 0)) {

		// This is the detail page.

		function getUrlVars() {
    		var vars = {};
    		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        		vars[key] = value;
    		});
    		return vars;
		}

		// Why the transaction number is not listed here is beyond me. Let's fix that.
		var transactionNumber = getUrlVars()["Value"];

		$(".row-header:contains('Transaction Information')").find("th").text("Details for Transaction No. " + transactionNumber);

		// ALso the alert is dumb here. Hide it.
		$(".statusNormal").hide();

	}

	if(($(".row-header:contains('Request Information')").length > 0)) {

		// This is the detail page.

		function getUrlVars() {
    		var vars = {};
    		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        		vars[key] = value;
    		});
    		return vars;
		}

		// Why the transaction number is not listed here is beyond me. Let's fix that.
		var transactionNumber = getUrlVars()["Value"];

		$(".row-header:contains('Request Information')").find("th").text("Details for Transaction No. " + transactionNumber);

		// ALso the alert is dumb here. Hide it.
		$(".statusNormal").hide();

	}

	if($("#main_menu").length > 0) {

		var emptyTables = 0, numArticles, numRequests, numBooks, articleWidth, requestWidth, bookWidth;



		if(($("#electronic-articles").length > 0) && ($("#electronic-articles").find(".row-message").find("td").text() == "No Electronic Articles Received")) {

				// Home page and no electronic articles are there

				emptyTables = emptyTables + 1;
				numArticles = 0;

				$("#electronic-articles").hide();

		}

		if(($("#outstanding-requests").length > 0) && ($("#outstanding-requests").find(".row-message").find("td").text() == "No Requests")) {

				// Home page and no electronic articles are there

				emptyTables = emptyTables + 1;
				numRequests = 0;

				$("#outstanding-requests").hide();

		}

		if(($("#checkedout-items").length > 0) && ($("#checkedout-items").find(".row-message").find("td").text() == "No Items")) {

				// Home page and no electronic articles are there

				emptyTables = emptyTables + 1;
				numBooks = 0;

				$("#checkedout-items").hide();

		}

		// What to show when there are no tables on the home page

		if(emptyTables == 3) {

			// Everything has been hidden! Quick, show something!

			$("#main").prepend('<h2 class="padding-none">You have no requests</h2><p>Document Delivery can get you electronic copies of articles and book chapters that <abbr title="Grand Valley State University">GVSU</abbr> doesn&#8217;t have online in a few days, or borrow books and more from other libraries, usually within a week.</p><p><div><a href="https://gvsu.illiad.oclc.org/illiad/illiad.dll?Action=10&amp;Form=22" class="btn btn-primary btn-lg">Request an Item Now</a></div></p><p><small>Need a book fast? <a href="http://elibrary.mel.org/search">Get it directly from another Michigan Library.</a></small></p>');

		} else {

			function getItemNumbers(idDiv) {

				return $(idDiv).find("tbody").find("tr").length;

			}

			// Show the dashboard graph

				// Get number of items for each item type

				if(numArticles == 0) {

					totalArticles = 0;
					articleLabel = 'Electronic Articles';

				} else {

					totalArticles = getItemNumbers("#electronic-articles");
					articleLabel = '<a href="#electronic-articles">Electronic Articles</a>';
				}

				if(numRequests == 0) {

					totalRequests = 0;
					requestLabel = 'Outstanding Requests';

				} else {

					totalRequests = getItemNumbers("#outstanding-requests");
					requestLabel = '<a href="#outstanding-requests">Outstanding Requests</a>';
				}

				if(numBooks == 0) {

					totalBooks = 0;
					bookLabel = "Checked Out Items";

				} else {

					totalBooks = getItemNumbers("#checkedout-items");
					bookLabel = '<a href="#checkedout-items">Checked Out Items</a>';

				}

			$("#main_menu").prepend('<style>.dashboard-graph ul { list-style:none;margin:0 !important;padding:0}.dashboard-graph ul li { padding: .8em 1%; border-bottom: 1px solid #bbb; font-size: 1.1em; margin: 0;} .dashboard-graph b { display: inline-block; width: 75%; } .dashboard-graph span.number { display: inline-block; width: 20%; } .dashboard-graph span.graph { display:inline-block;width: 60%; } .dashboard-graph span.chart { display:inline-block; background-color: #069; height: 100%; } .dashboard-graph ul li:first-child { border-top: 1px solid #bbb; }.dashboard-graph ul li:nth-of-type(even) { background-color: #eee; }</style><div class="line"><h3 style="margin-bottom: 0;">Your Document Delivery</h3><div class="row row-gutter"><div class="dashboard-graph col-8 col-sm-12 span2"><ul><li><b>' + articleLabel + ':</b> <span class="number">' + totalArticles + '</span></li><li><b>' + requestLabel + ':</b> <span class="number">' + totalRequests + '</span></li><li><b>' + bookLabel + ':</b> <span class="number">' + totalBooks + '</span></li></ul></div><div class="span1 col-4 col-sm-12" style="text-align: right;"><div style="margin-right: 5%;"><p>Need something? We&#8217;ll get it for you!</p><p><a href="illiad.dll?Action=10&amp;Form=22" class="btn btn-lg btn-primary">Request an Item Now</a></p></div></div></div></div>');

		}
	}

  // Set cookie and show banner about reminder
  // Cookie will show on the first visit to document delivery, and then will be hidden for 6 months if dismissed.



  if(readCookie('noPreview') !== 'prevent') {

    console.log('Showing reminder banner');

    var newBanner = '<div id="update-info" class="update-info alert alert-info"> <h2>Have you updated your account in Document Delivery?</h2> <p>myName, email, address, and phone number changes in Banner don&#8217;t affect your Document Delivery account. Please take a moment to <a href="https://gvsu.illiad.oclc.org/illiad/illiad.dll?Action=10&Form=81" class="close">update your information now</a>.</p> <ul style="list-style: none; margin-top: 1em; margin-left: 0;"> <li style="float: left;"><a href="https://gvsu.illiad.oclc.org/illiad/illiad.dll?Action=10&Form=81" class="close btn btn-primary" id="gvsu-preview">Review my account</a></li> <li style="float: right;"><a href="#" class="btn btn-default close-preview">No thanks</a></li> </ul><div style="clear:both;"</div></div>';

    $("#main").prepend(newBanner);
    $('.close-preview').click(function() {
      createCookie('noPreview','prevent',7);
    });



  } else {
  console.log('Cookie preventing reminder banner.');
  }

 
 if(readCookie('nomyName') !== 'prevent') {
 	 $('.close-myName').click(function() {
      createCookie('nomyName','prevent',7);
      $('#myName-banner').hide();
    });
 	 console.log('Showing myName banner');
 } else {
  	$('#myName-banner').hide();
  	console.log('Cookie preventing myName banner.');
 }

});


  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-2700108-12']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
