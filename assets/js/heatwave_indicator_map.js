(function () {
    // Initalize leaflet map
    var defaultView = [40, 0];
    var defaultZoom = 2;
    var map = L.map("map", {
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: false, // Prevents the map from wrapping around
    }).setView(defaultView, defaultZoom);

    // Add Open Street Map layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        noWrap: true,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Searchbox to search by location
    var geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
    }).addTo(map);

    geocoder.on("markgeocode", function (e) {
        var center = e.geocode.center;
        map.setView(center, 4);
    });

    // URLs for TIFF files by decade and sub-indicator
    const tiffUrls = {
        1960: {
            frequency:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_frequency_1960s_proj_COG.tif",
            duration:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_duration_1960s_proj_COG.tif",
            severity:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_severity_1960s_proj_COG.tif",
            extreme_high_temp:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_extreme_high_temp_1960s_proj_COG.tif",
        },
        1970: {
            frequency:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_frequency_1970s_proj_COG.tif",
            duration:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_duration_1970s_proj_COG.tif",
            severity:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_severity_1970s_proj_COG.tif",
            extreme_high_temp:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_extreme_high_temp_1970s_proj_COG.tif",
        },
        1980: {
            frequency:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_frequency_1980s_proj_COG.tif",
            duration:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_duration_1980s_proj_COG.tif",
            severity:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_severity_1980s_proj_COG.tif",
            extreme_high_temp:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_extreme_high_temp_1980s_proj_COG.tif",
        },
        1990: {
            frequency:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_frequency_1990s_proj_COG.tif",
            duration:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_duration_1990s_proj_COG.tif",
            severity:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_severity_1990s_proj_COG.tif",
            extreme_high_temp:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_extreme_high_temp_1990s_proj_COG.tif",
        },
        2000: {
            frequency:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_frequency_2000s_proj_COG.tif",
            duration:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_duration_2000s_proj_COG.tif",
            severity:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_severity_2000s_proj_COG.tif",
            extreme_high_temp:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_extreme_high_temp_2000s_proj_COG.tif",
        },
        2010: {
            frequency:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_frequency_2010s_proj_COG.tif",
            duration:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_duration_2010s_proj_COG.tif",
            severity:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_severity_2010s_proj_COG.tif",
            extreme_high_temp:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_extreme_high_temp_2010s_proj_COG.tif",
        },
        2020: {
            frequency:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_frequency_2020s_proj_COG.tif",
            duration:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_duration_2020s_proj_COG.tif",
            severity:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_severity_2020s_proj_COG.tif",
            extreme_high_temp:
                "https://unidatadapmclimatechange.blob.core.windows.net/public/heatwave/cogs_by_hwi/average_heatwaves_extreme_high_temp_2020s_proj_COG.tif",
        },
    };

    // Maximum and minimum values per band are determined by calculating the mean and standard deviation for 2020.
    // The maximum value is defined as Max = Mean + 2 × Standard Deviation.
    // Values exceeding this maximum will be saturated to minimize the skewing effect of very high values on the color scaling of the imagery.
    const hwiRanges = {
        frequency: { min: 0, max: 15 },
        duration: { min: 0, max: 79 },
        severity: { min: 0, max: 4 },
        extreme_high_temp: { min: 0, max: 112 },
    };

    var currentLayer,
        currentGeoRaster;

    const loadingDiv = document.getElementById("loading");

    // Helper function to show or hide loading spinner
    function toggleSpinner(show) {
        loadingDiv.style.display = show ? "block" : "none";
    }

    // Helper function to get color based on value
    // values higher than the max of the selected band are clamped to the darkest color (to prevent outliers from skewing the perceptual scaling of data).
    function getColor(value, min, max, steps, colorLookup, overflowColor) {
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
        var hwiSelector = document.getElementById("hwiSelector");
        var band = hwiSelector
            .closest(".dropdown")
            .querySelector(".active button").title;
        legend.innerHTML = `<div class="lead-title">Color Scale | <div><i>${band}</i></div></div>`;

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

    // Add raster layer to the map and update the legend with color scale
    function addRasterLayer(hwi) {
        const steps = 5;
        const { min, max } = hwiRanges[hwi];
        const scale = chroma.scale("OrRd").domain([min, max]).classes(steps);
        const colorLookup = scale.colors(steps); // Create a lookup table for colors
        const overflowColor = "#500000";
        if (!currentGeoRaster) {
            document.getElementById("legend").innerHTML = "";
            return; // Abort if there is no data available.
        }

        updateLegend(min, max, steps, colorLookup, overflowColor);

        // Remove previous layer (if any)
        if (currentLayer) {
            map.removeLayer(currentLayer);
        }

        // Add new GeoRaster layer
        currentLayer = new GeoRasterLayer({
            attribution: "Unicef",
            noWrap: true, // Prevents from repeating the map at the edges.
            georaster: currentGeoRaster,
            opacity: 0.7,
            // Handle the loading spinner.
            onTileLoadStart: function () {
                toggleSpinner(true);
            },
            onTileLoadEnd: function () {
                toggleSpinner(false);
            },
            onTileLoadError: function () {
                toggleSpinner(false);
                alert("Failed to load data. Please try again.");
                map.removeLayer(currentLayer);
                document.getElementById("legend").innerHTML = "";
            },
            // Assign colors to individual pixels based on their value
            pixelValuesToColorFn: function (pixelValues) {
                var pixelValue = pixelValues[0];

                if (
                    pixelValue === 0 ||
                    pixelValue === null ||
                    pixelValue === undefined ||
                    isNaN(pixelValue)
                ) {
                    return null;
                }
                return getColor(
                    pixelValue,
                    min,
                    max,
                    steps,
                    colorLookup,
                    overflowColor
                );
            },
            resolution: 256,
        });
        // Display the layer on the map
        currentLayer.addTo(map);
        // Adjust the map's view to fit the bounds of the newly added raster layer.
        // map.fitBounds(currentLayer.getBounds());
    }

    // Load the TIFF file for the selected decade
    function loadTiff(decade, hwi) {
        if (decade && hwi) {
            toggleSpinner(true);

            console.log(decade, hwi, tiffUrls[decade][hwi]);
            var url = tiffUrls[decade][hwi];

            fetch(url, { cache: "force-cache" })
                .then((response) => response.arrayBuffer())
                .then((arrayBuffer) => {
                    parseGeoraster(arrayBuffer).then((georaster) => {
                        currentGeoRaster = georaster;
                        addRasterLayer(hwi);
                        toggleSpinner(false);
                    });
                })
                .catch(() => {
                    toggleSpinner(false);
                    alert("Failed to load data. Please try again.");
                    map.removeLayer(currentLayer);
                    document.getElementById("legend").innerHTML = "";
                });
        } else {
            if (currentLayer) {
                map.removeLayer(currentLayer);
                document.getElementById("legend").innerHTML = "";
            }
        }
    }

    // Helper function to update map based on the selected filters
    function updateFilters() {
        var selectedDecade = document.getElementById("decadeDropdown").value;
        var selectedHwi = document.getElementById("hwiSelector").value;

        loadTiff(selectedDecade, selectedHwi);
    }

    //helper function to enable download botton when all filters are selected
    function updateButtonState() {
        var selectedDecade = document.getElementById("decadeDropdown").value;
        var selectedHwi = document.getElementById("hwiSelector").value;
        if (selectedDecade && selectedHwi) {
            downloadBtn.disabled = false;
        } else {
            downloadBtn.disabled = true;
        }
    }

    // Listen for a change event on the 'decadeDropdown' element and call the loadTiff with the newly selected decade.
    document
        .getElementById("decadeDropdown")
        .addEventListener("change", function () {
            updateFilters();
            updateButtonState();
        });

    // Listen for a change event on the 'hwiSelector' element and call the loadTiff with the newly selected decade.
    document
        .getElementById("hwiSelector")
        .addEventListener("change", function () {
            updateFilters();
            updateButtonState();
        });

    // Listen for a click event on the 'downloadBtn' element and open a new tab with the URL to a TIFF file
    document
        .getElementById("downloadBtn")
        .addEventListener("click", function () {
            var selectedDecade =
                document.getElementById("decadeDropdown").value;
            var hwiSelector = document.getElementById("hwiSelector").value;

            // Both selections are made and are different from 0, proceed with the download
            window.open(tiffUrls[selectedDecade][hwiSelector], "_blank");
        });

    // Event listener for reset view button click
    document
        .getElementById("reset-view")
        .addEventListener("click", function () {
            map.setView(defaultView, defaultZoom);
        });
})();