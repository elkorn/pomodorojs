export default fn => (...args) => (callback) => {
  fn.apply(this, args.concat([callback]));
};
