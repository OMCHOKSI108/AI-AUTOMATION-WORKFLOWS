# How to Upload CSV Files - SANS EDA

## Quick Start Guide

### Step 1: Start the Application

**Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will run at: `http://localhost:3001`

**Backend:**
```bash
cd backend
npm start
```
The backend will run at: `http://localhost:3000`

### Step 2: Access the Application

1. Open your browser and go to: `http://localhost:3001`
2. You'll see the Welcome page

### Step 3: Create an Account (First Time Only)

1. Click the **"Signup"** button
2. Fill in:
   - Username
   - Email
   - Password
   - Confirm Password
3. Click **"Create Account"**
4. You'll be automatically logged in and redirected to the Dashboard

### Step 4: Login (If You Already Have an Account)

1. Click the **"Login"** button from the Welcome page
2. Enter your:
   - Email or Username
   - Password
3. Click **"Sign In"**
4. You'll be redirected to the Dashboard

### Step 5: Upload Your CSV File

Once logged in, you'll see the **Dashboard** with:

#### Upload Section
- **Drag and drop** your CSV file into the upload area, OR
- Click **"Upload a file"** to browse and select your file

#### Supported File Types:
- ✅ CSV (`.csv`)
- ✅ Excel (`.xlsx`, `.xls`)
- ✅ JSON (`.json`)
- ✅ TXT (`.txt`)

#### File Size Limit:
- Maximum: **50MB**

#### After Upload:
1. Click the **"Analyze Dataset"** button
2. You'll be redirected to the Analysis Report page
3. The backend and n8n workflow will process your file
4. Results will appear on the report page

## Navigation

After logging in, you can navigate using the sidebar:

- **📊 Dashboard** - Upload new datasets (this is where you upload CSV files)
- **📝 History** - View all your past analyses
- **👤 Profile** - Manage your user profile
- **⚙️ Settings** - Configure your preferences

## Troubleshooting

### I don't see the upload page
**Solution:** Make sure you're logged in! The upload page is on the Dashboard, which requires authentication.

### I'm stuck on the Welcome page
**Solution:** Click "Login" or "Signup" to access the application.

### The upload button is disabled
**Solution:** Select a file first by either dragging and dropping or clicking "Upload a file".

### File upload fails
**Check:**
- Is the backend server running? (`http://localhost:3000`)
- Is the file under 50MB?
- Is it a supported file type (CSV, Excel, JSON, TXT)?
- Check browser console for error messages (F12)

## Features on Dashboard

### Statistics Cards
- **Total Reports** - Total number of analyses
- **Processing** - Currently processing files
- **Completed** - Successfully completed analyses
- **Failed** - Failed analyses

### Recent Reports
View your 5 most recent analysis reports with:
- File name
- Status badge (Processing/Completed/Failed)
- Created date
- Quick link to view full report

### Upload New Dataset
The main upload form where you can:
- Drag and drop files
- Browse for files
- See selected file name and size
- Remove selected file
- Submit for analysis

## Quick Test

1. Go to `http://localhost:3001`
2. Click **"Signup"** or **"Login"**
3. You should see the **Dashboard** with:
   - 4 statistics cards at the top
   - Upload section in the center
   - Recent reports on the right (if you have any)

That's it! 🎉 You're ready to upload and analyze your CSV files!
