# 1.1. Explore logs

## Explore logs from a service

Slice and filter your logs using _Explore Logs_ in Grafana.

1.  From the left menu, expand the **Explore** menu item and click on **Explore** -> **Logs**.

    ![Explore Logs menu option](/img/explore_logs_menu.png)

1.  At the top of the screen, in the data source dropdown, select the **LokiCorrelation** data source.

    ![Choosing a data source](/img/explore-logs-datasource.png)

1.  Scroll down to the `web_app_3` service and click the **Select** button to open the logs for the service.

    ![Choosing a service](/img/explore-logs-webapp3.png)

1.  Now we are shown the most recent logs for our app **web_app_3**. This view shows us:

    - A chart showing the volume of logs received for this service over time

    - A list of log lines for this service

    - The time period for search, shown in the top right

    :::tip

    If the log lines are too long for your browser, you can scroll horizontally, or click **Wrap lines** to toggle wrapping on or off.

    :::

    **Click on one of the returned log lines** to expand it.

    ![Expand a log line](/img/explore-logs-expand-line.png)

1.  When you expand a log line, the log detail view will show you the metadata that is associated with the log line. This consists of:

    - _Fields_, which includes:

        - Loki _labels_ associated with the log line

        - Additional _fields_ which Loki has automatically parsed from the log message

        - Additional structured metadata which has been attached to this log line

    - _Links_ to other data in Grafana for additional context

    ![Viewing detail](/img/explore-logs-log-detail.png)

1.  Let's narrow down the logs by adding a simple filter.

    In the search bar, enter the text **favicon.ico**. This will show only those log lines containing the string `favicon.ico`:

    ![Filtered logs](/img/explore-logs-filtered-logs.png)

1.  Let's add another filter.

    **Click on a log line** to expand it. Then, by the side of **status_code**, click on the magnifying glass icon: 
    
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" class="css-fmaj2t-Icon">
    <rect x="-2" y="-2" width="28" height="28" fill="white"/><path d="M15,10H12V7a1,1,0,0,0-2,0v3H7a1,1,0,0,0,0,2h3v3a1,1,0,0,0,2,0V12h3a1,1,0,0,0,0-2Zm6.71,10.29L18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z"></path></svg>

    ![Add a field filter](/img/explore-logs-field-filter.png)

1.  Explore Logs will refresh the results to show only logs which contain the string `favicon.ico` and have the same `status_code` that you selected.

    Explore Logs shows us our search filters at the top of the page, where can easily change or remove them:

    ![Explore Logs filters](/img/explore-logs-filters.png)

1.  From here, it's easy to change the filters. At the top of the screen, pick a different **status_code** from the dropdown list. For example, choose **200**. (Or, if you selected _200_ in the previous step, pick a different code)

    Now, only logs from the app which contain the string `favicon.ico` and have the status_code **200** are shown:

    ![Explore Logs filters](/img/explore-logs-filters2.png)


## View metrics from logs

Explore Logs also lets you deeply understand the shape and content of your logs, through instant metrics and charts. 

Under the hood, Loki's _metrics from logs_ feature instantly calculates metrics from your log lines or labels, which Explore Logs then visualizes as a chart.

This helps you to quickly answer very common questions, like:

- Is the number of errors in my app increasing?
- Which are the most popular pages on my website?

Let's take a look at these metrics:

1.  From the row of tabs above the log volume chart, click on the **Labels** tab.

    Explore Logs shows a breakdown of Loki labels, charting their respective values.

    In the **http_method** panel, click on the **Select** button to drill down to logs with this label:

    ![Explore Logs labels tab](/img/explore-logs-labels-tab.png)

1.  Now we can see a further breakdown of our filtered logs, broken down by the `http_method` label.

    From any panel, click on the **Include** button to show only logs with that label value.

    ![Explore Logs labels drilldown](/img/explore-logs-labels-drilldown.png)

1.  Then click the **Logs** tab to return to the logs list.

    Notice how the logs have been further filtered to show only those which have your selected `http_method` label value.

    ![Explore Logs labels afterwards](/img/explore-logs-labels-after.png)


## Wrapping up

Explore Logs is a powerful tool for diving into your logs and gaining instant insights without having to write a query.

When you want to dive further into Loki, you can start writing queries in _LogQL_, Loki's query language.

In the next section of this lab, we will move from Explore Logs to querying Loki. Click Next to continue.

