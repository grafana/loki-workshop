# Troubleshooting and debugging

## Add your datasources

### Prometheus metrics datasource

Go to Configuration > Data sources in the left menu, and click the “Add data source” button
Add a new prometheus datasource with the following settings:

- Name: `PromCorrelation`
- Enter URL: `http://prometheus:9090` << REPLACE
- Enable the basic auth toggle
- Enter Username: `REPLACE`, Password: `REPLACE`
- Click save and test.

### Jaeger tracing datasource

Add a new Jaeger datasource with the following settings:
Name: JaegerCorrelation
Enter URL: http://jaeger:16686 << REPLACE
Enable the basic auth toggle
Enter Username: REPLACE, Password: REPLACE
Click save and test

### Loki logs datasource

Loki datasource
Name: LokiCorrelation
Enter URL: http://loki:3100 << REPLACE
Enable the basic auth toggle
Enter Username: REPLACE, Password: REPLACE
Configure to use Jaeger for visualising the traces with the derived fields functionality:
Name: TraceId
Regex: .*trace_id=(.*?)\s.*   
Query: ${__value.raw}
Enable the internal link and set to Jaeger
Click save and test

