/*
includes elements derived from google maps javascript and fusion table api references 
http://code.google.com/apis/maps/documentation/javascript/examples/index.html and http://code.google.com/apis/fusiontables/docs/sample_code.html
both at least the fusion and probobly the maps are lisensed under the apache license, available here http://www.apache.org/licenses/LICENSE-2.0.html
the exception is the dropdown menus which was based on the OSM SlippyMap Generator http://osmtools.de/easymap/
*/
var map;
var geocoder;
var layer;
var tableid = 1685213;
var month;
var zoom = 8;
var defaultCenter = new google.maps.LatLng(42.04113400940814, -71.795654296875);
var geocoder = new google.maps.Geocoder();

function initialize(){
  map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: defaultCenter, 
        zoom: zoom,

    mapTypeId: google.maps.MapTypeId.ROADMAP,
     mapTypeControl: true,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
    }
  });

layer = new google.maps.FusionTablesLayer(tableid);
  layer.setQuery("SELECT 'point' FROM " + tableid + " WHERE 'map' LIKE 'All Clusters 2007-2009'");
  layer.setMap(map);
var homeControlDiv = document.createElement('DIV');
  var homeControl = new HomeControl(homeControlDiv, map);
google.maps.event.addListener(map, 'zoom_changed', function() {
    zoomLevel = map.getZoom();
    if (zoomLevel >= 13) {
  document.getElementById("geom").selected=true;
  changeMap();
      // Show a finer geometry when the map is zoomed in
    }
    else 
    {
     document.getElementById("pt").selected=true;
     changeMap();
    }
   });
  homeControlDiv.index = 1;
map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(homeControlDiv);
var homeControlerDiv = document.createElement('DIV');
  var homeControler = new HomeControler(homeControlerDiv, map);

  homeControlerDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(homeControlerDiv);

 var jbstate = document.getElementById('description2').className;
 if  (jbstate != 'hide') {
 document.getElementById('description2').className = 'hide';
 document.getElementById('descriptionbox').className = '';
}
}

function zoomtoaddress() {

  // Use the geocoder to geocode the address
  geocoder.geocode( { 'address': document.getElementById("address").value }, function(results, status) {
    // If the status of the geocode is OK
    if (status == google.maps.GeocoderStatus.OK) {
      // Change the center and zoom of the map
      map.setCenter(results[0].geometry.location);
      map.setZoom(14);
      
      // OPTIONAL: find the new map bounds, and run a spatial query to return
      // Fusion Tables results within those bounds. 
    
    } 
  });
}

// Reset the zoom, center, and FusionTablesLayer query
function reset() {
  map.setCenter(defaultCenter);
  map.setZoom(zoom);
  }

// Register Enter key press to submit form
window.onkeypress = enterSubmit;
function enterSubmit() {
  if(event.keyCode==13) {
    zoomtoaddress();
  }
}
function changeMap() {
  var column1 = document.getElementById('c1').value.replace("'", "\\'");
var column2 = document.getElementById('c2').value.replace("'", "\\'");
var column3 = document.getElementById('c3').value.replace("'", "\\'");
var column4 = document.getElementById('c4').value.replace("'", "\\'");
var column5 = document.getElementById('c5').value.replace("'", "\\'");
  
  layer.setQuery("SELECT " + column1 + " FROM " + tableid + " WHERE" + column4 + column2 + column3 +  column5);
 
}

function HomeControl(controlDiv, map) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('DIV');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'left';
  controlUI.title = 'Legend';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('DIV');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '1em';
  controlText.style.paddingRight = '1em';
  controlText.innerHTML = '<b>Equivalent Property<br />Damage Only (EPDO)</b><ul style="list-type:circle;margin:0;padding-left:1em;paddding-top:0;"><li style="list-style-image:url(smallblue.png);">Less then 50</li><li style="list-style-image:url(smallgreen.png);">50-150</li><li style="list-style-image:url(smallyellow.png);">150-300</li><li style="list-style-image:url(smallred.png);">More then 300</li></ul><a href="http://www.google.com/fusiontables/DataSource?dsrcid=1685213" target="_blank" tabindex="90">View on Google<br /> Fusion Tables</a><br/><a href="https://www.google.com/fusiontables/api/query?sql=SELECT+*+FROM+1685213" target="_blank" tabindex="95">Download the file</a>';
  controlUI.appendChild(controlText);
}

