# Ad hoc metrics with Grafana Loki

## Write LogQL Metric queries with the explorer view: Query time labels extraction

1. Go to Explorer  in the left menu, and select the LokiPreview datasource
2. Run the query `{filename="/var/log/nginx/access.log"} |= "Googlebot"` for the last 5 minutes, notice you get largely unparsed log lines of googlebot requests. Click a log line to see it’s details.
3. Query time labels extraction
    - We use a regexp to extract statuscode from the raw log line.
    - Run the following request to get the amount of Googlebot requests per minute, split out by statuscode: `count_over_time({filename="/var/log/nginx/access.log"} |= "Googlebot" | regexp "HTTP/1.1\" (?P<statuscode>\\d{3}) "[1m])`
    - Run the following request to get the amount of requests per minute, split out by http_method `count_over_time({filename="/var/log/nginx/access.log"} | regexp "\"(?P<http_method>GET|POST|PUT|DELETE|PATCH|HEAD) "[1m])`

## Write LogQL Metric queries with the explorer view: Query time metrics extraction

1. Run the following query to extract the byte_send from every log line, and calculate how many bytes are requested by GoogleBot for every 5 minutes.
`sum_over_time(({filename="/var/log/nginx/access.log"} |= "Googlebot") | regexp "HTTP\\/1\\.1\" \\d{3} (?P<value>\\d+) " [5m])`
2. Add another query, by pressing the + Add query button, and add the following query. (Run with shift-enter)
`max_over_time(({filename="/var/log/nginx/access.log"} |= "Googlebot" | regexp "HTTP\\/1\\.1\" \\d{3} (?P<value>\\d+) " [5m]))`
    - Notice that there is a second metric series added to the graph, where we return the amount of bytes send of of the request with the highest amount of response bytes within that `5m` interval.

## Loki dashboard with ad hoc metrics

Let’s create our first Loki dashboard using label and metrics extraction queries.

1. Click the plus button on the left menu bar to create a new dashboard
2. Select last 3 hours in the time picker (top right)
3. Click the save button and give your dashboard a name

### 95th percentile percentile panel

We're now going to add a panel showing the 95th percentile of requests time:
1. Click the add a new panel button 
2. Select the `LokiPreview` datasource
3. Add the following query which extracts the total request time from every log line, and calculates the 95th percentile. Which is the max request time of 95% within the interval of five minutes; `sum by(host) (quantile_over_time(0.95,{filename="/var/log/nginx/access.log"} | regexp "HTTP\\/1\\.1\" \\d{3} \\d+ \".*?\" \".*\" \".*?\" (?P<value>[-+]?[0-9]*\\.?[0-9]+)"[5m]))`
4. Add another query here, that will show the max request time within every 1 min interval; `sum by(host) (max_over_time({filename="/var/log/nginx/access.log"} | regexp "HTTP\\/1\\.1\" \\d{3} \\d+ \".*?\" \".*\" \".*?\" (?P<value>[-+]?[0-9]*\\.?[0-9]+)"[1m]))`
5. Set panel title to `95th percentile of Request Time` and save the panel.
  
### Percentage of request by googlebot panel

We're now going to add a panel showing the percentage of request made by Google's webspider, Googlebot.
1. Click the add a new panel icon in the upper right corner.
2. Select the `LokiPreview` datasource
3. Add the following query. Notice we are doing some math here with loki metrics! In this case we are calculating the percentage of request by Googlebot vs the total request, per 10 minute interval: `count_over_time(({job="nginx_access_log"} |= "Googlebot")[10m]) / (count_over_time(({job="nginx_access_log"})[10m]) / 100)`
4. We want to show it as a total number, so in the panel settings on the right, choose the Stat visualisation 
5. It now shows the mean value over the current time range, and we want the show the current percentage, so scroll down to display settings and set Value to Last.  
6. We want to make clear this metrics is a percentage.  Go to the Field tab in the upper right corner and set the Unit option to `percent (0-100)` as value. (This option can be found under Misc)
7. Set panel title to `current % of request by Google` and save the panel.

### Worldmap panel 

World map using the country code that was added by geocoding the IP address.
1. Click the add a new panel icon in the upper right corner.
2. Select the `LokiPreview` datasource
3. Add the following query which counts the log lines, grouped by the extracted country_code; `sum by (country_code) (count_over_time({filename="/var/log/nginx/access.log"} | regexp "HTTP\\/1\\.1\" (?P<statuscode>\\d{3}) (?P<bytessent>\\d+) (?P<referer>\".*?\") \"(?P<useragent>.*)\" \"(?P<country_code>.*)\""[$__interval]))`
4. In Panel tab on the right, select the Worldmap panel as the visualisation,
5. Set panel title to `Total requests per country` and save the panel.




