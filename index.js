var audioScroll = new Audio('scroll.mp3');
var audioBlip = new Audio('blip.mp3');

var mapObject = L.map('map').setView([51.505, -0.09], 13);

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
//   minZoom: 10,
//   maxZoom: 18,
// 	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
// 		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
// 		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
// 	id: 'mapbox.streets'
// }).addTo(mapObject);

var locations = [
  [48.2424511,16.3779938],
  [48.1991614,16.3698031],
  [48.2074629,16.3608295],
  [48.1789507,16.3915249],
  [48.2098153,16.3635864],
  [48.192193,16.4276749],


  [35.6478126,139.7091463],
  [35.6447494,139.7060495],
  [35.6550796,139.6713567],
  [35.6550796,139.671356],
  [35.6550796,139.6713567],
  [35.6491922,139.7192629],
  [35.6491922,139.7192629],
]

var icon = L.icon({
	iconUrl: 'circle.svg',
	iconSize: [8, 8],
	iconAnchor: [4, 4]
});

for (let index = 0; index < locations.length; index++) {
  const location = locations[index];

  // L.circleMarker(location, {
  //   radius: 3,
  //   color: 'gold',
  //   fillColor: 'gold',
  //   fillOpacity: 1
  // }).addTo(mapObject)

  L.marker(location, {icon: icon}).addTo(mapObject)
}

function updateSize () {
  mapObject.invalidateSize()
}

window.addEventListener('resize', updateSize)
updateSize()

mapObject.dragging.disable();
mapObject.scrollWheelZoom.disable();

var mc = new Hammer(document.querySelector('.swipearea'))

mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

mc.on('swipeleft', function(ev) {
    mapObject.setZoom(mapObject.getZoom() - 1)
    audioScroll.play()
});

mc.on('swiperight', function(ev) {
    mapObject.setZoom(mapObject.getZoom() + 1)
    audioScroll.play()
});

function animateButton () {
  document.querySelector('.top').classList.add('animate')

  setTimeout(() => {
    document.querySelector('.top').classList.remove('animate')
  }, 100)
}

var animationTimeout

mc.on('swipedown', function(ev) {
  animateButton()

  navigator.geolocation.getCurrentPosition(
    function(location) {
      var radar = document.querySelector('.radar')

      if (radar.classList.contains('inactive')) {
        radar.classList.remove('inactive')
      }

      audioBlip.play()

      var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude)
      mapObject.panTo(latlng)
    },
    function (error) {
      var errorElement = document.querySelector('.error')

      errorElement.classList.remove('hidden')

      animationTimeout = setTimeout(() => {
        errorElement.classList.add('hidden')
      }, 5100);
    }
  )
});