function HomeControler(controlerDiv, map) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlerDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlerUI = document.createElement('DIV');
  
  
  controlerUI.style.cursor = 'pointer';
  controlerUI.style.textAlign = 'center';
  controlerUI.title = 'MassDOT logo';
  controlerDiv.appendChild(controlerUI);

  // Set CSS for the controler interior
  var controlerText = document.createElement('DIV');
  controlerText.style.fontFamily = 'Arial,sans-serif';
  controlerText.style.fontSize = '12px';
  controlerText.style.paddingLeft = '4px';
  controlerText.style.paddingRight = '4px';
  controlerText.innerHTML = '<a href="http://www.massdot.state.ma.us/planning" tabindex="96"><img src="200px-Planninglogo_svg.png" width="200" alt="logo and link home" border="0"/></a>';
  controlerUI.appendChild(controlerText);

  // Setup the click event listeners: simply set the map to Chicago
  
}
/*function addOption_list(){
var queryText1 = encodeURIComponent("SELECT 'ProjectNum', COUNT() FROM " + tableid + " GROUP BY 'ProjectNum'");
		var query1 = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryText1);
			query1.send(getData1);
var queryText2 = encodeURIComponent("SELECT 'PrjPrgress', COUNT() FROM " + tableid + " GROUP BY 'PrjPrgress'");
		var query2 = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryText2);
			query2.send(getData2);
var queryText3 = encodeURIComponent("SELECT 'Department', COUNT() FROM " + tableid + " GROUP BY 'Department'");
		var query3 = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryText3);
			query3.send(getData3);
var queryText4 = encodeURIComponent("SELECT 'BudgetSrc', COUNT() FROM " + tableid + " GROUP BY 'BudgetSrc'");
		var query4 = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryText4);
			query4.send(getData4);
}
function getData1(response) {
  
  // Get the number of rows
  numRows = response.getDataTable().getNumberOfRows();
  
  // Add options to the select menu based on the results
  oneSelect = document.getElementById("c1");  
  for(i = 0; i < numRows; i++) {
  	newoption = document.createElement('option');
 	newoption.setAttribute('value',"AND 'ProjectNum' like '" + response.getDataTable().getValue(i, 0) + "'");
  	newoption.innerHTML = response.getDataTable().getValue(i, 0);
  	oneSelect.appendChild(newoption);
  }  
}
function getData2(response) {
  
  // Get the number of rows
  numRows = response.getDataTable().getNumberOfRows();
  
  // Add options to the select menu based on the results
  twoSelect = document.getElementById("c2");  
  for(i = 0; i < numRows; i++) {
  	newoption = document.createElement('option');
  	newoption.setAttribute('value',"AND 'PrjPrgress' like '" + response.getDataTable().getValue(i, 0) + "'");
  	newoption.innerHTML = response.getDataTable().getValue(i, 0);
  	twoSelect.appendChild(newoption);
  }  
}
function getData3(response) {
  
  // Get the number of rows
  numRows = response.getDataTable().getNumberOfRows();
  
  // Add options to the select menu based on the results
  threeSelect = document.getElementById("c3");  
  for(i = 0; i < numRows; i++) {
  	newoption = document.createElement('option');
  	newoption.setAttribute('value',"AND 'Department' like '" + response.getDataTable().getValue(i, 0) + "'");
  	newoption.innerHTML = response.getDataTable().getValue(i, 0);
  	threeSelect.appendChild(newoption);
  }  
}
function getData4(response) {
  
  // Get the number of rows
  numRows = response.getDataTable().getNumberOfRows();
  
  // Add options to the select menu based on the results
  fourSelect = document.getElementById("c4");  
  for(i = 0; i < numRows; i++) {
  	newoption = document.createElement('option');
  	newoption.setAttribute('value',"AND 'BudgetSrc' like '" + response.getDataTable().getValue(i, 0) + "'");
  	newoption.innerHTML = response.getDataTable().getValue(i, 0);
  	fourSelect.appendChild(newoption);
  }  
}*/
function SelectAll(id)
{
    document.getElementById(id).focus();
    document.getElementById(id).select();
}
var showPopupOnHover = false;
text = new Array("Search","Hide");
function toggleInfo() {
	var state = document.getElementById('description').className;
	if (state == 'hide') {
		// Info anzeigen
		document.getElementById('description').className = '';
		document.getElementById('descriptionToggle').innerHTML = text[1];
		document.getElementById('description1').className = 'hide';
		document.getElementById('descriptionToggle1').innerHTML = text1[0];
		document.getElementById('description3').className = 'hide';
		document.getElementById('descriptionToggle3').innerHTML = text3[0];	
			}
	else {
		// Info verstecken
		document.getElementById('description').className = 'hide';
		document.getElementById('descriptionToggle').innerHTML = text[0];
	}	
}
text1 = new Array("Query","Hide");
function toggleInfo1() {
	var state = document.getElementById('description1').className;
	if (state == 'hide') {
		// Info anzeigen
		document.getElementById('description1').className = '';
		document.getElementById('descriptionToggle1').innerHTML = text1[1];
		document.getElementById('description').className = 'hide';
		document.getElementById('descriptionToggle').innerHTML = text[0];
		document.getElementById('description3').className = 'hide';
		document.getElementById('descriptionToggle3').innerHTML = text3[0];	}
	else {
		// Info verstecken
		document.getElementById('description1').className = 'hide';
		document.getElementById('descriptionToggle1').innerHTML = text1[0];
	}	
}
text3 = new Array("Map","Hide");
function toggleInfo3() {
	var state = document.getElementById('description3').className;
	if (state == 'hide') {
		// Info anzeigen
		document.getElementById('description3').className = '';
		document.getElementById('descriptionToggle3').innerHTML = text3[1];
		document.getElementById('description').className = 'hide';
		document.getElementById('descriptionToggle').innerHTML = text[0];	
				document.getElementById('description1').className = 'hide';
		document.getElementById('descriptionToggle1').innerHTML = text1[0];	}

	else {
		// Info verstecken
		document.getElementById('description3').className = 'hide';
		document.getElementById('descriptionToggle3').innerHTML = text3[0];
	}	
}
function entertoggle(){
  if(event.keyCode==13) {
   toggleInfo();
  }
}
function entertoggle1(){
  if(event.keyCode==13) {
   toggleInfo1();
  }
}
function entertoggle3(){
  if(event.keyCode==13) {
   toggleInfo3();
  }
}