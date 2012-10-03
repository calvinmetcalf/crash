var BIKE, HSIP, PED, TOP200, bZ, baseLayers, cL, chMap, changeLayer, defaultLayer, filter, gMarker, geocode, h, hZ, m, oef, old, pBIKE, pHSIP, pPED, pTOP200, pZ, parseJSON, parsePoly, rZ, resetgeo, rmAll, z;

$(function() {
  $("#tabs").tabs({
    collapsible: true,
    selected: -1
  });
  return $("input:submit,input:reset").button();
});

m = new L.Map("map", {
  center: new L.LatLng(42.2, -71),
  zoom: 8,
  attributionControl: true
});

h = new L.Hash(m);

defaultLayer = new L.tileLayer.mapQuestOpen.osm();

m.addLayer(defaultLayer);

oef = function(v, l) {
  return l.bindPopup("Crash Count: " + v.properties.CrashCount + "<br/>EPDO: " + v.properties.EPDO + "<br/>FATAL: " + v.properties.FATAL + "<br/>INJURY: " + v.properties.INJURY + "<br/>NONINJ: " + v.properties.NONINJ + v.properties.RANK);
};

filter = {
  HSIP: function(v, l) {
    return v.properties.Map === "HSIP";
  },
  BIKE: function(v, l) {
    return v.properties.Map === "BIKE";
  },
  PED: function(v, l) {
    return v.properties.Map === "PED";
  },
  RANK: function(v, l) {
    return v.properties.Map === "HSIP" && v.properties.RANK > 0;
  }
};

HSIP = new L.MarkerClusterGroup();

BIKE = new L.MarkerClusterGroup();

PED = new L.MarkerClusterGroup();

TOP200 = new L.MarkerClusterGroup();

pHSIP = L.geoJson('', {
  onEachFeature: oef,
  filter: filter.HSIP
});

pBIKE = L.geoJson('', {
  onEachFeature: oef,
  filter: filter.BIKE
});

pPED = L.geoJson('', {
  onEachFeature: oef,
  filter: filter.PED
});

pTOP200 = L.geoJson('', {
  onEachFeature: oef,
  filter: filter.RANK
});

baseLayers = {
  "OpenStreetMap Default":  L.tileLayer.openStreetMap.mapnik(),
  "OpenStreetMap German Style":  L.tileLayer.openStreetMap.de(),
  "MapQuest OSM": defaultLayer
};

m.addControl(L.control.layers(baseLayers, '', {
  collapsed: false
}));

parseJSON = function(d) {
  return $.each(d.features, function(i, v) {
    var marker;
    marker = new L.Marker([v.geometry.coordinates[1], v.geometry.coordinates[0]], {
      title: v.properties.GroupCode
    });
    marker.bindPopup("Crash Count: " + v.properties.CrashCount + "<br/>EPDO: " + v.properties.EPDO + "<br/>FATAL: " + v.properties.FATAL + "<br/>INJURY: " + v.properties.INJURY + "<br/>NONINJ: " + v.properties.NONINJ + "<br/>RANK: " + v.properties.RANK);
    if (v.properties.Map === "HSIP") {
      HSIP.addLayer(marker);
    }
    if (v.properties.Map === "BIKE") {
      BIKE.addLayer(marker);
    }
    if (v.properties.Map === "PED") {
      PED.addLayer(marker);
    }
    if (v.properties.Map === "HSIP" && v.properties.RANK > 0) {
      return TOP200.addLayer(marker);
    }
  });
};

parsePoly = function(d) {
  pHSIP.addData(d);
  pBIKE.addData(d);
  pPED.addData(d);
  return pTOP200.addData(d);
};

$.get("point.json", parseJSON);

$.get("poly-simp.json", parsePoly);

bZ = function() {
  var z;
  z = m.getZoom();
  if (z > 14) {
    if (m.hasLayer(BIKE)) {
      m.removeLayer(BIKE);
    }
    if (!m.hasLayer(pBIKE)) {
      return m.addLayer(pBIKE);
    }
  } else if (z <= 14) {
    if (m.hasLayer(pBIKE)) {
      m.removeLayer(pBIKE);
    }
    if (!m.hasLayer(BIKE)) {
      return m.addLayer(BIKE);
    }
  }
};

