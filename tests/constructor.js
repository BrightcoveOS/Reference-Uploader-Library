/* eslint-env mocha */

describe('BCUploader constructor', function() {
  it('exists', function() {
    expect(BCUploader).to.be.a('function');
  });

  it('requires signUploadEndpoint argument', function() {
    expect(function() {
      BCUploader({
        createVideoEndpoint: 'foo',
        ingestUploadEndpoint: 'bar'
      });
    }).to.throw(/signUploadEndpoint/);
  });

  it('requires createVideoEndpoint argument', function() {
    expect(function() {
      BCUploader({
        ingestUploadEndpoint: 'bar',
        signUploadEndpoint: 'bar'
      });
    }).to.throw(/createVideoEndpoint/);
  });

  it('requires ingestUploadEndpoint argument', function() {
    expect(function() {
      BCUploader({
        createVideoEndpoint: 'bar',
        signUploadEndpoint: 'bar'
      });
    }).to.throw(/ingestUploadEndpoint/);
  });

  it('works with a bare minimum of required arguments', function() {
    expect(function() {
      BCUploader({
        createVideoEndpoint: 'bar',
        signUploadEndpoint: 'bar',
        ingestUploadEndpoint: 'bar',
      });
    }).not.to.throw();
  });

});
