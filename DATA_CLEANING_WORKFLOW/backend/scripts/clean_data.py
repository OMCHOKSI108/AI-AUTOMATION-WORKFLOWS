import pandas as pd
import json
import sys
from pathlib import Path

def clean_dataset(filepath, report_id):
    try:
        file_ext = Path(filepath).suffix.lower()
        if file_ext == '.csv':
            df = pd.read_csv(filepath)
        elif file_ext in ['.xlsx', '.xls']:
            df = pd.read_excel(filepath)
        elif file_ext == '.json':
            df = pd.read_json(filepath)
        else:
            return error_output("Unsupported file type for cleaning", filepath, report_id)

        cleaning_report = {
            'reportId': report_id,
            'steps': [],
            'originalRowCount': len(df)
        }

        numeric_cols = df.select_dtypes(include=['number']).columns
        for col in numeric_cols:
            if df[col].isnull().any():
                median_val = df[col].median()
                df[col].fillna(median_val, inplace=True)
                cleaning_report['steps'].append(f'Filled numeric column {col} with median {median_val}')

        categorical_cols = df.select_dtypes(include=['object', 'category']).columns
        for col in categorical_cols:
            if df[col].isnull().any():
                mode_series = df[col].mode()
                fill_val = mode_series.iloc[0] if not mode_series.empty else 'Unknown'
                df[col].fillna(fill_val, inplace=True)
                cleaning_report['steps'].append(f'Filled categorical column {col} with {fill_val}')

        dup_before = df.duplicated().sum()
        if dup_before > 0:
            df = df.drop_duplicates()
            cleaning_report['steps'].append(f'Removed {dup_before} duplicate rows')

        cleaned_path = str(Path(filepath).with_stem(Path(filepath).stem + '_cleaned'))
        if file_ext == '.csv':
            df.to_csv(cleaned_path, index=False)
        elif file_ext in ['.xlsx', '.xls']:
            df.to_excel(cleaned_path, index=False)
        elif file_ext == '.json':
            df.to_json(cleaned_path, orient='records')

        # Return the cleaned file path relative to the backend container for download
        # Assuming /app/uploads is the mount point
        relative_path = Path(cleaned_path).name
        
        cleaning_report['cleanedFilePath'] = cleaned_path
        cleaning_report['downloadPath'] = relative_path
        cleaning_report['finalRowCount'] = len(df)
        print(json.dumps(cleaning_report))
    except Exception as e:
        return error_output(str(e), filepath, report_id)

def error_output(message, filepath, report_id):
    error_obj = {
        'reportId': report_id,
        'error': True,
        'errorMessage': message,
        'filepath': filepath
    }
    print(json.dumps(error_obj))
    return

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print(json.dumps({ 'error': True, 'errorMessage': 'Usage: python clean_data.py <filepath> <report_id>' }))
        sys.exit(1)
    clean_dataset(sys.argv[1], sys.argv[2])