pZ = function() {
  var z;
  z = m.getZoom();
  if (z > 14) {
    if (m.hasLayer(PED)) {
      m.removeLayer(PED);
    }
    if (!m.hasLayer(pPED)) {
      return m.addLayer(pPED);
    }
  } else if (z <= 14) {
    if (m.hasLayer(pPED)) {
      m.removeLayer(pPED);
    }
    if (!m.hasLayer(PED)) {
      return m.addLayer(PED);
    }
  }
};

hZ = function() {
  var z;
  z = m.getZoom();
  if (z > 14) {
    if (m.hasLayer(HSIP)) {
      m.removeLayer(HSIP);
    }
    if (!m.hasLayer(pHSIP)) {
      return m.addLayer(pHSIP);
    }
  } else if (z <= 14) {
    if (m.hasLayer(pHSIP)) {
      m.removeLayer(pHSIP);
    }
    if (!m.hasLayer(HSIP)) {
      return m.addLayer(HSIP);
    }
  }
};

rZ = function() {
  var z;
  z = m.getZoom();
  if (z > 14) {
    if (m.hasLayer(TOP200)) {
      m.removeLayer(TOP200);
    }
    if (!m.hasLayer(pTOP200)) {
      return m.addLayer(pTOP200);
    }
  } else if (z <= 14) {
    if (m.hasLayer(pTOP200)) {
      m.removeLayer(pTOP200);
    }
    if (!m.hasLayer(TOP200)) {
      return m.addLayer(TOP200);
    }
  }
};

cL = "HSIP";

hZ();

rmAll = function() {
  var z;
  z = m.getZoom();
  if (z <= 14) {
    if (m.hasLayer(BIKE)) {
      m.removeLayer(BIKE);
    }
    if (m.hasLayer(PED)) {
      m.removeLayer(PED);
    }
    if (m.hasLayer(HSIP)) {
      m.removeLayer(HSIP);
    }
    if (m.hasLayer(TOP200)) {
      return m.removeLayer(TOP200);
    }
  } else if (z > 14) {
    if (m.hasLayer(pBIKE)) {
      m.removeLayer(pBIKE);
    }
    if (m.hasLayer(pPED)) {
      m.removeLayer(pPED);
    }
    if (m.hasLayer(pHSIP)) {
      m.removeLayer(pHSIP);
    }
    if (m.hasLayer(pTOP200)) {
      return m.removeLayer(pTOP200);
    }
  }
};

z = function() {
  if (cL === "HSIP") {
    hZ();
  }
  if (cL === "BIKE") {
    bZ();
  }
  if (cL === "PED") {
    pZ();
  }
  if (cL === "TOP200") {
    return rZ();
  }
};

changeLayer = function(l) {
  rmAll();
  cL = l;
  return z();
};

m.on("zoomend", z);

chMap = function() {
  changeLayer($("#getMap").val());
  return true;
};

$("#getMap").change(chMap);

geocode = function() {
  var address, gURL;
  old.center = m.getCenter();
  old.zoom = m.getZoom();
  address = $("#address").val();
  gURL = "http://open.mapquestapi.com/nominatim/v1/search?countrycodes=us&exclude_place_ids=955483008,950010827&viewbox=-76.212158203125%2C44.46123053905882%2C-66.005859375%2C40.107487419012415&bounded=1&format=json&q=";
  $.ajax({
    type: "GET",
    url: gURL + address,
    dataType: "jsonp",
    jsonp: "json_callback",
    success: function(data, textStatus) {
      var latlng;
      if (textStatus === "success") {
        latlng = new L.LatLng(data[0].lat, data[0].lon);
        gMarker.setLatLng(latlng);
        m.addLayer(gMarker);
        return m.setView(latlng, 17);
      }
    }
  });
  return false;
};

resetgeo = function() {
  m.removeLayer(gMarker);
  return m.setView(old.center, old.zoom);
};

gMarker = new L.Marker();

old = {};

$("#geocoder").submit(geocode);

$("#resetgeo").click(resetgeo);
