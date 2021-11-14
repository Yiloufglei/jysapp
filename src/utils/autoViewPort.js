module.exports = (function () {
    function setViewPort() {
        let mEle = document.querySelector('meta[name]')
        let availWidth = window.screen.availWidth
        let scale = 1
        if (availWidth < 375) {
            scale = (availWidth / 375);
        }
        let contentValue = `width=device-width,initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale},user-scalable=no,minimal-ui`
        if (mEle) {
            mEle.setAttribute('content', contentValue);
        } else {
            var m = document.createElement('meta')
            var head = document.head
            m.setAttribute('name', 'viewport')
            m.setAttribute('content', contentValue);
            head.appendChild(m)
        }
    }
    setViewPort()
    window.addEventListener('resize', function () {
        setViewPort()
    })
})()