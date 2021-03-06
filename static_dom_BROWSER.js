window.StaticDom = (function() {
    this.build_dom_methods = (tree_hash, parent, memo = {}) => {
      var name, opts;
      for (name in tree_hash) {
        opts = tree_hash[name];
        memo[name] = this.build_fn(memo, name, opts.selector, parent);
        if (opts.children) {
          this.build_dom_methods(opts.children, name, memo);
        }
      }
      return memo;
    };
    this.build_fn = (memo, name, selector, parent) => {
      return (allow_cache = true) => {
        var get_val, name1;
        get_val = () => {
          var val;
          val = parent ? memo[parent]().find(selector) : $(selector);
          if (val.length < 1) {
            this.missing_dom_element(selector);
          }
          return val;
        };
        if (allow_cache) {
          return memo[name1 = `_${name}`] || (memo[name1] = get_val());
        } else {
          return get_val();
        }
      };
    };
    this.missing_dom_element = function(selector) {
      return console.log("selector empty: ", selector);
    };
    return this;
  }).apply({});