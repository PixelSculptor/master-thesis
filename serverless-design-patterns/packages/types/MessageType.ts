import { MetricName } from '@serverless-design-patterns/core/queueHandler';

export type MessageBodyType = {
    fileName: string;
    numOfTry: string;
};

export type MessageMetricType = {
    numOfTry: string;
    nameOfFile: string;
    metricName: MetricName;
};
