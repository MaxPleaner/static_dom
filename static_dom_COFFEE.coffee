module.exports = (->

  @build_dom_methods = (tree_hash, parent, memo={}) =>
    for name,opts of tree_hash
      memo[name] = @build_fn(memo, name, opts.selector, parent)
      if opts.children
        @build_dom_methods(opts.children, name, memo) 
    memo

  @build_fn = (memo, name, selector, parent) =>
    (allow_cache = true) =>
      get_val = =>
        val = if parent then memo[parent]().find(selector) else $(selector)
        @missing_dom_element(selector) if val.length < 1    
        val
      if allow_cache then (memo["_#{name}"] ||= get_val()) else get_val()

  @missing_dom_element = (selector) ->
    console.log("selector empty: ", selector)

  this
).apply {}