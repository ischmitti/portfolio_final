import "./policy.html"
alert("HHELLo")        new HtmlWebpackPlugin({
  inject: false,
  filemame: 'policy.html',
  template: path.resolve(__dirname, '../src/policy.html'),
  chunks: ['policy'],
  minify: true
}),