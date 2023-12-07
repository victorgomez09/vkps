export type EngineData<T> = {
  statusCode: number;
  data?: T;
  error?: string;
};

export interface LogLines {
  id: string;
  time: number;
  app: string;
  pod: string;
  podID: string;
  container: string;
  color: string;
  log: string;
}
