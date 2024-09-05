export interface BaseTypeConfig {
  type: string;
  format: string;
  props: string[];
}

export interface Config {
  baseType: Record<string, BaseTypeConfig>;
}

const config: Config = {
  baseType: {
    UUID: {
      type: 'string',
      format: 'uuid',
      props: ['id'],
    },
    ISODate: {
      type: 'string',
      format: 'date-time',
      props: ['at', 'created', 'updated', 'time'],
    },
  },
};

export default config;
