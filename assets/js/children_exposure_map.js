(function () {
    // This is to be able to embed the script into the index.html
    // initalize leaflet map
    var defaultView = [40, 0];
    var defaultZoom = 2;
    var map = L.map("map", {
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: false, // Prevents the map from wrapping around
    }).setView(defaultView, defaultZoom);

    // add OpenStreetMap basemap
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        noWrap: true,
        attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Searchbox to search by location
    var geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
    }).addTo(map);

    geocoder.on("markgeocode", function (e) {
        var center = e.geocode.center;
        map.setView(center, 4);
    });

    var geojsonLayer;
    var geojsonData;

    // URLs for geojson files by year
    const geojsonUrls = {
        2023: "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/files_for_visualization/child_exposure_percent_2023_5decimals.geojson",
    };

    // Maximum and minimum values per sub-indicator are determined by calculating the mean and standard deviation for 2023 and 50% threshold.
    // The maximum value is defined as Max = Mean + 2 × Standard Deviation.
    // Values exceeding this maximum will be saturated to minimize the skewing effect of very high values on the color scaling of the imagery.
    const bandRanges = {
        "Heatwave Frequency": { min: 0, max: 95 }, // Frequency
        "Heatwave Duration": { min: 0, max: 40 }, // Duration
        "Heatwave Severity": { min: 0, max: 95 }, // Severity
        "Extreme Heat Days": { min: 0, max: 95 }, // Extreme High Temp.
    };

    const loadingDiv = document.getElementById("loading");

    // Helper function to show or hide loading spinner
    function toggleSpinner(show) {
        loadingDiv.style.display = show ? "block" : "none";
    }

    // Helper function to get color based on value
    function getColor(value, min, max, steps, colorLookup, overflowColor) {
        if (value === null || value === undefined || isNaN(value)) {
            return null;
        }

        if (value >= max) {
            // Return a specific color for values greater than max
            return overflowColor;
        }

        // Calculate the index for the color lookup
        const index = Math.floor(((value - min) / (max - min)) * steps);

        // Return the color from the lookup
        return colorLookup[index];
    }


    // Helper function to update the legend with color scale
    function updateLegend(min, max, steps, colorLookup, overflowColor) {
        var legend = document.getElementById("legend");
        legend.innerHTML = '<div class="lead-title">Color Scale | <div><i>% of exposed children</i></div></div>';

        // Calculate the range step size
        const stepSize = (max - min) / steps;

        // Create the color blocks and labels
        for (let i = 0; i < steps; i++) {
            const rangeMin = min + i * stepSize;
            const rangeMax = min + (i + 1) * stepSize;

            legend.innerHTML +=
                `<div style="display: flex; flex-direction: column;  align-items: center; gap: 4px;">
               <div style=" border: 0.5px solid #000000; background-color: ${colorLookup[i]}; width: 20px; height: 20px;"></div>
                <div style="width: 100%; font-size: 10px;">${rangeMin.toFixed(0)} - ${rangeMax.toFixed(0)}</div>
            </div>`;
        }

        // Add a new color box for values higher than the max
        legend.innerHTML +=
            `<div style="display: flex; flex-direction: column; font-size: 10px; gap: 4px;">
                    <div style="background: ${overflowColor}; border: 1px solid #000000; width: 20px; height: 20px;"></div>
                    <div>${max}+</div>
                  </div>`;
    }


    // Function to update the map based on selected filters
    function updateMap(subIndicator, percentage) {
        const { min, max } = bandRanges[subIndicator];
        const steps = 5;
        const scale = chroma.scale("OrRd").domain([min, max]).classes(steps);
        const colorLookup = scale.colors(steps); // Create a lookup table for colors
        const overflowColor = "#500000";

        var sum = 0; // For global statistics

        updateLegend(min, max, steps, colorLookup, overflowColor);

        if (geojsonLayer) {
            map.removeLayer(geojsonLayer);
            map.closePopup();
        }

        geojsonLayer = L.geoJson(geojsonData, {
            style: function (feature) {
                var value_percentage =
                    feature.properties[
                    "Percentage " + subIndicator + " Increased by " + percentage
                    ];
                return {
                    fillColor: getColor(
                        value_percentage,
                        min,
                        max,
                        steps,
                        colorLookup,
                        overflowColor
                    ),
                    weight: 1,
                    opacity: 1,
                    color: "#b4cfd9",
                    fillOpacity: 0.7,
                };
            },
            onEachFeature: function (feature, layer) {
                var countryName = feature.properties["Country Name"];
                var value =
                    feature.properties[
                    subIndicator + " Increased by " + percentage
                    ];
                var value_percentage =
                    feature.properties[
                    "Percentage " + subIndicator + " Increased by " + percentage
                    ];

                // Create popup content
                var popupContent;

                if (value === 0) {
                    // change here if different value is used for NO DATA
                    popupContent = `
                            <div class="popup-header">In <strong>${countryName},</strong></div>
                            <div class="popup-content">
                                No exposure data is currently available.
                            </div>
                        `;
                } else {
                    popupContent = `
                            <div class="popup-header">In <strong>${countryName},</strong></div>
                            <div class="popup-content">
                                <strong>${value.toLocaleString()}</strong> children (~${value_percentage}% of total) live in areas where the <strong>${subIndicator}</strong> has increased by <strong>${percentage}</strong> since the 1960s<br>
                            </div>
                        `;
                }

                // Add to the global sum if the value is defined and is a number
                if (value !== undefined && !isNaN(value)) {
                    sum += value;
                }

                layer.bindPopup(popupContent);
            },
        }).addTo(map);

        // Display the sum below the map
        var sumDisplay = document.getElementById("sum-display");
        sumDisplay.innerHTML = `
                Globally, <strong>${sum.toLocaleString()}</strong> children live in areas where the <strong>${subIndicator}</strong> has increased by <strong>${percentage}</strong> since the 1960s.
            `;
    }

    // Load the GeoJSON file for the selected year
    function loadGeojsonForYear(year, subIndicator, percentage, callback) {
        if (year && subIndicator && percentage) {
            toggleSpinner(true);

            var url = geojsonUrls[year];

            fetch(url, { cache: "force-cache" })
                .then((response) => response.json())
                .then((data) => {
                    geojsonData = data;
                    if (callback) callback();
                    toggleSpinner(false);
                })
                .catch((error) => {
                    toggleSpinner(false);
                    console.error("Error loading the GeoJSON file:", error);
                    map.removeLayer(geojsonLayer);
                    document.getElementById("legend").innerHTML = "";
                });
        } else {
            // Remove the GeoJSON layer if it exists
            if (geojsonLayer) {
                map.removeLayer(geojsonLayer);
                document.getElementById("legend").innerHTML = "";
            }
        }
    }

    // Helper function to update map based on the selected filters
    function updateFilters() {
        var year = document.getElementById("yearDropdown").value;
        var subIndicator = document.getElementById("sub-indicator").value;
        var percentage = document.getElementById("percentage").value;

        loadGeojsonForYear(year, subIndicator, percentage, function () {
            updateMap(subIndicator, percentage);
        });
    }

    //helper function to enable download botton when all filters are selected
    function updateButtonState() {
        var year = document.getElementById("yearDropdown").value;
        var subIndicator = document.getElementById("sub-indicator").value;
        var percentage = document.getElementById("percentage").value;
        var downloadBtn = document.getElementById("downloadBtn");
        if (year && subIndicator && percentage) {
            downloadBtn.disabled = false;
        } else {
            downloadBtn.disabled = true;
        }
    }

    // Event listeners for the filters
    document
        .getElementById("yearDropdown")
        .addEventListener("change", function () {
            updateFilters();
            updateButtonState();
        });
    document
        .getElementById("sub-indicator")
        .addEventListener("change", function () {
            updateFilters();
            updateButtonState();
        });
    document
        .getElementById("percentage")
        .addEventListener("change", function () {
            updateFilters();
            updateButtonState();
        });

    // Listen for a click event on the 'downloadBtn' element and open a new tab with the URL to a TIFF file
    document
        .getElementById("downloadBtn")
        .addEventListener("click", function () {
            var selectedYear = document.getElementById("yearDropdown").value;
            var csvUrl = `https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/files_for_visualization/Exposure_change_for_Countries_${selectedYear}.csv`;
            window.open(csvUrl, "_blank");
        });

    // Event listener for reset view button click
    document
        .getElementById("reset-view")
        .addEventListener("click", function () {
            map.setView(defaultView, defaultZoom);
        });
})();