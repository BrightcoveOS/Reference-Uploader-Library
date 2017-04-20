/* eslint-env mocha */

describe('BCUploader constructor', function() {
  it('exists', function() {
    expect(BCUploader).to.be.a('function');
  });

  it('requires signUploadEndpoint argument', function() {
    expect(() => BCUploader({
      createVideoEndpoint: 'foo',
      ingestUploadEndpoint: 'bar'
    })).to.throw()
  });

  xit('works with a bare minimum of required arguments', function() {
    expect(BCUploader({
      signUploadEndpoint: '',
      createVideoEndpoint: '',
      ingestUploadEndpoint: ''
    }));
  });
});
