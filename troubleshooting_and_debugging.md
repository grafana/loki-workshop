# Troubleshooting and debugging

## Write your first Loki queries in the Grafana Explore view

Filter logs using Loki label queries

1. Go to Explore in the left menu, and make sure you have the `LokiCorrelation` selected in the upper left corner.

    ![Explore button](img/explore-button.png)
       
2. Select the `{service="web_app_3"}` log label from the Log Labels dropdown, which is positioned  left of the query input box. 
    
    ![Loki select](img/loki-select.png)
  
3. Click on one of the returned log lines to see its row detail view. If you don’t see enough rows, zoom out the time range using the magnifying glass icon in the right upper corner.
    
    ![Expand a log line](img/loki-expand.png)

4. Filter your logs down using filter expressions, try out by pasting the below queries and press shift-enter to run them.
    - All log lines that contain `favicon.ico`:  `{service="web_app_3"} |= "favicon.ico"`
    - All log lines that don’t contain a `200` value: `{service="web_app_3"} != "200"`
    - All log lines that contain the 5xx value: `{service="web_app_3"} |~ "5\\d{2}"`
        
        ![Querying Loki](img/loki-query.png)
     
5. Turn on live tailing (upper right Live button) on one of these queries and view the logs as they are received by Loki, and filtered by the query.

6. Turn off live tailing. 

7. Start graphing logs counts with Range Vectors Aggregations, try out by pasting the below queries and press shift-enter to run them.
    - Graph the log line count for any web_app service with an 5xx category status code AND contains Mozilla for every 5 minute interval 
      `sum by (service) (count_over_time({ service=~"web_app_.+", status_code=~"5\\d{2}" } |~ "Mozilla.*" [5m]))`

## Correlate metrics, logs, and traces

Finding suspect patterns in Prometheus metrics

1. Open the PromCorrelation datasource in the Explore view (left upper corner).
    
    ![Prometheus Correlation in the Explore view](img/prom-explore.png)
  
2. Select from the metrics picker `web` > `web_http_requests`.

3. Make sure the Time Picker (right upper corner, clock icon) is set to last 5 minutes.
    - Notice the three series, each charting the amount of concurrent users over time. 
   
4. Filter down on the suspect service, `web_app_3`, by changing adding a label filter and press `shift-enter` to run: `web_http_requests{service="web_app_3"}`
    - Notice the suspect 'saw pattern', let’s find out what’s causing the steep drop in concurrent users requests.

Correlating your prometheus metrics with your Loki metrics

1. Click the split button next to the time picker.
    
    ![Split button](img/split.png)
  
2. The new (right) panel shows the same Prometheus query, change the data source selection on that panel to our LokiCorrelation data source. 
    - Notice that it will recognize the label selection of Prometheus, and apply it to your Loki logs, so you get the latest relevant logs right away.
  
3. Click the chain button next to the time picker to sync up the time range of both views.
   ![Correlate views](img/correlate.png)
  
4. Select in the prometheus graph the timerange where the drop happened.
    - Notice the Loki panel timerange also shows the logs of that time range. 
  
5. If you have a lot of log lines, filter on the errors by clicking on the error label on the histogram.
    - You should see a log line with out of memory, which hints at a memory leak being the reason of the drop in concurrent users.

## Correlate metrics, logs and traces

Besides outages, it’s also common to have latency issues for which traces allows us to find the bottleneck in complex request/response flows. 

1. Zoom out the time range until you have log lines that start with a `(Tempo) Trace ID`

2. Click on a log line with a `(Tempo) Trace ID`
      
3. In the parse fields, you should have a button next to the parsed `(Tempo) Trace Id` value.

    ![Log and trace correlation](img/log-trace-correlation.png)

4. Click on it, and you can now inspect the trace in the new Grafana 7 Trace View and understand any possible bottlenecks in the request/response flow of your service.




