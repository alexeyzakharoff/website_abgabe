/* eslint-disable no-trailing-spaces */
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import Stamen from 'ol/source/Stamen';
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import * as olProj from 'ol/proj';
import {toLonLat} from 'ol/proj';
import {Icon, Style} from 'ol/style';
import Overlay from 'ol/Overlay';
import sync from 'ol-hashed';
import XYZ from 'ol/source/XYZ';
import Feature from 'ol/Feature';
import {fromLonLat} from 'ol/proj';
import circular from 'ol/geom/Polygon';
import Point from 'ol/geom/Point';
import Control from 'ol/control/Control';

const container = document.getElementById('popup');
const closer = document.getElementById('popup-closer');

const map = new Map({
  target: 'map',
  view: new View({
    center: olProj.fromLonLat([15.52, 48.18]),
    zoom: 12
  })
});

sync(map);

const satLayer = new TileLayer({
  source: new XYZ({
    //attributions: ['Powered by Esri', 'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
    attributionsCollapsible: false,
    url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
    maxZoom: 23
  })
});

const baseLayer = new TileLayer({
  source: new Stamen({
    layer: 'terrain'
  })
});
map.addLayer(baseLayer);


const sat = document.getElementById('sat');
sat.addEventListener('click', function(event) {
  //Anderen Layer entfernen
  map.removeLayer(baseLayer);
  //Satelliten Layer hinzufügen
  map.addLayer(satLayer);
});

const base = document.getElementById('base');
base.addEventListener('click', function(event) {
  //Anderen Layer entfernen
  map.removeLayer(satLayer);
  //Satelliten Layer hinzufügen
  map.addLayer(baseLayer);
});

const overlay = new Overlay({
  element: document.getElementById('popup-container'),
  positioning: 'bottom-center',
  offset: [0, -10],
  autoPan: true,
  autoPanAnimation: {
    duration: 10
  }
});
map.addOverlay(overlay);
overlay.getElement().addEventListener('singleclick', function() {
  overlay.setPosition();
});

const overlay1 = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});
map.addOverlay(overlay1);

closer.onclick = function() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

const gemaprima = new VectorLayer({
  source: new Vector({
    url: 'data/gemaprima.geojson',
    format: new GeoJSON()
  })
});
map.addLayer(gemaprima);
gemaprima.setZIndex(4);

const gruenraeume = new VectorLayer({
  source: new Vector({
    url: 'data/gruenraeume.geojson',
    format: new GeoJSON()
  })
});
map.addLayer(gruenraeume);
gruenraeume.setZIndex(5);

gruenraeume.setStyle(function(feature) {
  return new Style({
    fill: new Fill({
      color: 'rgba(58, 183, 38, 0.4'})
  });
});

const markers = new VectorLayer({
  source: new Vector({
    url: 'data/markers.geojson',
    format: new GeoJSON()
  })
});
map.addLayer(markers);
markers.setZIndex(10);

markers.setStyle(new Style({
  image: new Icon({
    anchor: [0.5, 0.5],
    scale: 0.07,
    src: 'data/baum.png'
  })
}));

const verkehr = new VectorLayer({
  source: new Vector({
    url: 'https://student.ifip.tuwien.ac.at/geoweb/2019/g05/postgis_geojson.php?theme=Verkehr',
    format: new GeoJSON()
  })
});
map.addLayer(verkehr);
verkehr.setZIndex(6);

verkehr.setStyle(new Style({
  image: new Icon({
    anchor: [0, 1],
    scale: 0.04,
    src: 'data/verkehr.png'
  })
}));

const ortskern = new VectorLayer({
  source: new Vector({
    url: 'https://student.ifip.tuwien.ac.at/geoweb/2019/g05/postgis_geojson.php?theme=Ortskern',
    format: new GeoJSON()
  })
});
map.addLayer(ortskern);
ortskern.setZIndex(7);

ortskern.setStyle(new Style({
  image: new Icon({
    anchor: [0, 1],
    scale: 0.04,
    src: 'data/ortskern.png'
  })
}));

const gruenraum = new VectorLayer({
  source: new Vector({
    url: 'https://student.ifip.tuwien.ac.at/geoweb/2019/g05/postgis_geojson.php?theme=Gruenraum',
    format: new GeoJSON()
  })
});
map.addLayer(gruenraum);
gruenraum.setZIndex(8);

