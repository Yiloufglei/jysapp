/**
 *
 * @param {上传的url} url
 * @param {上传后得到的回调} callback
 * @param {上传失败的回调} errBack
 */
function camera(url, callback, errBack) {
    // 获取到camera
    let cmr = plus.camera.getCamera();
    // 调用cmr的captureImage方法进行拍照功能的调用
    cmr.captureImage(function () {
        // 成功回调
        // 通过resolveFileSystemURL 获取真实地址
        plus.io.resolveLocalFileSystemURL(e, function (entry) {
            let imgUrl = entry.toLocalURL();
            let imgName = new Date().valueOf();
            let imgSuffix = imgUrl.substr(e.lastIndexOf('/') + 1);

            // 进行压缩
            plus.zip.compressImage({
                    src: imgUrl,
                    // 压缩后图片的路径
                    dst: '_doc/' + imgName + imgSuffix,
                    overwrite: true,
                    quality: 50,
                    // 高度可以根据自己的需求设定
                    height: '100px'
                },
                function (event) {
                    // 压缩成功回调
                    let target = event.target;
                    // 调用上传组件
                    upload(url, target, callback, errBack);
                },
                function () {
                    // 失败回调
                }
            );
        });
    });
}

/**
 *
 * @param {上传的url} url
 * @param {用来上传的图片地址} target
 * @param {上传后得到的回调} callback
 * @param {上传失败的回调} errBack
 */
function upload(url, target, callback, errBack) {
    var task = plus.uploader.createUpload(
        url, {
            method: 'POST',
            blocksize: 888888,
            priority: 100,
            timeout: 51000
        },
        function (data, status) {
            // 上传完成
            if (status === 200) {
                return callback(data.responseText);
            } else {
                errBack(data);
            }
        }
    );
    task.addFile(target, {
        key: 'a' + Math.random() * 10
    });
    task.start();
}