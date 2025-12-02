import pandas as pd
import json
import sys
from pathlib import Path
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
import numpy as np

# Set backend to Agg to avoid GUI errors
plt.switch_backend('Agg')

def generate_stats(cleaned_filepath, report_id):
    try:
        file_ext = Path(cleaned_filepath).suffix.lower()
        if file_ext == '.csv':
            try:
                # Try reading with default comma delimiter
                df = pd.read_csv(cleaned_filepath)
                # If only one column is detected, try with other delimiters
                if len(df.columns) == 1:
                    # Try tab
                    df_tab = pd.read_csv(cleaned_filepath, sep='\t')
                    if len(df_tab.columns) > 1:
                        df = df_tab
                    else:
                        # Try semicolon
                        df_semi = pd.read_csv(cleaned_filepath, sep=';')
                        if len(df_semi.columns) > 1:
                            df = df_semi
            except:
                # Fallback to python engine if C engine fails
                df = pd.read_csv(cleaned_filepath, sep=None, engine='python')
        elif file_ext in ['.xlsx', '.xls']:
            df = pd.read_excel(cleaned_filepath)
        elif file_ext == '.json':
            df = pd.read_json(cleaned_filepath)
        else:
            return error_output("Unsupported file type for statistics", cleaned_filepath, report_id)

        stats = {'reportId': report_id}

        try:
            stats['basicStats'] = df.describe(include='all').to_dict()
        except Exception:
            stats['basicStats'] = {}

        missing_values = {}
        for col in df.columns:
            miss = df[col].isnull().sum()
            if miss > 0:
                missing_values[col] = {
                    'count': int(miss),
                    'percentage': float(miss / len(df) * 100),
                    'total': len(df)
                }
        stats['missingValues'] = missing_values

        numeric_cols = df.select_dtypes(include=['number']).columns
        
        # --- VISUALIZATION GENERATION ---
        visualizations = {}
        
        # 1. Correlation Matrix (if enough numeric columns)
        if len(numeric_cols) > 1:
            try:
                corr = df[numeric_cols].corr()
                stats['correlations'] = {
                    'matrix': corr.to_dict(),
                    'labels': list(numeric_cols)
                }
                
                fig_size = min(max(len(numeric_cols) * 0.8, 8), 16)
                plt.figure(figsize=(fig_size, fig_size * 0.85))
                
                # Use mask for upper triangle
                mask = np.triu(np.ones_like(corr, dtype=bool))
                sns.heatmap(corr, mask=mask, annot=True, cmap='RdYlGn', center=0,
                           fmt=".2f", square=True, linewidths=0.5, 
                           cbar_kws={"shrink": 0.8, "label": "Correlation"})
                plt.title('Correlation Matrix', fontsize=14, fontweight='bold', pad=15)
                plt.tight_layout()
                visualizations['correlation_matrix'] = fig_to_base64(plt.gcf())
                plt.close()
            except Exception as e:
                stats['correlations'] = {}
                plt.close()
        else:
            stats['correlations'] = {}

        # 2. Distributions (Histograms) for top 6 numeric columns
        distributions = {}
        dist_plots = []
        
        # Limit to top 6 numeric columns to avoid overwhelming the report
        cols_to_plot = numeric_cols[:6]
        
        for col in numeric_cols:
            series = df[col].dropna()
            distributions[col] = {
                'mean': float(series.mean()) if not series.empty else None,
                'median': float(series.median()) if not series.empty else None,
                'std': float(series.std()) if not series.empty else None,
                'min': float(series.min()) if not series.empty else None,
                'max': float(series.max()) if not series.empty else None
            }
            
        # Generate distribution plots with professional styling
        for col in cols_to_plot:
            try:
                plt.figure(figsize=(10, 6))
                data = df[col].dropna()
                if len(data) > 0:
                    sns.histplot(data, kde=True, color='#007eb9', edgecolor='black', alpha=0.7)
                    plt.title(f'Distribution of {col}', fontsize=14, fontweight='bold')
                    plt.xlabel(col, fontsize=12)
                    plt.ylabel('Frequency', fontsize=12)
                    plt.grid(axis='y', alpha=0.3, linestyle='--')
                    
                    # Add statistics annotation
                    mean_val = data.mean()
                    median_val = data.median()
                    plt.axvline(mean_val, color='red', linestyle='--', linewidth=2, label=f'Mean: {mean_val:.2f}')
                    plt.axvline(median_val, color='green', linestyle='--', linewidth=2, label=f'Median: {median_val:.2f}')
                    plt.legend()
                    
                    plt.tight_layout()
                    dist_plots.append({
                        'name': col,
                        'image': fig_to_base64(plt.gcf())
                    })
                plt.close()
            except Exception as e:
                plt.close()
                continue
                
        visualizations['distributions'] = dist_plots
        
        # 3. Categorical Counts (Bar Charts) for top 5 categorical columns
        cat_cols = df.select_dtypes(include=['object', 'category']).columns
        cat_plots = []
        for col in cat_cols[:5]:
            try:
                if df[col].nunique() < 30: # Only plot if not too many unique values
                    plt.figure(figsize=(12, 7))
                    top_cats = df[col].value_counts().head(15)
                    
                    colors = sns.color_palette('viridis', len(top_cats))
                    bars = plt.bar(range(len(top_cats)), top_cats.values, color=colors, edgecolor='black')
                    plt.xticks(range(len(top_cats)), top_cats.index, rotation=45, ha='right')
                    
                    plt.title(f'Top 15 Categories in {col}', fontsize=14, fontweight='bold')
                    plt.xlabel(col, fontsize=12)
                    plt.ylabel('Count', fontsize=12)
                    plt.grid(axis='y', alpha=0.3, linestyle='--')
                    
                    # Add value labels on bars
                    for i, (bar, val) in enumerate(zip(bars, top_cats.values)):
                        plt.text(i, val + max(top_cats.values) * 0.01, str(val), 
                                ha='center', va='bottom', fontsize=9)
                    
                    plt.tight_layout()
                    cat_plots.append({
                        'name': col,
                        'image': fig_to_base64(plt.gcf())
                    })
                plt.close()
            except Exception as e:
                plt.close()
                continue
        
        visualizations['categorical'] = cat_plots

        # 4. K-Means Clustering (Simple "Detective" Analysis)
        # Only if we have at least 2 numeric columns and enough rows
        if len(numeric_cols) >= 2 and len(df) > 10:
            try:
                from sklearn.cluster import KMeans
                from sklearn.preprocessing import StandardScaler
                
                # Use top 2 numeric columns for simple 2D visualization
                cols_for_clustering = numeric_cols[:2]
                X = df[cols_for_clustering].dropna()
                
                if len(X) > 10:
                    scaler = StandardScaler()
                    X_scaled = scaler.fit_transform(X)
                    
                    # Simple 3 clusters
                    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
                    clusters = kmeans.fit_predict(X_scaled)
                    
                    plt.figure(figsize=(10, 6))
                    plt.scatter(X.iloc[:, 0], X.iloc[:, 1], c=clusters, cmap='viridis', alpha=0.6)
                    plt.title(f'Cluster Analysis: {cols_for_clustering[0]} vs {cols_for_clustering[1]}')
                    plt.xlabel(cols_for_clustering[0])
                    plt.ylabel(cols_for_clustering[1])
                    plt.tight_layout()
                    
                    visualizations['clustering'] = fig_to_base64(plt.gcf())
                    plt.close()
                    
                    stats['clustering_insight'] = "Performed K-Means clustering to identify potential groups in the data."
            except Exception as e:
                # print(f"Clustering failed: {e}", file=sys.stderr)
                pass

        stats['distributions'] = distributions
        stats['visualizations'] = visualizations

        print(json.dumps(stats))
    except Exception as e:
        return error_output(str(e), cleaned_filepath, report_id)

def fig_to_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    return f"data:image/png;base64,{img_str}"

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
        print(json.dumps({'error': True, 'errorMessage': 'Usage: python generate_statistics.py <cleaned_filepath> <report_id>'}))
        sys.exit(1)
    generate_stats(sys.argv[1], sys.argv[2])
