
import pandas as pd
import json
import sys
from pathlib import Path

def profile_dataset(filepath, report_id):
    try:
        file_ext = Path(filepath).suffix.lower()
        
        if file_ext == '.csv':
            try:
                # Try reading with default comma delimiter
                df = pd.read_csv(filepath)
                # If only one column is detected, try with other delimiters
                if len(df.columns) == 1:
                    # Try tab
                    df_tab = pd.read_csv(filepath, sep='\t')
                    if len(df_tab.columns) > 1:
                        df = df_tab
                    else:
                        # Try semicolon
                        df_semi = pd.read_csv(filepath, sep=';')
                        if len(df_semi.columns) > 1:
                            df = df_semi
            except:
                # Fallback to python engine if C engine fails
                df = pd.read_csv(filepath, sep=None, engine='python')
        elif file_ext in ['.xlsx', '.xls']:
            df = pd.read_excel(filepath)
        elif file_ext == '.json':
            df = pd.read_json(filepath)
        else:
            # As a fallback for unknown text-based formats
           df = pd.read_csv(filepath, delimiter='\t', engine='python')

        # Clean up "Unnamed: 0" index columns if they exist
        if 'Unnamed: 0' in df.columns:
            # Check if it looks like an index (sequential integers)
            if pd.api.types.is_integer_dtype(df['Unnamed: 0']):
                df = df.drop(columns=['Unnamed: 0'])
        
        # Also handle other variations like "id" if it's just an index
        # But be careful not to drop real data. "Unnamed: 0" is usually safe to drop.

        profile = {
            'reportId': report_id,
            'rowCount': len(df),
            'columnCount': len(df.columns),
            'columns': list(df.columns),
            'dtypes': {col: str(dtype) for col, dtype in df.dtypes.items()},
            'numericColumns': list(df.select_dtypes(include=['number']).columns),
            'categoricalColumns': list(df.select_dtypes(include=['object', 'category']).columns),
            'sampleData': df.head(5).to_dict('records')
        }
        
        print(json.dumps(profile))

    except Exception as e:
        error_report = {'error': str(e), 'filepath': filepath, 'report_id': report_id}
        print(json.dumps(error_report), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: python profile_data.py <filepath> <report_id>"}), file=sys.stderr)
        sys.exit(1)
        
    filepath_arg = sys.argv[1]
    report_id_arg = sys.argv[2]
    
    profile_dataset(filepath_arg, report_id_arg)
