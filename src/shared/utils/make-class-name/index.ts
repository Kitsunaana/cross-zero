type Classname = string | undefined | null | boolean

const makeClassname = (...classnames: Classname[]): string => {
  return classnames.filter((item) => typeof item === 'string').join(' ');
};

export { makeClassname };
