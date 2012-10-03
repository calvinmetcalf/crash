m = new L.Map("map",
    center: new L.LatLng(42.2, -71)
    zoom: 8
    attributionControl: true
)
h=new L.Hash(m)
defaultLayer = new L.TileLayer.MapQuestOpen.OSM
m.addLayer defaultLayer
opts=
    onEachFeature:(v, l)->
        l.bindPopup "Crash Count: "+v.properties.CrashCount+"<br/>EPDO: "+v.properties.EPDO+"<br/>FATAL: "+v.properties.FATAL+"<br/>INJURY: "+v.properties.INJURY+"<br/>NONINJ: "+v.properties.NONINJ+"<br/>Map: "+v.properties.Map+"<br/>RANK: "+v.properties.RANK
crash = new L.MarkerClusterGroup()
poly = L.geoJson('',opts)
baseLayers =
    "OpenStreetMap Default": new L.TileLayer.OpenStreetMap.Mapnik
    "OpenStreetMap German Style": new L.TileLayer.OpenStreetMap.DE
    "MapQuest OSM": defaultLayer

m.addControl L.control.layers(baseLayers,'',{collapsed: false}) 

parseJSON=(d)->
    $.each d.features, (i,v)->
            marker =new L.Marker [v.geometry.coordinates[1],v.geometry.coordinates[0]],{title:v.properties.GroupCode}
            marker.bindPopup "Crash Count: "+v.properties.CrashCount+"<br/>EPDO: "+v.properties.EPDO+"<br/>FATAL: "+v.properties.FATAL+"<br/>INJURY: "+v.properties.INJURY+"<br/>NONINJ: "+v.properties.NONINJ+"<br/>Map: "+v.properties.Map+"<br/>RANK: "+v.properties.RANK
            crash.addLayer marker
parsePoly=(d)->
    poly.addData d

$.get "point.json",parseJSON

$.get "poly-simp.json",parsePoly

cZ=()->
    z= m.getZoom()
    if z > 14
        m.removeLayer crash  if m.hasLayer(crash)
        m.addLayer poly  unless m.hasLayer(poly)
    else if z <= 14
        m.removeLayer poly  if m.hasLayer(poly)
        m.addLayer crash  unless m.hasLayer(crash)
cZ()
m.on "zoomend", cZ