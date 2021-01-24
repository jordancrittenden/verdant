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
			radius: 50,
		});
	}
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