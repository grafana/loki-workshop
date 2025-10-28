# 2.3. Import a demo dashboard

## Import the full NGINX analytics demo dashboard

We're going to import a full NGINX monitoring dashboard, built from Loki queries.

1.  Click on the **+** menu at the top right, then click on **Import dashboard**.

1.  In the **Find and import dashboards** box, paste in the value **24306**, then click **Load**

1.  When prompted, set the Loki datasource to **LokiNGINX**.

1.  When the dashboard loads, ensure the following dashboard variables are set, using the dropdowns at the top of the screen:

    - Set **Label name** to **filename**

    - Set **Label value** to **/var/log/nginx/json_access.log**

1. You can now explore the panels, like: 

    - % of 5xx requests

    - Top requested pages

    - Top user agents

    - Top IP addresses

    - Logs panel

1.  To see the LogQL queries that were used to fetch the data for each panel, hover over the panel, click on the context menu (three dots), and then click on **Explore**.

## Wrapping up

That's it for this Introduction to Loki workshop!

