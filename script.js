$(
	function () {
		$(document).keydown(
			function (event) {
				Typer.addText(event); // Capture the keydown event and call the addText, this is executed on page load
			});
	});

var Typer = {
	text: null,
	accessCountimer: null,
	index: 0, // Current cursor position
	speed: 1, // Speed of the Typer
	file: "", // File, must be set
	accessCount: 0, // Times alt is pressed for Access Granted
	deniedCount: 0, // Times caps is pressed for Access Denied
	init: function () { // Initialize Automatic Typer
		this.accessCountimer = setInterval(function () { Typer.updLstChr(); }, 500); // Initialize timer for blinking cursor
		$.get(Typer.file, function (data) { // Get the text file
			Typer.text = data; // Save the textfile in Typer.text
		});
	},

	content: function () {
		return $("#console").html(); // Get console content
	},

	write: function (str) { // Append to console content
		$("#console").append(str);
		return false;
	},

	addText: function (key) {// Main function to add the code
		var console = document.getElemenyById("console");
		if (Typer.text) { // Otherwise if text is loaded
			var cont = Typer.content(); // Get the console content
			if (cont.substring(cont.length - 1, cont.length) === "|") // If the last char is the blinking cursor
				console.html(console.html().substring(0, cont.length - 1)); // Remove it before adding the text
			if (key.key !== 'Backspace') { // If key is not backspace
				Typer.index += Typer.speed;	// Add to the index the speed
			} else {
				if (Typer.index > 0) // Else if index is not less than 0
					Typer.index -= Typer.speed; // Remove speed for deleting text
			}
			var text = $("<div/>").text(Typer.text.substring(0, Typer.index)).html(); // Parse the text for stripping html entities
			var rtn = new RegExp("\n", "g"); // Newline regex
			var rts = new RegExp("\\s", "g"); // Whitespace regex
			var rtt = new RegExp("\\t", "g"); // Tab regex
			console.html(text.replace(rtn, "<br/>").replace(rtt, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(rts, "&nbsp;")); // Replace newline chars with br, tabs with 4 space and blanks with an html blank
			window.scrollBy(0, 50); // Scroll to make sure bottom is always visible
		}
		if (key.preventDefault && key.key !== 'F11') { // Prevent F11(fullscreen) from being blocked
			key.preventDefault()
		}
		if (key.key !== 'F11') { // Otherwise prevent keys default behavior
			key.returnValue = false;
		}
	},

	updLstChr: function () { // Blinking cursor
		var terminal = $("#console");
		var cont = this.content(); // Get terminal
		if (cont.substring(cont.length - 1, cont.length) === "|") // If last char is the cursor
			terminal.html(terminal.html().substring(0, cont.length - 1)); // Remove it
		else
			this.write("|"); // Else write it
	}
}
