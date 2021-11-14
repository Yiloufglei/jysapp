import MD5 from 'crypto-js/md5'
import { Toast } from 'vant';
import html2canvas from 'html2canvas'
export default {
    install(Vue) {
        Vue.prototype.$md5 = function (str) {
            return MD5(str).toString()
        }
        Vue.prototype.$bus = new Vue()
        //复制方法
        Vue.prototype.$copyText = function (value) {
            const textarea = document.createElement('textarea')
            // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
            textarea.readOnly = 'readonly'
            textarea.style.position = 'absolute'
            textarea.style.left = '-9999px'
            // 将要 copy 的值赋给 textarea 标签的 value 属性
            textarea.value = value
            // 将 textarea 插入到 body 中
            document.body.appendChild(textarea)
            // 选中值并复制
            textarea.select()
            textarea.setSelectionRange(0, textarea.value.length)
            const result = document.execCommand('Copy')
            if (result) {
                Toast({
                    message: '复制成功'
                })
            }
            document.body.removeChild(textarea)
        }
        //复制方法
        Vue.prototype.$downloadFile = function (src) {
            let a = document.createElement('a');
            a.download = 'QR';
            a.href = src;
            a.dispatchEvent(new MouseEvent('click'))
        }
        Vue.prototype.$appDownloadFile = function (id, src) {
            var userAgent = navigator.userAgent;//获取UA信息
            if(userAgent.indexOf("IosAndroidIdentification") == -1) {
                this.$downloadFile(src)
                return
            }
            const domObj = document.getElementById(id)
            html2canvas(domObj, {
                useCORS: true,
                allowTaint: false,
                logging: false,
                letterRendering: true,
                onclone (doc) {
                    // let e = doc.querySelector(id)
                    // e.style.display = 'block'
                }
            }).then( (canvas) => {
                const posterImg = canvas.toDataURL('image/png')
                var userAgent = navigator.userAgent;//获取UA信息
                if(userAgent.indexOf("IosAndroidIdentification") != -1){//判断ua中是否含有和app端约定好的标识
                    let ua = navigator.userAgent;
                    let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
                    let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                    if (isiOS) {
                        try {
                            window.webkit.messageHandlers.triggerIosAndroidImgDownload.postMessage(posterImg);//ios调用
                        } catch(error) {
                            console.log("ios error");
                        }
                        return
                    }
                    if (isAndroid) {
                        try {
                            window.android.triggerIosAndroidImgDownload(posterImg) //Android调用    
                        } catch(error) {
                            console.log("Android error");
                        }
                        return
                    }
                }
            })
        }
        //返回时间格式
        Vue.prototype.$formatDate = function (now, type = '-') {
            if (!now) return
            let data = new Date(now * 1000)
            var year = data.getFullYear();
            var month = data.getMonth() + 1;
            var date = data.getDate();
            var hour = data.getHours();
            var minute = data.getMinutes();
            var second = data.getSeconds();
            month = month < 10 ? '0' + month : month
            date = date < 10 ? '0' + date : date
            hour = hour < 10 ? '0' + hour : hour
            minute = minute < 10 ? '0' + minute : minute
            second = second < 10 ? '0' + second : second
            let newData = year + "-" + month + "-" + date + " " + hour + ":" + minute
            if (type == 's') {
                return newData = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
            }
            if (type == '-') {
                return newData
            }
            if (type == '/') {
                newData = hour + ":" + minute + ' ' + month + "/" + date
                return newData
            }
            if (type === 'yyyy.MM.dd') {
                return year + "." + month + "." + date
            }
            if (type === ':') {
                return hour + ":" + minute + ":" + second
            }
        }
        //返回收款类型icon图标
        Vue.prototype.$iconClassName = function (val) {
            switch (val) {
                case "wechat":
                    return 'iconweixinzhifu color_gr'
                case "alipay":
                    return 'iconalipay-square-fill color_b'
                case "unionpay":
                    return 'iconyinhangka color_g'
                default:
                    break;
            }
        }
        //上传图片
        Vue.prototype.$uploadCard = function (el) {
            return new Promise((resolve, reject) => {
                if (el && el.target && el.target.files && el.target.files.length > 0) {
                    const files = el.target.files[0]
                    const isLtM = files.size / 1024 / 1024 < 5
                    // 判断上传文件的大小
                    if (!isLtM) {
                        Toast({
                            message: '上传图片大小不能超过 5MB!'
                        })
                        reject()
                    } else if (files.type.indexOf('image') === -1) { //如果不是图片格式
                        Toast({
                            message: '请选择图片文件'
                        })
                        reject()
                    } else {
                        const reader = new FileReader(); // 创建读取文件对象
                        reader.readAsDataURL(el.target.files[0]); // 发起异步请求，读取文件
                        reader.onload = function () { // 文件读取完成后
                            const formData = new FormData()
                            formData.append('file', files);
                            // reader.formData.append('uid', that.userInfo.uid);
                            let obj = {
                                result: this.result,
                                formData: formData,
                            }
                            resolve(obj)
                        };
                    }
                } else {
                    Toast({
                        message: '上传错误'
                    })
                    reject()
                }
            })
        }
        // 指定格式 格式化时间 (yyyy-MM-dd hh:mm:ss)
        Date.prototype.Format = function (fmt) {
                if (this instanceof Date && isNaN(this.getTime())) return ''
                const o = {
                    "M+": this.getMonth() + 1,
                    "d+": this.getDate(),
                    "h+": this.getHours(),
                    "m+": this.getMinutes(),
                    "s+": this.getSeconds(),
                    "q+": Math.floor((this.getMonth() + 3) / 3),
                    "S": this.getMilliseconds()
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (let k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            },
        // js将数字转换成万、亿、万亿
        Vue.prototype.$numberFormat = (value = 0) => {
            var param = {};
            var k = 10000,
                sizes = ['', '万', '亿', '万亿'],
                i;
                if(value < k){
                    param.value =value
                    param.unit=''
                }else{
                    i = Math.floor(Math.log(value) / Math.log(k)); 
                    param.value = ((value / Math.pow(k, i))).toFixed(2);
                    param.unit = sizes[i];
                }
            return param.value + param.unit;
        }
        Vue.prototype.$numberFormat2 = (val = 0, num = 2) => {
            // 当整数大于单位最小正整数时，用该单位表示，单位有：K，M，B。K是1000，M是100万，B是10亿。
            if (val>=1000 && val < 1000000) {
                return Vue.prototype.$fomatFloat(val/1000 ,num) +'K'
            } else if (val>=1000000 && val < 1000000000) {
                return Vue.prototype.$fomatFloat(val/1000000 ,num) +'M'
            } else if (val>=1000000000){
                return Vue.prototype.$fomatFloat(val/1000000000 ,num) +'B'
            } else {
                return Vue.prototype.$fomatFloat(val ,num)
            }
        }
        // 保留n位小数并格式化输出（不足的部分补0）
        Vue.prototype.$fomatFloat = (value,n = 2, addZoreNum) => {
            // 补0 默认是精度位数
            if (!addZoreNum) addZoreNum = n
            let f = (parseInt( value * Math.pow(10,n) ) / Math.pow(10,n)).toFixed(n)
            let s = f.toString();
            if (addZoreNum) {
                let rs = s.indexOf('.');   
                if (rs < 0) {     
                    s += '.';   
                }
                for(let i = s.length - s.indexOf('.'); i <= addZoreNum; i++){
                    s += "0";
                }
            }
            return s;
        }
        // 手机号码脱敏
        Vue.prototype.$phoneDp = (value) => {
            return value ? value.substr(0,3) + '****' + value.substr(-3, 3) : '' 
        }
    }
}