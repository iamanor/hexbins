// Chicago is the starting view. Leaflet uses [latitude, longitude].
var cityBounds = [[41.6445, -87.94], [42.023, -87.524]];
var map = L.map("map").fitBounds(cityBounds, { padding: [20, 20] });

var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
L.control.scale().addTo(map);

// These fixed count ranges match the legend below the map.
var colors = d3.scaleThreshold()
  .domain([100, 500, 2000, 5000])
  .range(["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"]);

var hexLayer = L.hexbinLayer({ radius: 20, radiusRange: [20, 20], opacity: 0.8, duration: 0 })
  .fill(function (bin) { return colors(bin.length); })
  .addTo(map);

hexLayer.data(crimeData);

document.getElementById("status").textContent =
  crimeInfo.mapped.toLocaleString() + " crimes mapped; " +
  crimeInfo.skipped.toLocaleString() + " records without usable coordinates omitted.";

// Direct file URLs do not send the website referrer required by the tile server.
if (window.location.protocol === "file:") {
  map.removeLayer(tiles);
  document.getElementById("status").textContent =
    "For the background map, run open-map.bat and visit http://127.0.0.1:8765/ instead of opening this file directly.";
}

// Columns in crime-data.js: longitude, latitude, district, community area, ward.
var groups = {
  district: { column: 2, label: "District", plural: "districts" },
  community: { column: 3, label: "Community Area", plural: "community areas" },
  ward: { column: 4, label: "Ward", plural: "wards" }
};
var selectedBin;
var currentPopup;

// The plugin sends the mouse event first, then the points in the clicked bin.
hexLayer.dispatch().on("click", function (event, bin) {
  L.DomEvent.stopPropagation(event);
  showCrimes(bin, map.mouseEventToLatLng(event));
});

function showCrimes(bin, location) {
  selectedBin = bin;
  var group = groups[document.getElementById("groupBy").value];
  var counts = {};
  var unknown = 0;

  bin.forEach(function (point) {
    // 'o' contains the original crime record. Choose the selected column.
    var value = point.o[group.column];
    if (value === "Unknown" || value == null || value === "") {
      unknown++;
    } else {
      counts[value] = (counts[value] || 0) + 1;
    }
  });

  var areas = Object.keys(counts);
  areas.sort(function (a, b) {
    return counts[b] - counts[a] || Number(a) - Number(b);
  });
  var top10 = areas.slice(0, 10);

  var content = document.createElement("div");
  content.innerHTML = "<h2>Crime by " + group.label + "</h2><p>" +
    bin.length.toLocaleString() + " crimes in this hexagon</p>";
  var table = document.createElement("table");
  table.innerHTML = "<tr><th scope='col'>" + group.label + "</th><th scope='col'>Crimes</th></tr>";

  top10.forEach(function (area) {
    var row = table.insertRow();
    row.insertCell().textContent = group.label + " " + area;
    row.insertCell().textContent = counts[area].toLocaleString();
  });
  content.appendChild(table);

  var note = document.createElement("p");
  note.textContent = "Showing " + top10.length + " of " + areas.length +
    " " + group.plural + " present. Ties use " + group.label.toLowerCase() + " number.";
  if (unknown > 0) note.textContent += " Unknown " + group.label.toLowerCase() + ": " + unknown + " crimes (not ranked).";
  content.appendChild(note);

  currentPopup = L.popup({ maxWidth: 300, maxHeight: 350 })
    .setLatLng(location).setContent(content).openOn(map);
}

document.getElementById("groupBy").onchange = function () {
  var group = groups[this.value];
  document.getElementById("description").textContent =
    "2025 reported crimes. Click a hexagon to see crime by " + group.label.toLowerCase() + ".";
  labelHexagons();
  if (currentPopup && currentPopup.isOpen()) {
    showCrimes(selectedBin, currentPopup.getLatLng());
  }
};

document.getElementById("hexSize").onchange = function () {
  map.closePopup();
  var size = Number(this.value);
  hexLayer.radius(size).radiusRange([size, size]).redraw();
  labelHexagons();
};

document.getElementById("reset").onclick = function () {
  map.closePopup();
  map.fitBounds(cityBounds, { padding: [20, 20] });
};

// Close old results when zooming, since the points are regrouped at each zoom.
map.on("zoomstart", function () { map.closePopup(); });

// Allow keyboard users to open a hexagon's popup with Enter or Space.
function labelHexagons() {
  d3.selectAll(".hexbin-grid")
    .attr("tabindex", 0).attr("role", "button")
    .attr("aria-label", function (bin) {
      var group = groups[document.getElementById("groupBy").value];
      return bin.length + " crimes. Show " + group.plural;
    })
    .on("keydown", function (event, bin) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showCrimes(bin, L.latLng(bin[0].o[1], bin[0].o[0]));
      }
    });
}
map.on("moveend", labelHexagons);
labelHexagons();

tiles.on("tileerror", function () {
  document.getElementById("status").textContent =
    crimeInfo.mapped.toLocaleString() + " crimes mapped. Background tiles could not load; check your internet connection.";
});
