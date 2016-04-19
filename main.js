"use strict";


$(function () {
	
	$("#lookupCompanyBtn").click(lookupCompany);
});

var SymbolsStorage = {

	get: function () {
		try {
			var symbols = JSON.parse(localStorage.symbols)
		} catch (err) { 
			var symbols = []; 
		}
		return symbols;
	},

	write: function (symbols) {
		localStorage.symbols = JSON.stringify(symbols);
	}	
}



function lookupCompany (event) {

	event.preventDefault();
	$(".lookupContainer").empty;

	$.getJSON('http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=' + $("#userInput").val() + '&callback=?')
	.done(function (data) {

		$.each (data, function (i, items) {

			$(".lookupContainer").append($("<div>").addClass("company").text(items.Symbol))

		})
		$(".company").on("dblclick", saveToLocalStorage);
		

	})
	.fail(function (err) {
		console.log("err:", err);
	})

}

function saveToLocalStorage (event) {

	var symbols = SymbolsStorage.get();
	symbols.push($(this).text());
	SymbolsStorage.write(symbols);
	console.log("from saveToLocalStorage: ", SymbolsStorage.get());

	// $(".quoteContainer").empty();
	trackQuotes();
}

function trackQuotes () {
	$(".quoteContainer").empty();
	var arr = SymbolsStorage.get();
	console.log("SymbolsStorage.get():", arr);
	
	for(var i = 0; i < arr.length; i++){

		$.getJSON('http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=' + arr[i] + '&callback=?')
		.done(function (data) {


			var $div = $(".template").clone().removeClass("template");

			$div.append($("<p>").text = "Name: " + data.Name);
			$div.append($("<br>"));
			$div.append($("<p class='symbol'>").text = "Symbol: " + data.Symbol);
			$div.append($("<br>"));
			$div.append($("<p>").text = "High: " + data.High);
			$div.append($("<br>"));
			$div.append($("<p>").text = "Low: " + data.Low);
			$div.append($("<br>"));
			$div.append($("<p>").text = "LastPrice: " + data.LastPrice);
			var $btn = $("<button>").addClass("deleteBtn")
			$btn.text("del");
			$($btn).attr("id", data.Symbol);
			$div.append($btn);
			$(".quoteContainer").append($div);
			$(".deleteBtn").click(deleteQuote);

		})
		.fail(function (err) {
			console.log("err", err);
			$(".quoteContainer").empty;
		})
	}
}

function deleteQuote (event) {

	console.log("delete");

	var symbols = SymbolsStorage.get();
	var index = symbols.indexOf(this.id);

	console.log("index:", index)
	console.log("symbols[index]:", symbols[index])
	symbols.splice(index, 1);

	console.log("symbols: ", symbols);

	SymbolsStorage.write(symbols);
	$(this).closest(".card").remove();

	
}

trackQuotes();





