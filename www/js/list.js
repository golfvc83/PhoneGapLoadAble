var bigScreenOverlayPercentage = "20%";
var smallScreenOverlayPercentage = "70%";
function openNav() {
	
	if($("#mySidenav")[0].style.width == "0px"){
			$("#mySidenav").css({"visibility": ""});
			//$("#canvasRow").removeClass('col-lg-offset-1');
			//$("#canvasRow").addClass('col-lg-offset-3');
			$("#canvasRow").switchClass("col-lg-offset-1", "col-lg-offset-3", 700);
		if(screen.width > 400){
			 //$("#mySidenav")[0].style.width = bigScreenOverlayPercentage;
			 //$("#header")[0].style.marginLeft = bigScreenOverlayPercentage;
			 $("#mySidenav").animate({"width": bigScreenOverlayPercentage});
			 $("#header").animate({marginLeft:bigScreenOverlayPercentage});
		}else{
			$("#mySidenav").animate({"width": smallScreenOverlayPercentage});
			$("#header").animate({marginLeft: smallScreenOverlayPercentage});
			//$("#mySidenav")[0].style.width = smallScreenOverlayPercentage;
			//$("#header")[0].style.marginLeft = smallScreenOverlayPercentage;
		}
	}else{
		//document.getElementById("mainrow").style.marginLeft = "100%";
			$("#mySidenav").animate({"width": ""},function(){$("#mySidenav").css({"visibility": "hidden"});});
			$("#header").animate({marginLeft: ""});
			$("#canvasRow").switchClass('col-lg-offset-3', 'col-lg-offset-1', 700);
			//$("#canvasRow").removeClass('col-lg-offset-3');
			//$("#canvasRow").addClass('col-lg-offset-1');
			//$("#header")[0].style.marginLeft = "";
			//$("#mySidenav")[0].style.width = "";
			
		}
	}

	var ReminderItem = function(status, text, meaning){
		this.status = status; //false is not marked
		this.text = text;
		this.meaning = meaning;
	}
	
	function markAll(){
		
		//this one switch all checkboxes $(':checkbox').prop( "checked", true ).change();
		
		//.change is needed to trigger onchange event for each checkboxes
		$("input:checkbox:not(:checked)").prop( "checked", true ).change();
		//"input:checkbox:not(:checked)" = select all non select checkboxes
	
	}
	
	function unMarkAll(){
		$(':checked').prop( "checked", false ).change();
		
	}
	
	function remove(){
		//select each  checkbox that are checked
		$(':checked').each(function( index ) {
			//go back to <div class = "row">.. </ and remove it 
			var row = this.parentNode.parentNode.parentNode.parentNode;
			//reminderList.splice(row.getAttribute("rownum"), 1);
			reminderList[parseInt(row.getAttribute("rownum"))] = null;
			//row.remove();
		});
		
		
		//recreate list
		$('#list').html('');
		var list = [];
		
		for(var i = 0; i < reminderList.length; i++){
			if(reminderList[i] != null){
				list.push(reminderList[i]); 
			}
		} 
		
		reminderList = list;
		for(var i = 0 ; i< reminderList.length; i++){
			var rendered;
			rendered = Mustache.render(templateUnmarked, {rownum: i, message: reminderList[i].text});
			$('#list').append(rendered);
				//$('#smallList').append(rendered);
				
		}		
		saveList();
	}
	
	
	var templateUnmarked;
	var templateMarked;
	var currentlySelectItem = null;
	var currentRowNum;
	var reminderList;
	
	assignTemplate = function assignTemplate(){
		//resizeKanji();
		var json = localStorage.getItem("KanjiList");
		
		templateUnmarked = document.getElementById('templateUnmarked').innerHTML;
		templateMarked = document.getElementById('templateMarked').innerHTML;
		//templateMarked = $('#templateMarked').html();
		if(json == '[]' || json == null || json == 'undefined'){
			reminderList = [];
			console.log("There is nothing on the list yet");
		}else{
			
			reminderList = JSON.parse(json);
			//var htmlList = $('#list');
			
			for(var i = 0 ; i< reminderList.length; i++){
				var rendered;
				if(!reminderList[i].status){
					rendered = Mustache.render(templateUnmarked, {rownum: i, message: reminderList[i].text});
				}else{
					rendered = Mustache.render(templateMarked, {rownum: i, message: reminderList[i].text});
				}
				
				$('#list').append(rendered);
				//$('#smallList').append(rendered);
				
			}
			findUnmarked();
		}
	}
	
	function onChangeHandler(e){
		//alert('switch');
		var rownum = e.parentNode.parentNode.parentNode.parentNode.getAttribute("rownum");
		var div = e.parentNode.parentNode.parentNode.parentNode.childNodes[3].childNodes[1].childNodes[1];
		//div.nodeValue  = '✖';
		if(div.innerHTML  == " ✖ "){
			div.style.color = "green";
			div.innerHTML  = " ✔ ";
			reminderList[rownum].status = true;
		}else{
			div.style.color = "red";
			div.innerHTML  = " ✖ ";
			reminderList[rownum].status = false;
		}
		
		saveList();
	}
	
	/*function addList(){
		var memo = $('#output').val();
		
		if(memo == ''){
			alert("Please enter a memo in the textbox/area");
			$('#output').focus();
		}else{
			//add to html
			reminderList.push(new ReminderItem(false, memo) );
			var rendered = Mustache.render(templateUnmarked, {rownum: reminderList.length, message: memo});		
			$('#list').append(rendered);
			
		}	
	}*/
	
	//There is still bug here..
	function addToList(){
			var kanjiFromTextBox = $('#output').val();
			if(kanjiFromTextBox.length != 1 ){
				alert("Please, select only one kanji in the textbox to add to list.");
			}else{
			
				var memo = kanjiFromTextBox.trim();
				var meaning = $('#output').attr('meaning');
				//reminderList.push(new ReminderItem(false, memo));
				//json = JSON.stringify(reminderList); 
				//localStorage.setItem("KanjiList", json);
				
				reminderList.push(new ReminderItem(false, memo, meaning) );
				var rendered = Mustache.render(templateUnmarked, {rownum: reminderList.length-1, message: memo});		
				$('#list').append(rendered);
				saveList();
				//window.location.href = "KanjiReminderList.html";
				//alert("kanjiAdded");
				$('#output').val('');
			}
	}
		
	function saveList(){
	
		/*reminderList = [];
		$('#list').find('div.row').each(function( index ) {
			
			//get message of an item 
			var message = this.childNodes[3].childNodes[1].lastChild.wholeText;
			
			//get status
			var status = false;	
			if(this.childNodes[3].childNodes[1].childNodes[1].innerHTML == " ✔ "){
				status = true;
			}
			
			reminderList.push(new ReminderItem(status, message));
			
		});*/
		
		var json = JSON.stringify(reminderList); 
		localStorage.setItem("KanjiList", json);
		
	}
	
	//window.onbeforeload = saveList(reminderList);

	
	function loadTemplate(name, callback){ 
		var rawFile = new XMLHttpRequest();
		rawFile.open('GET', name, true);
		rawFile.overrideMimeType("text/html;");
		rawFile.onreadystatechange= function() {
			if (this.readyState!==4) return;
			if (this.status!==200) return; 
			$('#template').append(this.responseText);
			callback();
			//$('#pagebody').append(this.responseText);
		};
		rawFile.send(null);
		//return template;
	

	}
	
	function initPage(){

		loadTemplate("template.html" , assignTemplate);

	}
	
	function goToCanvas(e){
		//e.style.backgroundColor = '#7a8787';
		if(currentlySelectItem != null){
			currentlySelectItem.style.backgroundColor = '';
		}else{
			//$('.kanjiListPanel')[0].style.visibility = '';
			$('#strict0 font').html('');
			$('#strict0 font')[0].style.visibility	 = '';
		}
		//$('#strict0 font').html(e.children[1].children[0].childNodes[2].nodeValue);
		
		e.style.backgroundColor = '#7a8787';
		currentlySelectItem = e;
		currentRowNum = parseInt(e.getAttribute("rownum"));
		$('#strict0 font').html(reminderList[currentRowNum].meaning);
		$('#strict0 font').css('font-size', '40px');
	}
	