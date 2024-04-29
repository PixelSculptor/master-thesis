import { MetricName } from './ComputingTypes';

export type MessageBodyType = {
    fileName: string;
    numOfTry: string;
};

export type MessageMetricType = {
    numOfTry: string;
    fileName: string;
    metricName: MetricName;
};

export const isSQSMessage = (
    payload: unknown
): payload is MessageMetricType => {
    if (typeof payload !== 'object' || payload === null) return false;
    return (
        (payload as MessageMetricType).metricName !== undefined &&
        (payload as MessageMetricType).fileName !== undefined &&
        (payload as MessageMetricType).numOfTry !== undefined
    );
};
