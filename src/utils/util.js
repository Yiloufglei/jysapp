module.exports = {
    validatePhone(p) {
        const RE = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/
        return RE.test(p)
    },
    /**
     * 对象转url参数
     * @param {*} data
     * @param {*} isPrefix
     */
    queryParams(data, isPrefix = false) {
        let prefix = isPrefix ? '?' : ''
        let _result = []
        for (let key in data) {
            let value = data[key]
            // 去掉为空的参数
            if (['', undefined, null].includes(value)) {
                continue
            }
            if (value.constructor === Array) {
                value.forEach(_value => {
                    _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
                })
            } else {
                _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
            }
        }
        return _result.length ? prefix + _result.join('&') : ''
    },
    //防抖、立即执行
    _debounce (fn, wait = 1000)  {
        var timerId = null;
        var flag = true;
        return function () {
            clearTimeout(timerId);
            if (flag) {
                fn.apply(this, arguments);
                flag = false
            }
            timerId = setTimeout(() => {
                flag = true
            }, wait)
        }
    },
    //节流、立即执行
    _throttle (fn, wait = 1000) {
        var flag = true;
        var timer = null;
        return function () {
            if (flag) {
                fn.apply(this, arguments);
                flag = false;
                timer = setTimeout(() => {
                    flag = true
                }, wait)
            }
        }
    }
}