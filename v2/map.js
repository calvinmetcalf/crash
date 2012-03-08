 var m;
 var center = new google.maps.LatLng(42.04113400940814, -71.795654296875);
 var zoom = 8;
 var tableid = 1685213;
 
 function initialize() {

  m = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: zoom,
      mapTypeId: 'roadmap'
    });
 
    layer = new google.maps.FusionTablesLayer({
      query: {
        select: 'point',
        from: tableid,
        where: "'map' LIKE 'All Clusters 2007-2009'"
      }
    });
    layer.setMap(m);
  }