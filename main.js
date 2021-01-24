let API_KEY = "AIzaSyAuGKm7k64ImaxoA5NLPUwGC8nUu3b_hdI";

let mapStyles = [
	{
		elementType: "geometry",
		stylers: [{ color: "#f5f5f5" }],
	},
	{
		elementType: "labels.icon",
		stylers: [{ visibility: "off" }],
	},
	{
		elementType: "labels.text.fill",
		stylers: [{ color: "#616161" }],
	},
	{
		elementType: "labels.text.stroke",
		stylers: [{ color: "#f5f5f5" }],
	},
	{
		featureType: "administrative.land_parcel",
		elementType: "labels.text.fill",
		stylers: [{ color: "#bdbdbd" }],
	},
	{
		featureType: "poi",
		elementType: "geometry",
		stylers: [{ color: "#eeeeee" }],
	},
	{
		featureType: "poi",
		elementType: "labels.text.fill",
		stylers: [{ color: "#757575" }],
	},
	{
		featureType: "poi.park",
		elementType: "geometry",
		stylers: [{ color: "#e5e5e5" }],
	},
	{
		featureType: "poi.park",
		elementType: "labels.text.fill",
		stylers: [{ color: "#9e9e9e" }],
	},
	{
		featureType: "road",
		elementType: "geometry",
		stylers: [{ color: "#ffffff" }],
	},
	{
		featureType: "road.arterial",
		elementType: "labels.text.fill",
		stylers: [{ color: "#757575" }],
	},
	{
		featureType: "road.highway",
		elementType: "geometry",
		stylers: [{ color: "#dadada" }],
	},
	{
		featureType: "road.highway",
		elementType: "labels.text.fill",
		stylers: [{ color: "#616161" }],
	},
	{
		featureType: "road.local",
		elementType: "labels.text.fill",
		stylers: [{ color: "#9e9e9e" }],
	},
	{
		featureType: "transit.line",
		elementType: "geometry",
		stylers: [{ color: "#e5e5e5" }],
	},
	{
		featureType: "transit.station",
		elementType: "geometry",
		stylers: [{ color: "#eeeeee" }],
	},
	{
		featureType: "water",
		elementType: "geometry",
		stylers: [{ color: "#c9c9c9" }],
	},
	{
		featureType: "water",
		elementType: "labels.text.fill",
		stylers: [{ color: "#9e9e9e" }],
	},
];

let map;
let userLocation;

function initMap() {
	map = new google.maps.Map(document.getElementById("map"), {
		center: { lat: 40.0149856, lng: -105.2705456 },
		zoom: 16,
		disableDefaultUI: true,
		styles: mapStyles
  });
}

function drawData(markers) {
	for (const i in markers) {
		let marker = markers[i];
		let color = "gray";
		switch (marker.type) {
			case "lightlitter":
				color = "yellow";
				break;
			case "mediumlitter":
				color = "orange";
				break;
			case "heavylitter":
				color = "red";
				break;
			case "graffiti":
				color = "purple";
				break;
			case "animal":
				color = "blue";
				break;
		}
		const litterSymbol = new google.maps.Circle({
			strokeColor: color,
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: color,
			fillOpacity: 0.35,
			map,
			center: { lat: marker.loc.latitude, lng: marker.loc.longitude },
			radius: 5,
		});
	}
}

function updateLocation(position) {
	let loc = { lat: position.coords.latitude, lng: position.coords.longitude };
	if (!userLocation) {
		userLocation = new google.maps.Marker({
			position: loc,
			map,
			title: "You are here",
		});
	} else {
		userLocation.setPosition(loc);
	}
	map.panTo(loc);
}

// Initialize Firestore through Firebase
firebase.initializeApp({
	apiKey: API_KEY,
	authDomain: 'localhost',
	projectId: "extreme-torch-302200"
});

// Read data
const markers = [];
var db = firebase.firestore();
db.collection("reports").get().then((querySnapshot) => {
	querySnapshot.forEach((doc) => markers.push(doc.data()));
	drawData(markers);
});

function reportAtLocation(position, type) {
	let data = {
		loc: new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude),
		type: type
	};

	db.collection("reports").add(data)
		.then(function(docRef) {
				console.log("Document written with ID: ", docRef.id);
				markers.push(data);
				drawData([ data ]);
		})
		.catch(function(error) {
				console.error("Error adding document: ", error);
		});
}

function reportAtCurrentLocation(type) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
			reportAtLocation(position, type);
		}, (err) => {
			console.log("some dank shit happened: " + err);
		});
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

window.onload = function () {
	document.querySelectorAll("#buttons > button").forEach((btn) => {
		btn.onclick = function() {
			reportAtCurrentLocation(btn.id);
		};
	});

	id = navigator.geolocation.watchPosition((position) => {
		updateLocation(position);
	}, (err) => {
		console.warn('ERROR(' + err.code + '): ' + err.message);
	}, {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	});
}