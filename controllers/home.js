const express = require('express')
const router = express.Router()
const Qiniu = require('./qiniu')
const graphviz = require('graphviz')
const Viz = require('viz.js')
const path = require('path')
const util = require('util')

router.get('/', function(res, res){
  res.render('index')
})

router.get('/uptoken', function(req, res){
  res.json({
    uptoken: Qiniu.uptoken()
  })
})

router.get('/skillmap', function(req, res){
  let viz = new Viz()
  console.log(viz)
  viz.renderImageElement('digraph { a-> b }').then((ele)=>{
    res.renderFile(ele)
  })
  // var g = graphviz.digraph("G")
  // var n1 = g.addNode( "Hello", {"color" : "blue"})
  // n1.set("style", "filled")
  // g.addNode("World")
  // var e = g.addEdge(n1, "World")
  // e.set("color", "red")
  // console.log( g.to_dot() )
  // g.setGraphVizPath( "/usr/local/bin" )
  // g.output("png", path.resolve(__dirname, '../file/demo.png'))
  // res.sendFile(path.resolve(__dirname, '../file/demo.png'))
})

module.exports = router