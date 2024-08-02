import geopandas as gpd
import pandas as pd

# Load the CSV data
csv_file_path = "data/Exposure_change_for_Countries_with_percent_2023.csv"
csv_data = pd.read_csv(csv_file_path)

# Load the GeoJSON file with country boundaries
geojson_file_path = "data/simple_bnd.geojson"
country_boundaries = gpd.read_file(geojson_file_path)

# Merge the data
merged_data = country_boundaries.merge(csv_data, left_on="iso3", right_on="Country Code")

# Export the merged GeoDataFrame to a new GeoJSON file
output_geojson_path = "data/child_exposure_percent_2023.geojson"
merged_data.to_file(output_geojson_path, driver="GeoJSON")

print("GeoJSON file created successfully.")
