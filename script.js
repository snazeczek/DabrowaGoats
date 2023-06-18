var currentColor = 'blue';
    var areaSummary = {};
    var figureLayer;

    function setColor(color) {
      currentColor = color;
      var colorButtons = document.getElementsByClassName('color-button');
      for (var i = 0; i < colorButtons.length; i++) {
        colorButtons[i].classList.remove('active');
      }
      event.target.classList.add('active');
    }

    var minZoomLevel = 12;

    var map = L.map('map', {
      maxBounds: [
        [50.299, 19.151], // Lewy górny róg ograniczenia obszaru Dąbrowy Górniczej
        [50.360, 19.275]  // Prawy dolny róg ograniczenia obszaru Dąbrowy Górniczej
      ],
      minZoom: minZoomLevel // Ustawienie minimalnego poziomu przybliżenia
    }).setView([50.321, 19.202], minZoomLevel);

    var map2 = L.map('map2', {
      
      minZoom: minZoomLevel // Ustawienie minimalnego poziomu przybliżenia
    }).setView([50.321, 19.202], minZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 20 
    }).addTo(map);

    L.tileLayer('https://png.pngtree.com/thumb_back/fh260/background/20200821/pngtree-pure-white-minimalist-background-wallpaper-image_396581.jpg', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 22,
    }).addTo(map2);

    var wmsLayer = L.tileLayer.wms('https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaEwidencjiGruntow', {
      layers: 'geoportal,dzialki,numery_dzialek',
      minZoom: 10,
      format: 'image/png',
      transparent: true,
      maxZoom: 20 
    }).addTo(map);

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawnItems2 = new L.FeatureGroup();
    map2.addLayer(drawnItems2);

    var drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
        poly: {
          allowIntersection: false
        }
      },
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: 'green'
          }
        },
        polyline: {
          shapeOptions: {
            color: 'black'
          }
        },
        rectangle: false,
        circle: false,
        marker: false
      }
    });
    map.addControl(drawControl);

    var drawControl2 = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems2,
        poly: {
          allowIntersection: false
        }
      },
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: 'blue' // Domyślny kolor dla wszystkich polygonów
          }
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false
      }
    });
    map2.addControl(drawControl2);

    map.on(L.Draw.Event.CREATED, function (event) {
      var layer = event.layer;
      drawnItems.addLayer(layer);
      figureLayer = layer;
    });
    var polygonfull=0
    function calculateArea2() {
      var layers = drawnItems.getLayers();
      if (layers.length === 0) {
        alert("Proszę narysować poligon.");
        return;
      }

      var polygon = layers[0].toGeoJSON();
      var area = turf.area(polygon);
      polygonfull=area.toFixed(2)
    }
    
    L.control.scale().addTo(map);

    map.on('zoomend', function () {
      if (map.getZoom() < minZoomLevel) {
        map.setZoom(minZoomLevel);
      }
    });

    function moveFigureToMap2() {
      calculateArea2()
      
      if(figureLayer) {
        var mapElement = document.getElementById("map");
        mapElement.style.display = "none";
        
        var buttonElement = document.querySelector(".button");
        buttonElement.style.display = "none";

        var mapElement2 = document.querySelector(".map-container");
        mapElement2.style.visibility = "visible";
        
        var buttonElement2 = document.querySelector(".area-summary");
        buttonElement2.style.visibility = "visible";
      }

      else {
        alert("Zaznacz działkę");
        return;
      }

      var clonedFigureLayer = L.geoJSON(figureLayer.toGeoJSON());
      drawnItems2.addLayer(clonedFigureLayer);

      var figureBounds = clonedFigureLayer.getBounds();
      map2.fitBounds(figureBounds);
    }

    function calculateArea(layer) {
      var feature = layer.toGeoJSON();
      var area = turf.area(feature);
      if (!areaSummary[currentColor]) {
        areaSummary[currentColor] = 0;
      }
      areaSummary[currentColor] += area;
      updateSummaryList();
    }

    var zmienna1=0
    var zmienna2=0
    var zmienna3=0
    var zmienna4=0
    var zmienna5=0
    var zmienna6=0
    var zmienna7=0
    var zmienna8=0
    var zmienna9=0

    function updateSummaryList() {
      var summaryList = document.getElementById('summary-list');
      summaryList.innerHTML = '';
      for (var color in areaSummary) {
        var area = areaSummary[color].toFixed(2);
        var listItem = document.createElement('li');
        listItem.innerText = 
        color=="purple"?'Zabudowa':
        color=="green"?'Powierzchnie półprzepuszczalne':
        color=="red"?'Powierzchnie szczelne':
        color=="blue"?'Powierzchnie perforowane':
        color=="orange"?'Powierzchnie przepuszczalne':
        color=="pink"?'Drzewo':
        color=="brown"?'Krzew/Dachy zielone':
        color=="magenta"?'Trawa/Murawa':
        color=="lemonchiffon"?'Ściany zielone':
        'nic';
        listItem.innerText = listItem.innerText+ ': ' + area + ' m²';
        color=="purple"?zmienna1=area*0:0;
        color=="green"?zmienna2=area*0.5:0;
        color=="red"?zmienna3=area*0:0;
        color=="blue"?zmienna4=area*0.3:0;
        color=="orange"?zmienna5=area*1:0;
        color=="pink"?zmienna6=area*1:0;
        color=="brown"?zmienna7=area*0.7:0;
        color=="magenta"?zmienna8=area*0.3:0;
        color=="lemonchiffon"?zmienna9=area*0.5:0;
        var suma=zmienna1+zmienna2+zmienna3+zmienna4+zmienna5+zmienna6+zmienna7+zmienna8+zmienna9
        summaryList.appendChild(listItem);
        var BAF = suma / polygonfull
        var h3Element = document.querySelector('.calculated-baf');
        h3Element.innerHTML = 'BAF: ' + BAF;
        var selectElement = document.querySelector('.mySelect');
        var selectedValue = selectElement.value;
        var tekst = (selectedValue <= BAF) ? "Poziom zazielenia terenu jest dobry" : "Poziom zazielenia terenu jest zbyt mały, dodaj więcej zielonych obiektów";
        var kolor = (selectedValue <= BAF) ? "green" : "red";
        
        var wynik = '<span style="color: ' + kolor + '">' + tekst + '</span>';
        
        var pElement = document.querySelector('.alert');
        pElement.innerHTML = wynik;

      }
    }

    map2.on(L.Draw.Event.CREATED, function (event) {
      var layer = event.layer;
      layer.setStyle({ color: currentColor });
      drawnItems2.addLayer(layer);
      calculateArea(layer);
    });

    const customSelect = document.querySelector('.custom-select');
      const select = customSelect.querySelector('select');
  
      customSelect.addEventListener('click', function () {
          this.classList.toggle('selected');
          select.style.display = select.style.display === 'none' ? 'block' : 'none';
      });

      function goBack() {
        window.history.back(); // Go back to the previous page
        location.reload(); // Refresh the page
    }

    // Optional: Hide tooltip when clicking outside
// Optional: Hide tooltip when clicking outside
window.addEventListener('click', function(event) {
  const tooltips = document.querySelectorAll('.tooltip');
  tooltips.forEach(function(tooltip) {
    if (!tooltip.contains(event.target)) {
      tooltip.style.visibility = 'hidden';
      tooltip.style.opacity = '0';
    }
  });
});