# Splunk REST API Triage - Curl Reference

This guide provides test templates using `curl` to verify authentication, job creation, polling status, and results extraction directly against the Splunk Enterprise management REST API port (`8089`).

---

## 1. Verify REST API Endpoint Access
Check connectivity and extract server settings using basic authentication:
```bash
curl -k -u admin:your_password https://localhost:8089/services/server/info?output_mode=json
```
Check connectivity using Bearer Token authorization:
```bash
curl -k -H "Authorization: Bearer your_splunk_token" https://localhost:8089/services/server/info?output_mode=json
```

---

## 2. Dispatch a Search Job (POST)
Create a new search job in Splunk. The command returns the Search Job SID (`sid`):
```bash
curl -k -u admin:your_password \
     https://localhost:8089/services/search/jobs \
     -d search="search index=sentinelops sourcetype=sentinelops:auth user=admin" \
     -d exec_mode="normal" \
     -d output_mode="json"
```
*Response Example:*
```json
{"sid":"1623325123.12"}
```

---

## 3. Poll Search Job Status (GET)
Check whether the search job has finished by replacing `YOUR_SID` with the ID returned in the previous step:
```bash
curl -k -u admin:your_password \
     https://localhost:8089/services/search/jobs/YOUR_SID?output_mode=json
```
Inspect the output fields in the JSON response:
- `entry[0].content.isDone`: Should be `true` when complete.
- `entry[0].content.dispatchState`: Should be `"DONE"`. If `"FAILED"` or `"CANCELLED"`, check index syntax.

---

## 4. Retrieve Search Results (GET)
Once the job is completed, download the events in JSON format:
```bash
curl -k -u admin:your_password \
     https://localhost:8089/services/search/jobs/YOUR_SID/results?output_mode=json
```
The matching events array will be located under the `"results"` key.

---

## 5. Troubleshooting Guides

### 5.1 Self-signed SSL Certificates Warnings
When connecting to local Splunk Enterprise instances, curl may reject connections due to invalid certificates:
*   *Symptom*: `curl: (60) SSL certificate problem: self signed certificate`
*   *Fix*: Add the `-k` or `--insecure` option in curl command lines. In Python backend requests, use `verify=False` and disable warnings.

### 5.2 Bad Credentials Handling
If credentials are rejected:
*   *Symptom*: HTTP `401 Unauthorized` or message `Login Failed`.
*   *Fix*: Verify spelling, check active authorization tokens, and make sure Splunk password has not expired.

### 5.3 Empty Results or Time Range Mismatches
If a query runs successfully but returns 0 events:
*   *Symptom*: `results: []` or empty sets.
*   *Fix*: Ensure the dataset timestamps are within the search window. Add `earliest_time` (e.g. `0` or `-1y`) or search with all-time parameters:
    ```bash
    -d earliest_time="0"
    ```
