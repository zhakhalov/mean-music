(function (describe, it, expect) {
  describe('Stub test', function () {
    it('sould add 2 and 3', function () {
      expect(2 + 3).toEqual(4);
    });
  });
})(global.describe, global.it, global.expect);