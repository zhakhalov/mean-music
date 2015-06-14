(function (describe, it, expect) {
  describe('Simple jasmine test', function () {
    it('should be ok', function () {
      expect('aaa').toEqual('aaa');
    });
    it('should be ok 2', function (done) {
      setTimeout(function() {
        expect('aaa').toEqual('aaa');
        done();
      }, 500);
    });
    it('should be ok 3', function () {
      expect('aaa').toEqual('aaa');
    });
    it('should be ok 4', function () {
      expect('aaa').toEqual('aaa');
    });
    it('should be ok 5', function () {
      expect('aaa').toEqual('aaa');
    });
  });
})(window.describe, window.it, window.expect);