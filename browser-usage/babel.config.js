module.exports = api => {
  api.cache(true)
  
  // ,
  //       {
  //         "modules": !!api.env('test')
  //       }

  return {
    "plugins": ["@babel/syntax-dynamic-import"],
    "presets": [
      [
        "@babel/preset-env"
      ]
    ]
  }
}