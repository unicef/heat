# README

This repository contains several Jupyter notebooks designed to analyze and process climate-related data, particularly focusing on heatwave indicators and their impacts on child populations. Below is a description of each notebook:

### 1. `heatwaves_indicators_calc_multi_year_product_v1_back.ipynb`
This notebook calculates heatwave indicators for multiple years. It processes climate data to generate indicators such as heatwave frequency, duration, severity, and extreme heat days. The notebook includes data processing steps, calculations, and visualizations to illustrate the trends and impacts of heatwaves over the specified time period.

### 2. `hwi_analysis_build_vrt_1960_2024.ipynb`
This notebook builds virtual raster tiles (VRT) for heatwave indicator analysis from 1960 to 2024. It focuses on creating efficient data structures for large-scale climate data to facilitate fast access and processing. The notebook includes steps to generate VRTs, validate their accuracy, and integrate them into the overall analysis workflow.

### 3. `copy_data_from_service_account.ipynb`
This notebook is used to copy data from a service account. It includes steps to authenticate and access data stored in a cloud service (such as Google Cloud Storage) using a service account. The notebook demonstrates how to securely transfer data from the cloud to local storage or another cloud service.


### 4. `hwi_analysis_1960_2024.ipynb`
This notebook analyzes heatwave indicators from 1960 to 2024. It includes data loading, cleaning, and analysis steps to examine long-term trends in heatwave occurrences and their severity. The analysis involve statistical methods and visualizations to highlight significant changes and patterns over the study period.

### 5. `child_population_high_res.ipynb`
This notebook processes high-resolution child population data. It includes steps to read, clean, and analyze the data to understand the distribution and changes in child population over time. The analysis include visualizations and statistical summaries to highlight key findings.

### 6. `extreme_exposure_high_res.ipynb`
This notebook focuses on analyzing child population exposure to extreme heat across different decades. It calculates exposure metrics based on heatwave indicators. The results are stored in CSV files for further analysis or visualization.

### 7. `hwi_resample.ipynb`
This notebook serves the purpose of resampling heatwave indicators. Specifically, it takes the heatwave indicators calculated and aggregated by decade and adjusts their resolution to match the population data used in the analysis. 

### 8. `hwi_summary_country.ipynb`
In this notebook, heatwave indicators aggregated for decades are summarized based on country boundaries. The output is a CSV file containing relevant information.   
