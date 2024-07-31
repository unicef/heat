import numpy as np
import rasterio
from rio_cogeo import cog_validate
from rio_cogeo.cogeo import cog_translate
from rio_cogeo.profiles import cog_profiles


def load_hwi_from_geotiff(
    heatwave_indicator: str, decade: int
) -> tuple[np.ndarray, dict, dict]:
    """
    Load a specific band from a raster file.

    Parameters
    ----------
    heatwave_indicator : str
        Heatwave indicator to load the band from raster file.
    decade : int, optional
        Decade to load the file from.

    Returns
    -------
    tuple[np.ndarray, dict, dict]
        Tuple containing the array, metadata and profile of the band.
    """
    bands = {
        "heatwaves_frequency": 1,
        "heatwaves_duration": 2,
        "heatwaves_severity": 3,
        "heatwaves_extreme_high_temp": 4,
    }

    assert (
        heatwave_indicator in bands.keys()
    ), f"Invalid heatwave indicator: {heatwave_indicator}"

    assert decade in [
        1960,
        1970,
        1980,
        1990,
        2000,
        2010,
        2020,
    ], f"Invalid decade: {decade}"

    # Path to GeoTIFF file
    file_path = f"data/average_hwi_{decade}s_proj_COG2.tif"

    with rasterio.open(file_path) as src:
        array = src.read(bands[heatwave_indicator])
        kwargs = src.meta
        profile = src.profile.copy()

    return array, kwargs, profile


def write_hwi(
    array: np.ndarray,
    kwargs: dict,
    indicator: str,
    decade: int,
    round_decimals: int = None,
    replace_zero: bool = False,
) -> None:
    """
    Write a selected heatwave indicator to a new GeoTIFF file.

    Parameters
    ----------
    array : np.ndarray
        Array containing the selected heatwave indicator.
    kwargs : dict
        Metadata of the selected heatwave indicator.
    indicator : str
        Heatwave indicator to write to the new GeoTIFF file.
    decade : int
        Decade of the selected heatwave indicator.
    """
    # Path to the new GeoTIFF file
    hwi_filepath = f"data/transformed/average_{indicator}_{decade}s_proj.tif"

    # Setting to default GTiff driver as we will be using `rio-cogeo.cog_translate()`
    # predictor=2/standard predictor implies horizontal differencing
    kwargs.update(driver="GTiff", count=1, predictor=2)

    # Round to the specified number of decimals
    if round_decimals:
        print(f"Rounding to {round_decimals} decimals...")
        array = np.round(array, round_decimals)

    # Replace 0 values with NaN
    if replace_zero:
        print("Replacing 0 values with NaN...")
        array = np.where(array == 0, np.nan, array)

    with rasterio.open(hwi_filepath, "w", **kwargs) as dst:
        dst.write(array, 1)

    print(f"New GeoTIFF file written to: {hwi_filepath}")
    print("Validate the new GeoTIFF file...")
    cog_validate(hwi_filepath)


def hwi_to_cog(indicator, decade):
    # Path to heatwave indicator GeoTIFF file
    hwi_filepath = f"data/transformed/average_{indicator}_{decade}s_proj.tif"

    # Path to the new GeoTIFF file
    hwi_cog_filepath = (
        f"data/transformed/cog/average_{indicator}_{decade}s_proj_COG.tif"
    )

    with rasterio.open(hwi_filepath) as src:
        dst_profile = cog_profiles.get("deflate")

        # Creating destination COG
        cog_translate(
            src, hwi_cog_filepath, dst_profile, use_cog_driver=True, in_memory=False
        )

    print(f"New Cloud Optimized GeoTIFF file written to: {hwi_cog_filepath}")
    print("Validate the new Cloud Optimized GeoTIFF file...")
    cog_validate(hwi_cog_filepath)
