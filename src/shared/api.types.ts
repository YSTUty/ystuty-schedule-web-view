export type ValidationItem = {
  children: ValidationItem[];
  constraints: Record<string, string>;
  isDate: string;
  property: string;
};

export type ResponseError = {
  code: number;
  error: string;
  message: string;
  validation?: ValidationItem[];
  payload?: unknown;
};

export type ApiFetchParams = {
  fKey?: string;
  returnResponse?: boolean;
  checkError?: boolean;
  noAlert?: boolean;
  noRenavigate?: boolean;
  setError?: (error: string) => void;
  handleError?: (error: ResponseError) => void;
  handleRateLimit?: false | ((timeout: number) => boolean | void);
};

export type ApiFetchResult<T> =
  | { data: T }
  | { error: ResponseError }
  | Response
  | null;
