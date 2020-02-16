var request = require('request')
var async = require('async')
var fs = require('fs')

var inputFile = process.argv[2]
var outputFile = process.argv[3]

var data = {}
var relations = fs.readFileSync(inputFile).toString().split('\n').map(line => line.split('\t'))

var queue = async.queue(osm2geojson, 1)
queue.drain = save
queue.push(relations)

function osm2geojson(array, cb) {
  var [name, id] = array
  console.log(name, id)

  request('http://polygons.openstreetmap.fr/get_geojson.py?id=' + id + '&params=0', (err, res, body) => {
    if (err) return cb(err)
    if (body == 'None\n') return cb()
    data[id] = { id: id, name: name, geo: JSON.parse(body) }
    cb()
  })
}

function save() {
  var geojson = { "type": "FeatureCollection", "features": [] }
  for (var id in data) {
    var region = data[id]
    geojson.features.push({
      "type": "Feature", 
      "properties": {
        "osm-relation-id": region.id,
        "name": region.name
      },
      "geometry": region.geo.geometries[0]
    })
  }
  fs.writeFileSync(outputFile, JSON.stringify(geojson, null, 2))
}