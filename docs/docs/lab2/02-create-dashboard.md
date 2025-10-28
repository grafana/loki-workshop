---
sidebar_position: 2
---

# 2.2. Build a dashboard with Loki

## Create a dashboard with metrics from logs

Let’s create our first Loki dashboard using label and metrics extraction queries.

1. Click the plus button in the top right of Grafana to create a new dashboard.

2. Select **last 3 hours** in the time picker (top right)

3. Click **Save dashboard** and give your dashboard a name. 

### Add a 95th percentile panel

We're now going to add a panel showing the 95th percentile of requests time:

1. Click the **Add Visualization** button.

1. Select the **LokiNGINX** datasource.

1. Add the following query, which extracts the _request time_ from every log line, and calculates the 95th percentile of that value:

    ```
    quantile_over_time(0.95,{filename="/var/log/nginx/json_access.log"} 
        | json 
        | upstream_cache_status="MISS" 
        | unwrap request_time 
        |  __error__=""  [5m]) by (host)
    ```

    This query gives you insight into the near-worst-case performance of requests that weren't served from cache, broken down by host. 
    
    Specifically, _95th percentile_ means that 95% of the requests have a shorter response time than this value, while only 5% take longer. Percentiles are useful for identifying performance issues, or unusual patterns in request times for non-cached content, as it captures the slowest requests, without being overly influenced by rare, extreme outliers.

1. Click **+ Add query** to add a second query to this panel, to show the max request time within every 1 min interval:

    ```
    max_over_time({filename="/var/log/nginx/json_access.log"} 
        | json 
        | upstream_cache_status="MISS" 
        | unwrap request_time 
        |  __error__=""  [1m]) by (host)
    ```

1. Click on the **Options** panel underneath each query, and:

    - set the **Legend** value of the 95th percentile query to : `{{host}} - 95%` 

    - set the **Legend** value of the max_over_time query to `{{host}} - max`

    :::info
    
    The `{{host}}` placeholder tells Grafana to insert the `host` label from the Loki metric query result.

    :::

1.  In the **Panel options** sidebar, set the Panel Title to **95th percentile of Request Time** and then click the **Back to dashboard** button.

1.  Click **Save dashboard** to save your fine work so far!
  
### Add a percentage of requests by Googlebot panel

We're now going to add a panel showing the percentage of request made by Google's webspider, Googlebot.

1. From the the upper right corner, click **Add** -> **Visualization**.

2. Select the **LokiNGINX** datasource

3. Add the following query. Notice we are doing some math here with Loki metrics! In this case, we are calculating the percentage of requests from Googlebot compared with requests from any browser (`Mozilla`), per 10-minute interval: 

    ```
    sum(rate(({filename="/var/log/nginx/json_access.log"} 
        |= "Googlebot")[10m])) 
    / 
    (sum(rate(({filename="/var/log/nginx/json_access.log"} |= "Mozilla")[10m])) / 100)
    ```

4. We want to show it as a total number, so in the panel settings on the right, at the top, change the Visualization to **Stat**.

5. The Stat panel shows a large, bold number which is calculated by Grafana from the results. We want to show the current percentage, so scroll down to **Value options** and in the **Calculation** field, ensure that **Last** is selected.

6. We want to make clear this metric is a percentage.  Under the **Standard Options** heading, find the **Unit** dropdown and choose **Misc -> Percent (0-100)**.

8. Set the Panel Title to **Current % of request by Google** and click **Back to dashboard**.

9.  Don't forget to save your dashboard with the **Save dashboard** button.

### Geomap panel 

Geomap using the country code that was added by geocoding the IP address. 

1. Ensure you're in Edit mode in your dashboard. (From Grafana 11 onwards, you need to click the **Edit** button in the top right corner.)

1. Click **Add** -> **New visualization**.

2. Select the `LokiNGINX` datasource.

3. Paste the following query, which counts the log lines, grouped by the extracted country_code:

    ```
    sum by (geoip_country_code) (count_over_time({filename="/var/log/nginx/json_access.log"} | json | __error__="" [1m]))
    ```

4.  Underneath the query box, click **Options** to expand the options panel, and set the **Legend** value to `{{geoip_country_code}}`.

1.  Above the query, click on the **Transformations** tab, then **Add transformation**. 

1.  From the transformations palette, add the **Reduce** transformation, and select the **Series to rows** Mode. For the **Calculations** field, select **Total**.

1.  In the sidebar, click on the dropdown at the top and change the panel type to **Geomap**.

1.  In the **Panel options** sidebar, change the following settings:

    - Under **Map layers**, change the **Layer type** to **ArcGIS MapServer**.
    - Click the **Add layer** button and add a new layer of type **Markers**. This will add a new layer above the existing layer. It's important for visualization that the ArcGis MapServer layer is shown underneath the Markers.
    - Click on the new **Markers** layer, and:
        - change **Location Mode** from **Auto** to **Lookup**
        - change the **Lookup field** to **Field**
        - Make sure the **Gazetteer** field is **Countries**
        - Make sure **Styles Size** field is **Total**, with Min 10 and Max 40
        - Make sure **Color** is **Fixed Color** and pick the **red** color
        - Set **Fill opacity** to **0.8**

    - Change the panel title to **Total requests per country**.

1.  Return to your dashboard and **save** your progress.

### Rewriting log lines

In Loki, you can transform log data during query execution using `line_format` for log lines and `label_format` for labels. This allows you to reshape your log data on-the-fly, extracting specific information or reformatting it for a more coherent view in a dashboard.

You can find more documentation here: https://grafana.com/docs/loki/latest/query/log_queries/#line-format-expression

Let's reformat the results of our Loki query and visualize on our dashboard:

1.  From the dashboard, click **Add** then **Visualization**. 

2.  Select the **LokiNGINX** datasource.

3.  In the sidebar, in the dropdown at the top, select the **Logs** visualization.

1.  Add the following query into the query box:

    ```
    {filename="/var/log/nginx/json_access.log"} | json | line_format "🚀 request for {{.request_uri}} with HTTP status: {{.status}} ✌️"
    ```

    Notice how we:

    - use the `json` parser to extract values from JSON at query time 
    - use `line_format` to rewrite the log lines 
    - reference JSON fields using the `{{.my_field}}` syntax

4.  Change the title of the panel to **Logs** and then return to your dashboard.

5.  Save your work.

Congratulations! You've completed the hands-on sections of this breakout. Next, we'll import a fully-complete dashboard which you can explore.

