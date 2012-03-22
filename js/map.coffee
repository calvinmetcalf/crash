fusion = ->
  m = new @google.maps.Map(document.getElementById("map"),
    center: center
    zoom: zoom
    mapTypeId: "roadmap"
  )
  mainLayer = new @google.maps.FusionTablesLayer(tid)
  mainLayer.setQuery "SELECT " + geom + " FROM " + tid + " WHERE 'map' = 'All Clusters 2007-2009'"
  mainLayer.setMap m
  @google.maps.event.addListener m, "zoom_changed", ->
    zoomLevel = m.getZoom()
    if zoomLevel >= 13
      geom = "poly"
    else
      geom = "point"
    changeMap()
  popLists()
geocode = ->
  address = document.getElementById("address").value
  geocoder.geocode
    address: address
  , (results, status) ->
    if status is @google.maps.GeocoderStatus.OK
      m.setCenter results[0].geometry.location
      m.setZoom 14
      marker = new @google.maps.Marker(
        map: m
        position: results[0].geometry.location
      )
    else
      alert "Geocode was not successful for the following reason: " + status
resetgeo = ->
  m.setCenter center
  m.setZoom zoom
  marker.setMap null
popLists = ->
  queryRPAText = encodeURIComponent("SELECT 'RPA', COUNT() FROM " + tid + " GROUP BY 'RPA'")
  queryRPA = new @google.visualization.Query("http://www.google.com/fusiontables/gvizdata?tq=" + queryRPAText)
  queryRPA.send getRPAData
  queryMuniText = encodeURIComponent("SELECT 'Municipality', COUNT() FROM " + tid + " GROUP BY 'Municipality'")
  queryMuni = new @google.visualization.Query("http://www.google.com/fusiontables/gvizdata?tq=" + queryMuniText)
  queryMuni.send getMuniData
  queryHighwayDistrictText = encodeURIComponent("SELECT 'MassDOT District', COUNT() FROM " + tid + " GROUP BY 'MassDOT District'")
  queryHighwayDistrict = new @google.visualization.Query("http://www.google.com/fusiontables/gvizdata?tq=" + queryHighwayDistrictText)
  queryHighwayDistrict.send getHighwayDistrictData
MakeData = (selectID, querryText) ->
  getData = (response) ->
    numRows = response.getDataTable().getNumberOfRows()
    typeSelect = document.getElementById(selectID)
    i = 0
    while i < numRows
      ftData = response.getDataTable().getValue(i, 0)
      unless ftData
        continue
      else if String(ftData).indexOf(",") > -1
        continue
      else
        newoption = document.createElement("option")
        newoption.setAttribute "value", querryText + ftData + "'"
        newoption.innerHTML = ftData
        typeSelect.appendChild newoption
      i++
  getData
changeMap = ->
  mapName = document.getElementById("mapName").value.replace("'", "\\'")
  rpa = document.getElementById("rpa").value.replace("'", "\\'")
  muni = document.getElementById("muni").value.replace("'", "\\'")
  highwayDistrict = document.getElementById("highwayDistrict").value.replace("'", "\\'")
  mainLayer.setQuery "SELECT " + geom + " FROM " + tid + mapName + rpa + muni + highwayDistrict
m = undefined
tid = 1685213
geocoder = new @google.maps.Geocoder()
zoom = 8
center = new @google.maps.LatLng(42.04113400940814, -71.795654296875)
marker = undefined
mainLayer = undefined
geom = "point"
$ ->
  $("#tabs").tabs
    collapsible: true
    selected: -1

  $("input:submit,input:reset").button()
  $("input, textarea").placeholder()
  fusion()
  

google.load "visualization", "1", {}
getRPAData = MakeData("rpa", " AND 'RPA' CONTAINS '")
getMuniData = MakeData("muni", " AND 'Municipality' CONTAINS '")
getHighwayDistrictData = MakeData("highwayDistrict", " AND 'MassDOT District' = '")