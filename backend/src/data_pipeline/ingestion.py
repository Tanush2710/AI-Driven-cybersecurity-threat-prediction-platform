import pandas as pd
import io

def parse_training_data(content: bytes, content_type: str):
    """
    Parses uploaded training data into a pandas DataFrame.
    Supports CSV and JSON.
    """
    try:
        # Basic content type check
        if "json" in content_type:
             return pd.read_json(io.BytesIO(content))
        
        # Default to CSV
        return pd.read_csv(io.BytesIO(content))
    except Exception as e:
        print(f"Error parsing data: {e}")
        return None