gruenraum.setStyle(new Style({
  image: new Icon({
    anchor: [0, 1],
    scale: 0.04,
    src: 'data/gruenraum.png'
  })
}));


/* const verkehrStyle = new Style({ //Gestaltung der Feedbacks zum Thema "Verkehr"
  image: new Icon({
    anchor: [0, 1],
    scale: 0.04,
    src: 'data/baum.png'
  })
}); 

const ortskernStyle = new Style({ //Gestaltung der Feedbacks zum Thema "Ortskern"
  image: new Icon({
    anchor: [0, 1],
    scale: 0.04,
    src: 'data/baum.png'
  })
}); 

const gruenraumStyle = new Style({ //Gestaltung der Feedbacks zum Thema "Grünraum"
  image: new Icon({
    anchor: [0, 1],
    scale: 0.04,
    src: 'data/baum.png'
  })
});

feedback.getSource().getFeatures().forEach(curr => {
  let feedbackStyle;
  const feedbackThema = 'Ortskern';
  if (feedbackThema === 'Verkehr') {
    feedbackStyle = verkehrStyle; //vordefinierte (Zeilen 71 - 93) Gestaltung abrufen
  } else if (feedbackThema === 'Ortskern') {
    feedbackStyle === ortskernStyle;
  } else {
    feedbackStyle === gruenraumStyle;
  }
  curr.setStyle(feedbackStyle);
}); */

// feedback.setStyle(function(feature) {
//   let feedbackStyle; //Variable für die Gestaltung (Icon) des Layers
//   const feedbackThemen = feature.getProperties(); //Konstante für das Thema des Feedbacks
//   for (const feedbackThema in feedbackThemen) {
//     console.log(feedback.getSource().getFeatures());
//     if (feedbackThema === 'Verkehr') {
//       feedbackStyle = verkehrStyle; //vordefinierte (Zeilen 71 - 93) Gestaltung abrufen
//     } else if (feedbackThema === 'Ortskern') {
//       feedbackStyle === ortskernStyle;
//     } else {
//       feedbackStyle === gruenraumStyle;
//     }
//     return feedbackStyle;
//   }
// });

map.on('singleclick', function(e) {
  let markup = '';
  let foundFeature = false;
  map.forEachFeatureAtPixel(e.pixel, function(feature) {
    if (foundFeature) {
      return;
    }
    foundFeature = true;
    const properties = feature.getProperties();
    markup += markup + '<hr><table>';
    for (const property in properties) {
      if (property != 'geometry' && property != 'fill') {
        markup += '<tr><th>' + property + '</th><td>' + properties[property] + '</td></tr>';
      }
    }
    markup += '</table>';
  }, {
    layerFilter: function(l) {
      const isLayer = (l === gruenraum || l === verkehr || l === ortskern);
      return isLayer;
    }
  });
  if (markup) {
    document.getElementById('popup-container').innerHTML = markup;
    overlay.setPosition(e.coordinate);
  } else {
    const pos = toLonLat(e.coordinate);
    const anklicken = '<a href="https://student.ifip.tuwien.ac.at/geoweb/2019/g05/feedback_gemaprima.php?pos=' + pos.join(' ') + '" style="color: #ffffff">Hier fühle ich mich wohl!</a>';
    document.getElementById('popup-container').innerHTML = anklicken;
    overlay.setPosition(e.coordinate);
  }
});

function calculateStatistics(llll) {
  const feedbacks = llll.getSource().getFeatures();
  const gemeinden = gemaprima.getSource().getFeatures();
  
  if (feedbacks.length > 0 && gemeinden.length > 0) {
    for (let i = 0, ii = feedbacks.length; i < ii; ++i) {
      const feedback1 = feedbacks[i];
      for (let j = 0, jj = gemeinden.length; j < jj; ++j) {
        const gemeinde = gemeinden[j];
        const counts = gemeinde.get('FEEDBACKS') || new Map ([[]]);
        let count = counts.get(llll.getZIndex()) || 0;
        const feedbackGeom = feedback1.getGeometry();
        if (feedbackGeom &&
    gemeinde.getGeometry().intersectsCoordinate(feedbackGeom.getCoordinates())) {
          ++count;
        }
        counts.set(llll.getZIndex(), count);
        gemeinde.set('FEEDBACKS', counts);
      }
    }
  }
}
/* gemaprima.getSource().once('change', function() {
  return calculateStatistics(gemaprima);
}); */
verkehr.getSource().once('change', function() {
  return calculateStatistics(verkehr);
});
ortskern.getSource().once('change', function() {
  return calculateStatistics(ortskern);
});
gruenraum.getSource().once('change', function() {
  return calculateStatistics(gruenraum);
});


