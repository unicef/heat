# %%
from geospatial.utils import hwi_to_cog, load_hwi_from_geotiff, write_hwi

HWIS = [
    "heatwaves_frequency",
    "heatwaves_duration",
    "heatwaves_severity",
    "heatwaves_extreme_high_temp",
]

DECADES = [
    1960,
    1970,
    1980,
    1990,
    2000,
    2010,
    2020,
]

# %%
# Optimize and convert to COG all files
for decade in DECADES:
    for hwi in HWIS:
        print(f"HWI: {hwi}, Decade: {decade}")

        # Load original 4-band raster from file
        array, kwargs, profile = load_hwi_from_geotiff(hwi, decade)

        # Transform, optimize and write to file the selected band
        write_hwi(array, kwargs, hwi, decade)

        # Convert to COG
        hwi_to_cog(hwi, decade)
# %%
