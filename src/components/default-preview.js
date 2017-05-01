function defaultPreviewAction(context) {
  context.updatePreview({
    playerId: context.playerId,
    videoId: context.videoId,
    accountId: context.accountId,
    fileName: context.fileName
  });
}

module.exports = {
  defaultPreviewAction: defaultPreviewAction
};
