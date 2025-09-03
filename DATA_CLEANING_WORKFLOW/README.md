

#  Project Blueprint: Automated Data Cleaning & AI-Driven EDA System

## Overview

This project allows users to upload datasets (CSV, Excel, PDF, TXT).
The system automatically:

1. Cleans the data
2. Runs **EDA (Exploratory Data Analysis)**
3. Uses **Gemini AI** to decide the best analysis methods
4. Generates **plots + insights**
5. Saves results in **PostgreSQL**
6. Displays results in a **Next.js frontend**

---

## 🛠 Tech Stack

* **Frontend**: Next.js (Vercel deploy)
* **Storage**: Google Drive (15GB free) or S3 (Cloudflare R2 free tier)
* **Automation Engine**: n8n (self-hosted or cloud)
* **Database**: PostgreSQL (Supabase/Neon free tier)
* **AI**: Gemini API (free tier available)
* **Python**: pandas, matplotlib, seaborn (via n8n Python node or external FastAPI service)

---

## 🔹 System Workflow

```
Frontend (Next.js on Vercel)
   │
   ├── Upload file → API (/api/upload)
   │        │
   │        └── Save file → Google Drive/S3
   │        └── Notify n8n (Webhook with file_id + metadata)
   │
n8n Workflow
   │
   ├── Webhook Trigger (file metadata)
   ├── Google Drive Node (download file binary)
   ├── Python Node (profile dataset → summary JSON)
   ├── Gemini Node (decide suitable analysis steps)
   ├── Python Node (execute analysis & plots based on plan)
   ├── Storage Node (upload plots to Drive/S3)
   ├── Gemini Node (generate human-friendly insights)
   ├── PostgreSQL Node (save summary, plots, insights)
   │
   └── Respond with report_id
   │
Frontend (Next.js)
   │
   ├── /api/reports?id=123 → fetch results from Postgres/n8n
   └── Display: summary + plots + insights
```

---

## 🔹 Step-by-Step Guide

### **1. Frontend (Next.js on Vercel)**

* **Upload Page**:

  ```jsx
  export default function Upload() {
    async function handleUpload(e) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      await fetch("/api/upload", { method: "POST", body: formData });
    }
    return <input type="file" onChange={handleUpload} />;
  }
  ```

* **API Route `/api/upload`**:

  * Uploads file → Google Drive/S3 (service account)
  * Calls **n8n Webhook** with metadata:

    ```json
    {
      "file_id": "123abc",
      "file_name": "dataset.csv",
      "user_id": "captain01"
    }
    ```

---

### **2. n8n Workflow**

1. **Webhook Trigger**
   Receives `{file_id, file_name, user_id}`.

2. **Google Drive Node**
   Downloads file in **binary**.

3. **Python Node (Profiling)**
   Extracts columns, dtypes, row count, sample values → returns JSON.

4. **Gemini Node (Analysis Plan)**

   * Prompt:

     ```
     You are a data science assistant.
     Given dataset profile:
     {{ $json["profile"] }}
     Decide which analysis steps are suitable.
     Return JSON like:
     {
       "analysis": [
         "univariate_histograms",
         "correlation_heatmap",
         "scatter_numeric_pairs"
       ]
     }
     ```

5. **Python Node (EDA Execution)**
   Runs analysis steps returned by Gemini.

   * Histograms for numeric columns
   * Correlation heatmap
   * Scatter plots
   * Boxplots for categorical vs numeric

6. **Storage Node**
   Upload plots → Drive/S3 → get URLs.

7. **Gemini Node (Insights)**

   * Prompt:

     ```
     Based on these results:
     Summary: {{ $json["summary"] }}
     Plots: {{ $json["plots"] }}
     Write a clear set of insights in plain English.
     ```

8. **PostgreSQL Node**
   Save into `reports` table:

   ```sql
   CREATE TABLE reports (
     id SERIAL PRIMARY KEY,
     user_id TEXT,
     file_name TEXT,
     file_type TEXT,
     summary JSONB,
     plots JSONB,
     insights TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

9. **Webhook Response**
   Return `{report_id: 123}` to frontend.

---

### **3. Frontend (Next.js)**

* `/reports/[id].js` → fetch report from n8n/Postgres.
* Display:

  * Dataset summary (rows, cols, missing values)
  * Plots (render base64 or from Drive/S3 URLs)
  * Gemini insights in plain text

---

## 🔹 Improvements vs Flaws

### ✅ Improvements

* Gemini dynamically decides analysis → smart & adaptive.
* Modular design → storage, AI, DB can be swapped easily.
* Free tiers available for all components.

### ❌ Flaws & Fixes

* **Google Drive Trigger delay** → use Webhook instead (faster).
* **n8n Python node limited** → external FastAPI microservice is more scalable.
* **Frontend-only upload risky** (API key leaks) → must use Next.js API route backend.

---

## 💰 Cost & Free Tiers

* **Vercel (Next.js)** → Free (125GB bandwidth / 100GB-hours runtime).
* **Google Drive** → Free 15GB.
* **PostgreSQL** → Free (Supabase, Neon, Render).
* **n8n** → Free self-host / Docker.
* **Gemini API** → Free 15 req/min.

✅ 100% free to build MVP.

---

## 🔹 Future Extensions

* Add support for **Excel, PDF, JSON, Parquet**.
* Interactive dashboard with **Plotly/Streamlit**.
* User authentication (Supabase Auth).
* Paid tier (larger files, advanced ML like clustering, PCA, forecasting).

---

# ✅ Conclusion

This project creates a **no-code + AI-powered data analysis system**.

* Users upload files → AI + automation clean, analyze, and visualize data.
* Gemini makes the analysis smart and adaptive.
* PostgreSQL ensures persistence.
* Next.js frontend makes it SaaS-ready.
