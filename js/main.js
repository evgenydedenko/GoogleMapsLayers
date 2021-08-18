$(document).ready(function() {
  GOMELMAP.init();
  centerControlDiv.index = 1;
  GOMELMAP.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(centerControlDiv);
  layer1965.setOpacity(0);
  GOMELMAP.placeMarkers('./data/markers.xml');
});

var GOMELMAP = {
  map: null,
  bounds: null
}

var markersArray = [];

var mapBounds = new google.maps.LatLngBounds(
  new google.maps.LatLng(52.359147, 30.897771),
  new google.maps.LatLng(52.490377, 31.106533));

  var mapMinZoom = 10;
  var mapMaxZoom = 15;
  var defaultZoom = 12;

  var layer1943 = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      var proj = GOMELMAP.map.getProjection();
      var z2 = Math.pow(2, zoom);
      var tileXSize = 256 / z2;
      var tileYSize = 256 / z2;
      var tileBounds = new google.maps.LatLngBounds(
        proj.fromPointToLatLng(new google.maps.Point(coord.x * tileXSize, (coord.y + 1) * tileYSize)),
        proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * tileXSize, coord.y * tileYSize))
      );
      var y = coord.y;
      var x = coord.x >= 0 ? coord.x : z2 + coord.x
      if (mapBounds.intersects(tileBounds) && (mapMinZoom <= zoom) && (zoom <= mapMaxZoom))
      return "./img/1943/"+ zoom + "/" + x + "/" + y + ".png";
      else
      return "./img/none.png";
    },
    tileSize: new google.maps.Size(256, 256),
    isPng: true,

    opacity: 1.0
  });

  var layer1965 = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      var proj = GOMELMAP.map.getProjection();
      var z2 = Math.pow(2, zoom);
      var tileXSize = 256 / z2;
      var tileYSize = 256 / z2;
      var tileBounds = new google.maps.LatLngBounds(
        proj.fromPointToLatLng(new google.maps.Point(coord.x * tileXSize, (coord.y + 1) * tileYSize)),
        proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * tileXSize, coord.y * tileYSize))
      );
      var y = coord.y;
      var x = coord.x >= 0 ? coord.x : z2 + coord.x
      if (mapBounds.intersects(tileBounds) && (mapMinZoom <= zoom) && (zoom <= mapMaxZoom))
      return "./img/1965/"+ zoom + "/" + x + "/" + y + ".png";
      else
      return "./img/none.png";
    },
    tileSize: new google.maps.Size(256, 256),
    isPng: true,

    opacity: 1.0
  });

  var EMPTYMAP = 'emptymap';

  function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '1px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.marginRight = '14px';
  controlUI.style.width = '21px';
  controlUI.style.height = '21px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.background = 'url(./img/controls/center.png) no-repeat';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Нажмите для отцентровки карты';
  controlDiv.appendChild(controlUI);




  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    GOMELMAP.map.setCenter(new google.maps.LatLng(52.424762, 31.002152));
    GOMELMAP.map.setZoom(defaultZoom);
  });

}

var centerControlDiv = document.createElement('div');
var centerControl = new CenterControl(centerControlDiv, GOMELMAP.map);



  GOMELMAP.init = function() {
    var myLatlng = new google.maps.LatLng(52.435966, 31.009765);
    var opts = {
      tilt:0,
      fullscreenControl: true,
      streetViewControl: false,
      center: new google.maps.LatLng(52.424762, 31.002152),
      zoom: defaultZoom,
      maxZoom: mapMaxZoom,
      minZoom: mapMinZoom
    };
    this.map = new google.maps.Map(document.getElementById("map"), opts);
    this.map.setMapTypeId('satellite');
    this.map.overlayMapTypes.insertAt(0, layer1943);
    this.map.overlayMapTypes.insertAt(1, layer1965);
    this.bounds = new google.maps.LatLngBounds();
  }

  GOMELMAP.placeMarkers = function(filename) {
    $.get(filename, function(xml){
      $(xml).find("marker").each(function(){


        var mark_title = $(this).find('mark_title').text();
        var html = $(this).find('html').text();
        // create a new LatLng point for the marker
        var lat = $(this).find('lat').text();
        var lng = $(this).find('lng').text();
        var point = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));

        // extend the bounds to include the new point
        GOMELMAP.bounds.extend(point);

        var markerImage = new google.maps.MarkerImage(
          'img/bg-num.png',
          new google.maps.Size(33,33),
          new google.maps.Point(0,0),
          new google.maps.Point(0,33)
        );

        var markerImageHover = new google.maps.MarkerImage(
          'img/bg-num.png',
          new google.maps.Size(33,33),
          new google.maps.Point(0,33),
          new google.maps.Point(0,33)
        );

        var marker = new google.maps.Marker({
          icon: markerImage,
          position: point,
          map: GOMELMAP.map,
          title: mark_title
        });

        markersArray.push(marker);

        var infoWindow = new google.maps.InfoWindow();


        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.setContent(html);
          infoWindow.open(GOMELMAP.map, marker);
        });

        google.maps.event.addListener(marker, 'mouseover', function() {
          marker.setIcon(markerImageHover);
        });

        google.maps.event.addListener(marker, 'mouseout', function() {
          marker.setIcon(markerImage);
        });


      });
    });
  }

  $("#fitBoundsButton").bind('click', function(){
    // Строка ниже маштабирует карту так, чтобы были видны все маркеры
    GOMELMAP.map.fitBounds(GOMELMAP.bounds);
  });

  function togMarkers(status)
  {
    for (var i = 0; i < markersArray.length; i++ ) {
      markersArray[i].setVisible(status);
    }
    if (!status)
    {
      $(".fitBoundsButtonRow").hide();
    }
    else {
        $(".fitBoundsButtonRow").show();
    }
  }

  $("#togVisibleButton").bind('click', function(){
    if (markersArray.length != 0)
    {
      if (markersArray[0].getVisible() != false)
      {
         togMarkers(false);
      }
      else {
          togMarkers(true);
      }
    }
  });

  $("#togOpcity1965").bind('click', function(){
    if(layer1965.getOpacity() == 0)
    {

      layer1965.setOpacity(1);
    }
    else
    {
      layer1965.setOpacity(0);
    }

    if (layer1943.getOpacity() == 1)
    {
      $("#togOpcity1943").click();
    }

  });

  $("#togOpcity1943").bind('click', function(){
    if(layer1943.getOpacity() == 0)
    {
      $("#togOpcity1965").click();
      layer1943.setOpacity(1);
    }
    else
    {
      layer1943.setOpacity(0);
    }
    if (layer1965.getOpacity() == 1)
    {
      $("#togOpcity1965").click();
    }
  });


  $("#togOpcityMain").bind('click', function(){

    if (GOMELMAP.map.getMapTypeId() != EMPTYMAP)
    {
      GOMELMAP.map.setMapTypeId(EMPTYMAP);
      GOMELMAP.map.setOptions({mapTypeControl: false});
    }
    else
    {
      GOMELMAP.map.setMapTypeId('satellite');
      GOMELMAP.map.setOptions({mapTypeControl: true});
    }


  });
