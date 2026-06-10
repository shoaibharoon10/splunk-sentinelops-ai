# Load Data to Splunk Enterprise - Runbook

This runbook describes how to manually install Splunk Enterprise, create the target index, upload the synthetic SOC log datasets (`demo-data/`), and verify the ingestion status.

---

## 1. Install & Start Splunk Enterprise

1. Download **Splunk Enterprise** (v9.0+ recommended) from the official website.
2. Follow the installation steps for your Operating System:
   - **Windows**: Run the `.msi` installer.
   - **macOS**: Install the `.dmg` or extract the `.tgz` package.
   - **Linux**: Install via `.deb`, `.rpm`, or `.tgz` archive.
3. Configure the admin user credentials (default: `admin` and your chosen password) during setup.
4. Verify the Splunk services are running:
   - **Web UI**: Access `http://localhost:8000` in your browser.
   - **Management REST Port**: Default is `https://localhost:8089`.

---

## 2. Create the target index: `sentinelops`

Before uploading any files, you must create a dedicated index named `sentinelops` where all SOC logs will reside:

1. Log in to the Splunk Web UI (`http://localhost:8000`).
2. Navigate to **Settings** > **Indexes** in the top right menu.
3. Click the green **New Index** button.
4. Input the following details:
   - **Index Name**: `sentinelops`
   - **Index Data Type**: `Events`
   - Leave other configurations as default.
5. Click **Save**.

---

## 3. Upload Synthetic CSV Logs

We will import the four CSV files located in `demo-data/` into the `sentinelops` index.

For each CSV file, perform the following steps:

1. Go to **Settings** > **Add Data**.
2. Select **Upload files from my computer** (or click **Upload**).
3. Click **Select File** and navigate to your `demo-data/` directory. Choose the target file:
   - File 1: `auth_logs.csv`
   - File 2: `endpoint_logs.csv`
   - File 3: `firewall_logs.csv`
   - File 4: `web_logs.csv`
4. Click **Next** to proceed to **Set Source Type**:
   - Under **Source Type**, select **New**.
   - Input the corresponding custom sourcetype string exactly:
     - For `auth_logs.csv` -> `sentinelops:auth`
     - For `endpoint_logs.csv` -> `sentinelops:endpoint`
     - For `firewall_logs.csv` -> `sentinelops:firewall`
     - For `web_logs.csv` -> `sentinelops:web`
   - Click **Save As**, input the Name as the sourcetype string, set category as **Structured**, and click **Save**.
5. Click **Next** to proceed to **Input Settings**:
   - Set **Host** field: Select **Constant value** and leave it blank or input `win-dc-01` (default host).
   - Set **Index**: Select **sentinelops** from the drop-down menu.
6. Click **Review** and then **Submit**.

---

## 4. Time Range and Verification

Because the seed datasets contain fixed simulated timestamps, searches must use the **All time** search range to guarantee they appear.

1. Navigate to the default **Search & Reporting** app inside Splunk Web UI.
2. Change the time range selector (default is "Last 24 hours") to **All time**.
3. Execute the verification query:
   ```spl
   index=sentinelops
   ```
4. Verify you see authentication, endpoint, firewall, and web logs with their respective sourcetypes properly indexed.