/* verkehr.changed();
ortskern.changed();
gruenraum.changed(); */

/* function calculateStatistics() {
  const feedbacks_v = verkehr.getSource().getFeatures();
  const gemeinden = gemaprima.getSource().getFeatures();
  if (feedbacks_v.length > 0 && gemeinden.length > 0) {
    for (let i = 0, ii = feedbacks_v.length; i < ii; ++i) {
      const feedback1_v = feedbacks_v[i];
      for (let j = 0, jj = gemeinden.length; j < jj; ++j) {
        const gemeinde = gemeinden[j];
        let count = gemeinde.get('FEEDBACKS_v') || 0;
        const feedback_vGeom = feedback1_v.getGeometry();
        if (feedback_vGeom &&
    gemeinde.getGeometry().intersectsCoordinate(feedback_vGeom.getCoordinates())) {
          ++count;
        }
        gemeinde.set('FEEDBACKS_v', count);
      }
    }
  }
}
gemaprima.getSource().once('change', calculateStatistics);
verkehr.getSource().once('change', calculateStatistics);
 */

/* function calculateStatistics() {
  const feedbacks_o = ortskern.getSource().getFeatures();
  const gemeinden = gemaprima.getSource().getFeatures();
  if (feedbacks_o.length > 0 && gemeinden.length > 0) {
    for (let i = 0, ii = feedbacks_o.length; i < ii; ++i) {
      const feedback1_o = feedbacks_o[i];
      for (let j = 0, jj = gemeinden.length; j < jj; ++j) {
        const gemeinde = gemeinden[j];
        let count = gemeinde.get('FEEDBACKS_o') || 0;
        const feedback_oGeom = feedback1_o.getGeometry();
        if (feedback_oGeom &&
    gemeinde.getGeometry().intersectsCoordinate(feedback_oGeom.getCoordinates())) {
          ++count;
        }
        gemeinde.set('FEEDBACKS_o', count);
      }
    }
  }
}
gemaprima.getSource().once('change', calculateStatistics);
ortskern.getSource().once('change', calculateStatistics);
 */

/* function calculateStatistics() {
  const feedbacks_g = gruenraum.getSource().getFeatures();
  const gemeinden = gemaprima.getSource().getFeatures();
  if (feedbacks_g.length > 0 && gemeinden.length > 0) {
    for (let i = 0, ii = feedbacks_g.length; i < ii; ++i) {
      const feedback1_g = feedbacks_g[i];
      for (let j = 0, jj = gemeinden.length; j < jj; ++j) {
        const gemeinde = gemeinden[j];
        let count = gemeinde.get('FEEDBACKS_g') || 0;
        const feedback_gGeom = feedback1_g.getGeometry();
        if (feedback_gGeom &&
    gemeinde.getGeometry().intersectsCoordinate(feedback_gGeom.getCoordinates())) {
          ++count;
        }
        gemeinde.set('FEEDBACKS_g', count);
      }
    }
  }
}
gemaprima.getSource().once('change', calculateStatistics);
gruenraum.getSource().once('change', calculateStatistics);
 */

