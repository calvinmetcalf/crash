$ ->
  $("#tabs").tabs
    collapsible: true
    selected: -1

  $("input:submit,input:reset").button()
  #$("input, textarea").placeholder()
m = new L.Map("map",
    center: new L.LatLng(42.2, -71)
    zoom: 8
    attributionControl: true
)
h=new L.Hash(m)
defaultLayer = L.tileLayer.mapQuestOpen.osm()
m.addLayer defaultLayer
oef=(v, l)->
    l.bindPopup "Crash Count: "+v.properties.CrashCount+"<br/>EPDO: "+v.properties.EPDO+"<br/>FATAL: "+v.properties.FATAL+"<br/>INJURY: "+v.properties.INJURY+"<br/>NONINJ: "+v.properties.NONINJ+"<br/>Map: "+v.properties.Map+"<br/>RANK: "+v.properties.RANK
filter=
    HSIP:(v, l)->
        v.properties.Map=="HSIP"
    BIKE:(v, l)->
        v.properties.Map=="BIKE"
    PED:(v, l)->
        v.properties.Map=="PED"
    RANK:(v, l)->
        v.properties.Map=="HSIP" and v.properties.RANK>0
HSIP = new L.MarkerClusterGroup({disableClusteringAtZoom:15})
BIKE = new L.MarkerClusterGroup({disableClusteringAtZoom:14})
PED = new L.MarkerClusterGroup({disableClusteringAtZoom:14})
TOP200 = new L.MarkerClusterGroup({disableClusteringAtZoom:15})
pHSIP = L.geoJson('',{onEachFeature:oef,filter:filter.HSIP})
pBIKE = L.geoJson('',{onEachFeature:oef,filter:filter.BIKE})
pPED = L.geoJson('',{onEachFeature:oef,filter:filter.PED})
pTOP200 = L.geoJson('',{onEachFeature:oef,filter:filter.RANK})
baseLayers =
    "OpenStreetMap Default": L.tileLayer.openStreetMap.mapnik()
    "OpenStreetMap German Style": L.tileLayer.openStreetMap.de()
    "MapQuest OSM": defaultLayer

m.addControl L.control.layers(baseLayers,'',{collapsed: false}) 

parseJSON=(d)->
    $.each d.features, (i,v)->
            marker =new L.Marker [v.geometry.coordinates[1],v.geometry.coordinates[0]],{title:v.properties.GroupCode}
            marker.bindPopup "Crash Count: "+v.properties.CrashCount+"<br/>EPDO: "+v.properties.EPDO+"<br/>FATAL: "+v.properties.FATAL+"<br/>INJURY: "+v.properties.INJURY+"<br/>NONINJ: "+v.properties.NONINJ+"<br/>RANK: "+v.properties.RANK
            HSIP.addLayer marker if v.properties.Map=="HSIP"
            BIKE.addLayer marker if v.properties.Map=="BIKE"
            PED.addLayer marker if v.properties.Map=="PED"
            TOP200.addLayer marker if v.properties.Map=="HSIP" and v.properties.RANK>0
parsePoly=(d)->
    pHSIP.addData d
    pBIKE.addData d
    pPED.addData d
    pTOP200.addData d

$.get "point.json",parseJSON

$.get "poly-simp.json",parsePoly

bZ=()->
    z= m.getZoom()
    if z > 14
        m.removeLayer BIKE  if m.hasLayer(BIKE)
        m.addLayer pBIKE  unless m.hasLayer(pBIKE)
    else if z <= 14
        m.removeLayer pBIKE  if m.hasLayer(pBIKE)
        m.addLayer BIKE  unless m.hasLayer(BIKE)
pZ=()->
    z= m.getZoom()
    if z > 14
        m.removeLayer PED  if m.hasLayer(PED)
        m.addLayer pPED  unless m.hasLayer(pPED)
    else if z <= 14
        m.removeLayer pPED  if m.hasLayer(pPED)
        m.addLayer PED  unless m.hasLayer(PED)
hZ=()->
    z= m.getZoom()
    if z > 15
        m.removeLayer HSIP  if m.hasLayer(HSIP)
        m.addLayer pHSIP  unless m.hasLayer(pHSIP)
    else if z <= 15
        m.removeLayer pHSIP  if m.hasLayer(pHSIP)
        m.addLayer HSIP  unless m.hasLayer(HSIP)
rZ=()->
    z= m.getZoom()
    if z > 15
        m.removeLayer TOP200  if m.hasLayer(TOP200)
        m.addLayer pTOP200  unless m.hasLayer(pTOP200)
    else if z <= 15
        m.removeLayer pTOP200  if m.hasLayer(pTOP200)
        m.addLayer TOP200  unless m.hasLayer(TOP200)
cL="HSIP"
hZ()
rmAll=()->
    z= m.getZoom()
    if z <= 15
        m.removeLayer HSIP  if m.hasLayer(HSIP)
        m.removeLayer TOP200  if m.hasLayer(TOP200)
    else if z > 15
        m.removeLayer pBIKE  if m.hasLayer(pBIKE)
        m.removeLayer pPED  if m.hasLayer(pPED)
    if z <= 14
        m.removeLayer BIKE  if m.hasLayer(BIKE)
        m.removeLayer PED  if m.hasLayer(PED)
    else if z > 14
        m.removeLayer pBIKE  if m.hasLayer(pBIKE)
        m.removeLayer pPED  if m.hasLayer(pPED)
z=()->
    hZ() if cL=="HSIP"
    bZ() if cL=="BIKE"
    pZ() if cL=="PED"
    rZ() if cL=="TOP200"
changeLayer=(l)->
    rmAll()
    cL=l
    z()
m.on "zoomend", z
chMap=()->
    changeLayer $("#getMap").val()
    return true
$("#getMap").change(chMap)

geocode = ->
  old.center = m.getCenter()
  old.zoom = m.getZoom()
  address = $("#address").val()
  gURL = "http://open.mapquestapi.com/nominatim/v1/search?countrycodes=us&exclude_place_ids=955483008,950010827&viewbox=-76.212158203125%2C44.46123053905882%2C-66.005859375%2C40.107487419012415&bounded=1&format=json&q="
  $.ajax
    type: "GET"
    url: gURL + address
    dataType: "jsonp"
    jsonp: "json_callback"
    success: (data, textStatus) ->
      if textStatus is "success"
        latlng = new L.LatLng(data[0].lat, data[0].lon)
        gMarker.setLatLng latlng
        m.addLayer gMarker
        m.setView latlng, 17

  false
resetgeo = ->
  m.removeLayer gMarker
  m.setView old.center, old.zoom
gMarker = new L.Marker()
old = {}
$("#geocoder").submit geocode
$("#resetgeo").click resetgeo