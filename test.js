var expect = require('chai').expect
  , through = require('through')
  , pause = require('./')
  , via = require('via')

describe('pause', function() {

  it('should pause pipeline until explicit flow', function(done) {
    var stream = pause(through())
      , fn1 = function(d){ return result1 = d }
      , fn2 = function(d){ return result2 = d }
      , result1
      , result2
    
    var partial = stream.pipe(via(fn1))

    partial
      .on('end', done)
      .pipe(via(fn2))
      .flow()

    ;[1,2,3,4,5].map(function(d){
      setTimeout(function(){
        stream.push(d)
      }, d*50)
    })

    setTimeout(stream.end, 700)

    setTimeout(function(){
      expect(result1).to.be.eql('12345')
      expect(result2).to.be.eql('12345')
    }, 600)

  })

})