# Troubleshooting and debugging

## Add your datasources

### Prometheus metrics datasource

- Go to Configuration > Data sources in the left menu, and click the “Add data source” button
- Add a new prometheus datasource with the following settings:
  - Name: `PromCorrelation`
  - Enter URL: `http://prometheus:9090` << REPLACE
  - Enable the basic auth toggle
  - Enter Username: `REPLACE`, Password: `REPLACE`
  - Click `Save and Test`.

### Jaeger tracing datasource

- Add a new Jaeger datasource with the following settings:
  - Name: JaegerCorrelation
  - Enter URL: `http://jaeger:16686` << REPLACE
  - Enable the basic auth toggle
  - Enter Username: `REPLACE`, Password:`REPLACE`
  - Click `Save and Test`

### Loki logs datasource

- Add a new Loki datasource with the following settings:
  - Name: LokiCorrelation
  - Enter URL: http://loki:3100 << REPLACE
  - Enable the basic auth toggle
  - Enter Username: REPLACE, Password: REPLACE
  - Configure to use Jaeger for visualising the traces with the derived fields functionality:
      - Name: TraceId
      - Regex: .*trace_id=(.*?)\s.*   
      - Query: ${__value.raw}
      - Enable the internal link and set to Jaeger
  - Click save and test

## Write your first Loki queries with the explore view

Query logs using labels:
Go to Explore in the left menu, and make sure you have the LokiCorrelation selected in the upper left corner, with the logs view selected.
Select the {service="web_app_3"} log label from the Log Labels dropdown, which is positioned  left of the query input box. 
Click on one of the returned log lines to see its row detail view. If you don’t see enough rows, zoom out the time range using the magnifying glass icon in the right upper corner
Filter your logs down using filter expressions, try out by pasting the below queries and press shift-enter to run them.
All log lines that contain “favicon.ico”:  {service="web_app_3"} |= "favicon.ico"
All log lines that don’t contain “200”: {service="web_app_3"} != "200"  
All log lines that contain the 5xx value: {service="web_app_3"} |~ “5\\d{2}”
Try live tailing (upper right Live button) on one of these queries and view the logs as they are received by Loki, and filtered by the query.
Switch to metrics mode and start graphing logs counts with Range Vectors Aggregations, try out by pasting the below queries and press shift-enter to run them.
Graph the log line count for any web_app service with an 5xx category status code AND contains Mozilla for every 5 minute interval.
sum by (service) (count_over_time({ service=~"web_app_.+", status_code=~"5\\d{2}" } |~ "Mozilla.*" [5m]))
TODO: more here?

## Correlate metrics, logs and traces

Finding suspect patterns in prometheus metrics
Open the PromCorrelation datasource in the explore view (left upper corner)
Select from the metrics picker web > web_http_requests
Make sure the time picker (right upper corner, clock icon) is set to last 5 minutes.
Notice the three series, each charting the amount of concurrent users over time. 
Filter down on the suspect service, web_app_3, by changing adding a label filter and press shift enter to run.
web_http_requests{service="web_app_3"}
Notice the suspect saw pattern, let’s find out what’s causing the drop in concurrent requests.
Correlating your prometheus metrics with your loki metrics
Click the split button next to the time picker
The new (right) panel shows the same prometheus query, change the datasource selection on that panel to our LokiCorrelation datasource. 
Notice that it will recognize the label selection of prometheus, and apply it to your loki logs, so you get the latest relevant logs right away
Click the chain button next to the time picker to sync up the timerange of both views.
Select in the prometheus graph the timerange where the drop happend
Notice the loki panel timerange also shows the logs of that timerange. 
If you have a lot of log lines, filter on the errors by clicking on the error label on the histogram.
You should see a log line with out of memory, which hints at a memory leak being the reason of the drop in concurrent users.

## Correlate metrics, logs and traces

Besides outages, it’s also common to have latency issues for which traces allows us to find the bottleneck in complex request/response flows. 
 Zoom out the time range until you have log lines that start with a trace ID
Click on a log line with a trace ID
In the parse fields, you should have a Jaeger button next to the parsed TraceId value.
Click on it, and you can now inspect the trace in the new Grafana 7 Trace View and understand any possible bottlenecks in the request/response flow of your service.




