import sys
import os
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# Configure plotting
plt.style.use('ggplot')
sns.set(font_scale=1.1)

def convert_numpy(obj):
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, datetime):
        return obj.isoformat()
    return obj

def analyze_data(file_path, report_id, output_dir):
    try:
        # Determine file type and read with robust error handling
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == '.csv':
            # Try multiple delimiters for CSV
            try:
                df = pd.read_csv(file_path, encoding='utf-8')
                if len(df.columns) == 1:
                    df = pd.read_csv(file_path, sep='\t', encoding='utf-8')
                if len(df.columns) == 1:
                    df = pd.read_csv(file_path, sep=';', encoding='utf-8')
                if len(df.columns) == 1:
                    df = pd.read_csv(file_path, sep='|', encoding='utf-8')
            except UnicodeDecodeError:
                # Try different encodings
                for encoding in ['latin-1', 'iso-8859-1', 'cp1252']:
                    try:
                        df = pd.read_csv(file_path, encoding=encoding)
                        break
                    except:
                        continue
            except Exception as e:
                # Fallback to sniffer
                df = pd.read_csv(file_path, sep=None, engine='python', encoding='utf-8')
        elif ext in ['.xlsx', '.xls']:
            df = pd.read_excel(file_path, engine='openpyxl' if ext == '.xlsx' else None)
        elif ext == '.json':
            try:
                df = pd.read_json(file_path)
            except ValueError:
                # Try lines format
                df = pd.read_json(file_path, lines=True)
        elif ext == '.txt':
            # Attempt to parse as CSV with auto-detection
            df = pd.read_csv(file_path, sep=None, engine='python')
        elif ext == '.parquet':
            df = pd.read_parquet(file_path)
        else:
            raise ValueError(f"Unsupported file extension: {ext}. Supported: CSV, Excel, JSON, TXT, Parquet")

        # Basic Stats
        summary = {
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": list(df.columns),
            "missing_values": df.isnull().sum().to_dict(),
            "dtypes": df.dtypes.astype(str).to_dict(),
            "numerical_columns": list(df.select_dtypes(include=[np.number]).columns),
            "categorical_columns": list(df.select_dtypes(include=['object', 'category']).columns)
        }

        # Descriptive Statistics
        desc_stats = df.describe(include='all').to_dict()
        
        # Clean NaN in stats for JSON serialization
        for col, stats in desc_stats.items():
            for stat, value in stats.items():
                if pd.isna(value):
                    desc_stats[col][stat] = None

        summary["statistics"] = desc_stats

        # Generate Plots
        plot_paths = []
        
        # 1. Correlation Matrix (Numerical only)
        num_df = df.select_dtypes(include=[np.number])
        if not num_df.empty and num_df.shape[1] > 1:
            try:
                fig_size = min(max(num_df.shape[1] * 0.8, 8), 16)
                plt.figure(figsize=(fig_size, fig_size * 0.9))
                corr = num_df.corr()
                
                # Use mask for better visualization
                mask = np.triu(np.ones_like(corr, dtype=bool))
                sns.heatmap(corr, mask=mask, annot=True, cmap='RdYlGn', center=0,
                           fmt=".2f", square=True, linewidths=0.5, cbar_kws={"shrink": 0.8})
                plt.title('Correlation Matrix', fontsize=16, fontweight='bold', pad=20)
                plt.tight_layout()
                
                corr_filename = f"{report_id}_correlation.png"
                corr_path = os.path.join(output_dir, corr_filename)
                plt.savefig(corr_path, dpi=100, bbox_inches='tight')
                plt.close()
                plot_paths.append(f"/results/{corr_filename}")
            except Exception as e:
                print(f"Warning: Could not create correlation matrix: {e}", file=sys.stderr)
                plt.close()

        # 2. Distribution of Numerical Columns (Top 6)
        for col in summary["numerical_columns"][:6]:
            try:
                plt.figure(figsize=(10, 6))
                data = df[col].dropna()
                if len(data) > 0:
                    sns.histplot(data, kde=True, color='#007eb9', edgecolor='black')
                    plt.title(f'Distribution of {col}', fontsize=14, fontweight='bold')
                    plt.xlabel(col, fontsize=12)
                    plt.ylabel('Frequency', fontsize=12)
                    plt.grid(axis='y', alpha=0.3)
                    plt.tight_layout()
                    
                    dist_filename = f"{report_id}_dist_{col}.png"
                    # Sanitize filename
                    dist_filename = "".join([c for c in dist_filename if c.isalpha() or c.isdigit() or c in ['_', '-', '.']])
                    
                    dist_path = os.path.join(output_dir, dist_filename)
                    plt.savefig(dist_path, dpi=100, bbox_inches='tight')
                    plt.close()
                    plot_paths.append(f"/results/{dist_filename}")
            except Exception as e:
                print(f"Warning: Could not create distribution plot for {col}: {e}", file=sys.stderr)
                plt.close()

        # 3. Missing Values Heatmap
        if df.isnull().sum().sum() > 0:
            plt.figure(figsize=(10, 6))
            sns.heatmap(df.isnull(), cbar=False, cmap='viridis')
            plt.title('Missing Values Map')
            plt.tight_layout()
            
            missing_filename = f"{report_id}_missing.png"
            missing_path = os.path.join(output_dir, missing_filename)
            plt.savefig(missing_path)
            plt.close()
            plot_paths.append(f"/results/{missing_filename}")

        # Prepare Result
        result = {
            "summary": summary,
            "plots": plot_paths,
            "status": "success"
        }
        
        print(json.dumps(result, default=convert_numpy))

    except Exception as e:
        error_result = {
            "status": "error",
            "message": str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(json.dumps({"status": "error", "message": "Usage: python analyze_data.py <file_path> <report_id> <output_dir>"}))
        sys.exit(1)
        
    file_path = sys.argv[1]
    report_id = sys.argv[2]
    output_dir = sys.argv[3]
    
    analyze_data(file_path, report_id, output_dir)
