module.exports = {
    overrides: [
      {
        test: './node_modules/ml-matrix',
        plugins: [
            '@babel/plugin-transform-private-property-in-object',
            '@babel/plugin-transform-class-properties',
   '@babel/plugin-transform-private-methods'
        
        ]
      }
    ]
  };