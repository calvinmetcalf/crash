var m;
var tid = 1685213;
var geocoder = new google.maps.Geocoder();
var zoom = 8;
var center = new google.maps.LatLng(42.04113400940814,-71.795654296875);
var marker;
var mainLayer;
var geom = "point";

$(function() {
        $( "#tabs" ).tabs({
        	collapsible: true,
            selected: -1
		});
        $( "input:submit,input:reset" ).button();
        $('input, textarea').placeholder();
        fusion();
        popLists();
	});


function fusion() {
    
  m = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: zoom,
      mapTypeId: 'roadmap'
    });

 mainLayer = new google.maps.FusionTablesLayer(tid);
  mainLayer.setQuery("SELECT " + geom + " FROM " + tid + " WHERE 'map' = 'All Clusters 2007-2009'");
  mainLayer.setMap(m);
  
  google.maps.event.addListener(m, 'zoom_changed', function() {
     var zoomLevel = m.getZoom();
      if (zoomLevel >13){
          geom = "poly";
      }
      else
      {
          geom = "point";
      }
 
  changeMap();
   });
  }

function geocode() {
     var address = document.getElementById("address").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        m.setCenter(results[0].geometry.location);
        m.setZoom(14);
     marker = new google.maps.Marker({
            map: m, 
            position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}

function resetgeo() {
    
    m.setCenter(center);
    m.setZoom(zoom);
marker.setMap(null);
}
    
    google.load('visualization', '1', {});
    
function popLists(){    

    var queryRPAText = encodeURIComponent("SELECT 'RPA', COUNT() FROM " + tid + " GROUP BY 'RPA'");
    var queryRPA = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryRPAText);
	queryRPA.send(getRPAData);
    
    var queryMuniText = encodeURIComponent("SELECT 'Municipality', COUNT() FROM " + tid + " GROUP BY 'Municipality'");
    var queryMuni = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryMuniText);
	queryMuni.send(getMuniData);
            
    var queryHighwayDistrictText = encodeURIComponent("SELECT 'MassDOT District', COUNT() FROM " + tid + " GROUP BY 'MassDOT District'");
	var queryHighwayDistrict = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryHighwayDistrictText);
	queryHighwayDistrict.send(getHighwayDistrictData);
}


function MakeData(selectID,querryText){

function getData(response) {
  // Get the number of rows
var numRows = response.getDataTable().getNumberOfRows();
  
  // Add options to the select menu based on the results
 var typeSelect = document.getElementById(selectID);  
  for(i = 0; i < numRows; i++) {
      var ftData = response.getDataTable().getValue(i, 0);
      if (!ftData)
     { continue;}
     else if
     (String(ftData).indexOf(",")>-1)
     {continue;}
     else
     { var newoption = document.createElement('option');
      newoption.setAttribute('value',querryText + ftData + "'");
    newoption.innerHTML = ftData;
    typeSelect.appendChild(newoption);}
  }  
}
return getData;
}

var getRPAData = MakeData("rpa"," AND 'RPA' CONTAINS '");
var getMuniData = MakeData("muni", " AND 'Municipality' CONTAINS '");
var getHighwayDistrictData = MakeData("highwayDistrict"," AND 'MassDOT District' = '");


function changeMap() {
  var mapName = document.getElementById('mapName').value.replace("'", "\\'");
  var rpa = document.getElementById('rpa').value.replace("'", "\\'");
  var muni = document.getElementById('muni').value.replace("'", "\\'");
  var highwayDistrict = document.getElementById('highwayDistrict').value.replace("'", "\\'");
  mainLayer.setQuery("SELECT " + geom + " FROM " + tid + mapName + rpa + muni + highwayDistrict);
 
}