gemaprima.setStyle(function(feature) {
  calculateStatistics(verkehr);
  calculateStatistics(gruenraum);
  calculateStatistics(ortskern);
  let fillColor;
  const feedbackCount = feature.get('FEEDBACKS');
  feature.set('FEEDBACKS', undefined);
  if (feedbackCount == undefined) {
    fillColor = 'white';
  } else if (feedbackCount.get(6) > feedbackCount.get(7) && feedbackCount.get(6) > feedbackCount.get(8)) {
    fillColor = 'rgba(25, 25, 112, 0.4)';
  } else if (feedbackCount.get(7) > feedbackCount.get(6) && feedbackCount.get(7) > feedbackCount.get(8)) {
    fillColor = 'rgba(255, 165, 0, 0.4)';
  } else if (feedbackCount.get(8) > feedbackCount.get(7) && feedbackCount.get(8) > feedbackCount.get(6)) {
    fillColor = 'rgba(34, 139, 34, 0.4)';
  } else {
    // eslint-disable-next-line no-console
    console.log('6=' + feedbackCount.get(6) + ' ' + '7=' + feedbackCount.get(7) + ' ' + '8=' + feedbackCount.get(8));
    fillColor = 'rgba(176, 196, 222, 0.4)';
  }
  /* if (feedbackCount <= 1) { // if feedbackCount > verkehrCount
    fillColor = 'red';
  } else if (feedbackCount < 5) { // if verkehrCount > feedbackCount
    fillColor = 'green';
  } else {
    fillColor = 'blue';
  } */
  return new Style({
    fill: new Fill({
      color: fillColor
    }),
    stroke: new Stroke({
      color: 'rgba(4, 4, 4, 1)',
      width: 1
    })
  });
});

/* gemaprima.setStyle(function(feature) {
  let fillColor;
  const feedback_oCount = feature.get('FEEDBACKS_o');
  const feedback_gCount = feature.get('FEEDBACKS_g');
  const feedback_vCount = feature.get('FEEDBACKS_v');
  if (feedback_vCount > feedback_oCount && feedback_vCount > feedback_gCount) { // if feedbackCount > verkehrCount
    fillColor = 'blue';
  } if (feedback_oCount > feedback_vCount && feedback_oCount > feedback_gCount) { // if verkehrCount > feedbackCount
    fillColor = 'orange';
  } if (feedback_gCount > feedback_vCount && feedback_gCount > feedback_oCount) {
    fillColor = 'green';
  }
  return new Style({
    fill: new Fill({
      color: fillColor
    }),
    stroke: new Stroke({
      color: 'rgba(4, 4, 4, 1)',
      width: 1
    })
  });
}); */
map.dispatchEvent('change:size');

// Koordinatensuche

// eslint-disable-next-line no-undef
const geocoder = new Geocoder('nominatim',
  {
    provider: 'mapquest',
    key: 'ACfOgoF7JNAG57XQv72HzpCEoSo8hQmZ',
    lang: 'de-AT',
    placholder: 'Suchen...',
    targetType: 'glass-button',
    limit: 6,
    keepOpen: false
  });
map.addControl(geocoder);
geocoder.on('addresschosen', function(evt) {
  const feature = evt.feature,
      coord = evt.coordinate,
      address = evt.address;
  geocoder.getSource().clear();
  geocoder.getSource().addFeature(feature);
  // eslint-disable-next-line no-undef
  content.innerHTML = '<p>' + address.formatted + '</p>';
  overlay.setPosition(coord);
});
geocoder.on('addresschosen', function(evt) {
  // eslint-disable-next-line no-console
  console.info(evt);
  
});

//GPS Location
const GPSsource = new Vector();
const GPSlayer = new VectorLayer({
  source: GPSsource
});
map.addLayer(GPSlayer);


navigator.geolocation.watchPosition(function(pos) {
  const coords = [pos.coords.longitude, pos.coords.latitude];
  const accuracy = circular(coords, pos.coords.accuracy);
  GPSsource.clear(true);
  GPSsource.addFeatures([
    new Feature(accuracy.transform('EPSG:4326', map.getView().getProjection())),
    new Feature(new Point(fromLonLat(coords)))
  ]);
}, function(error) {
  alert(`ERROR: ${error.message}`);
}, {
  enableHighAccuracy: true
});

const locate = document.createElement('div');
locate.className = 'ol-control ol-unselectable locate';
locate.innerHTML = '<button title="Locate me">◎</button>';
locate.addEventListener('click', function() {
  if (!GPSsource.isEmpty()) {
    map.getView().fit(GPSsource.getExtent(), {
      maxZoom: 18,
      duration: 500
    });
  }
});
map.addControl(new Control({
  element: locate
}));

