# Ad hoc metrics with Grafana Loki

## Write LogQL Metric queries with the explorer view: Query time labels extraction

1. Go to Explorer  in the left menu, and select the LokiNGINX datasource
2. Run the query `{filename="/var/log/nginx/json_access.log"} |= "Googlebot"` for the last 5 minutes, notice you get json log lines of googlebot requests. Click a log line to see it’s details.
3. Query time labels extraction
    - We use the JSON parser to extract the HTTP status code from the raw log line.
    - Run the following request to get the amount of Googlebot requests per minute, split out by statuscode: `sum by (status) (count_over_time({filename="/var/log/nginx/json_access.log"} |= "Googlebot" | json [5m]))`
    - Run the following request to get the amount of requests per minute, split out by http_method `sum by (request_method) (count_over_time({filename="/var/log/nginx/json_access.log"} | json [5m]))`

## Write LogQL Metric queries with the explorer view: Query time metrics extraction

1. Run the following query to extract the byte_send from every log line, and calculate how many avg bytes are requested by GoogleBot for every 5 minutes.
`avg_over_time({filename="/var/log/nginx/json_access.log"} |= "Googlebot" | json | unwrap bytes_sent [5m]) by (host)`
2. Add another query, by pressing the + Add query button, and add the following query. (Run with shift-enter)
`max_over_time({filename="/var/log/nginx/json_access.log"} |= "Googlebot" | json | unwrap bytes_sent [5m]) by (host)`
    - Notice that there is a second metric series added to the graph, where we return the max amount of response bytes within that `5m` interval.

## Loki dashboard with ad hoc metrics

Let’s create our first Loki dashboard using label and metrics extraction queries.

1. Click the "+" button on the right menu bar and select "New Dashboard" to create a new dashboard
2. Select last 3 hours in the time picker (top right)
3. Click the save button and give your dashboard a name. 

### 95th percentile percentile panel

We're now going to add a panel showing the 95th percentile of requests time:
1. Click the "+ Add visualization" button
2. Select the `LokiNGINX` datasource
3. Add the following query which extracts the total request time from every log line, and calculates the 95th percentile. Which is the max request time of 95% within the interval of five minutes; `quantile_over_time(0.95,{filename="/var/log/nginx/json_access.log"} | json | upstream_cache_status="MISS" | unwrap request_time |  __error__=""  [5m]) by (host)`
4. Add another query here, that will show the max request time within every 1 min interval; `max_over_time({filename="/var/log/nginx/json_access.log"} | json | upstream_cache_status="MISS" | unwrap request_time |  __error__=""  [1m]) by (host)`
5. Set the legend value of the 95th percentile value to : `{{host}} - 95%` and set the legend value of the max query to `{{host}} - max`
5. Set panel title to `95th percentile of Request Time` and save the panel.
  
### Percentage of request by googlebot panel

We're now going to add a panel showing the percentage of request made by Google's webspider, Googlebot.
1. Click Add in the dashboard header and select Visualization in the dropdown.
2. Select the `LokiNGINX` datasource
3. Add the following query. Notice we are doing some math here with loki metrics! In this case we are calculating the percentage of request by Googlebot vs the total request, per 10 minute interval: `sum(rate(({job="nginx_access_log"} |= "Googlebot")[10m])) / (sum(rate(({job="nginx_access_log"} |= "Mozilla")[10m])) / 100)`
4. We want to show it as a total number, so in the panel settings on the right, choose the Stat visualisation 
5. It now shows the mean value over the current time range, and we want the show the current percentage, so scroll down to `Value Options` and set Value to Last.  
6. We want to make clear this metrics is a percentage.  Go to `Standard Options` and set the Unit option to `percent (0-100)` as value. (This option can be found under Misc)
7. Below the Unit option is a field called Max.  Set Max to `5` as we do not anticipate the percentage of Googlebot requests to be higher than 5% of the overall total.
8. Set panel title to `current % of request by Google` and save the panel.

### Geomap panel 

Geomap using the country code that was added by geocoding the IP address. 

1. Click Add in the dashboard header and select Visualization in the dropdown.
2. Select the `LokiNGINX` datasource
3. Add the following query which counts the log lines, grouped by the extracted country_code; `sum by (geoip_country_code) (count_over_time({filename="/var/log/nginx/json_access.log"} | json | __error__="" [1m]))`
4. And put as Legend value: `{{geoip_country_code}}`
5. In Panel tab on the right, select the Geomap panel as the visualisation
6. Add a "Series to rows" transformation to the query
7. Change the "Markers" layer type to `ArcGis MapServer`
8. Add a new layer of type "Markers" (the ArcGis MapServer being a lower level than Markers is important for visualising)
9. Click on the "Markers" layer and set location to from "Auto" to "Lookup" and the lookup field to "Metric"
10. Set panel title to `Total requests per country` 
12. Save the panel

### Re-writing log lines

With Loki v2 you can now rewrite log lines with `line_format` and labels with `label_format`. More documentation here: https://grafana.com/docs/loki/latest/logql/#Line-Format-Expression

1. Click Add in the dashboard header and select Visualization in the dropdown.
2. Select the `LokiNGINX` datasource
3. Choose the Logs visualisation
3. Add the following query which re-formats every log line
`{filename="/var/log/nginx/json_access.log"} | json | line_format "🚀 request for {{.request_uri}} with HTTP status: {{.status}} ✌️"`
4. Set panel title to `Logs` and save the panel.

## Import the full sample web analytics demo dashboard

To import a dashboard click the "+" button in the top right menu bar, and select Import Dashboard
1. The dashboard id is: `12559`
2. Set the `LokiNGINX` as the Loki-datasource
3. Set `Label Name` to `filename`
4. Set `Label Value` to `/var/log/nginx/json_access.log`
5. You can now explore some of the panels, like the: 
    - % of 5xx requests
    - Top requested pages
    - Top user agents
    - Top IP addresses
    - Log panel




