<template>
    <div class="home overflowPatible">
        <header class="head col-center between">
            <h2 class="logo"></h2>
            <img v-if="userImg" :src="userImg" @click="toLink('personalCenter')">
            <img v-else @click="toLink('personalCenter')" src="@/assets/imgs/home-user.png" />
        </header>
        <div class="home_box" ref="overflowPatible">
            <div class="top-container">
                <section class="banner">
                    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                        <van-swipe-item v-for="item in bannerData" :key="item.id"><img class="banner-img"
                                v-lazy="item.adImg" alt="" @click="bannerClick(item)" /></van-swipe-item>
                    </van-swipe>
                </section>
                <div class="notice_body">
                    <section class="notice">
                        <van-notice-bar left-icon="volume-o" color="#000" :scrollable="false" background="#fff">
                            <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
                                <van-swipe-item v-for="item in noticeData" :key="item.id" class="van-ellipsis"
                                    @click="noticeClick(item)">{{ item.title }}</van-swipe-item>
                            </van-swipe>
                            <template v-slot:right-icon>
                                <i class="iconfont iconliebiao1" @click="toLink('noticeList')"></i>
                            </template>
                        </van-notice-bar>
                    </section>
                </div>
            </div>
            <div class="realTime_box">
                <div class="realTime_scroll_box" v-show="rankingData.length">
                    <div class="realTime_ul" :class="{'realTime_other': rankingData.length <= 3}"
                        @scroll="realTimeScroll">
                        <div class="realTime_li" v-for="item in rankingData" :key="item.symbol" @click="toChart(item)">
                            <p class="realTime_li_t">{{item.symbol}}<span
                                    :class="colorStyle(item)">{{item.info.rate > 0 ? '+'  : ''}}{{(item.info.rate || 0).toFixed(2) + '%'}}</span>
                            </p>
                            <p class="realTime_li_c" :class="colorStyle(item)">{{ item.info.price || 0}}</p>
                            <p class="realTime_li_b color_c">￥{{ item.info.quote_price}}</p>
                        </div>
                    </div>
                </div>
                <div class="proportion_box center" v-if="rankingData.length > 3">
                    <div class="proportion_bj">
                        <div class="proportion" :style="{left:left + 'px'}"></div>
                    </div>
                </div>
                <div class="flexC_S skeleton_body" v-if="!rankingData.length">
                    <van-skeleton row-width="80%" title-width="60%" title  :row="2" :loading="!rankingData.length" animate></van-skeleton>
                    <van-skeleton row-width="80%" title-width="60%" title  :row="2" :loading="!rankingData.length" animate></van-skeleton>
                    <van-skeleton row-width="80%" title-width="60%" title  :row="2" :loading="!rankingData.length" animate></van-skeleton>
                </div>
            </div>
            <section class="quick-buy">
                <div class="quick-buy-content">
                    <i class="quick-icon"></i>
                    <dl class="quick-text">
                        <dd>快捷买币</dd>
                        <dd>支持BTC、USDT、ETH等</dd>
                    </dl>
                    <router-link to="/legalCurrencyTrade">
                        <dd class="buy-btn">立即购买</dd>
                    </router-link>
                </div>
            </section>
            <div class="tab_body">
                <section class="tab flexC_S">
                    <div><img src="@/assets/imgs/home/commission.png" @click="toLink('inviteFriends')">
                        <p>月入百万</p>
                    </div>
                    <div><img src="@/assets/imgs/home/home-help.png" @click="toLink('helpCenter')">
                        <p>新手帮助</p>
                    </div>
                    <div><img src="@/assets/imgs/home/task.png" @click="toLink('missionCenter')">
                        <p>任务中心</p>
                    </div>
                    <div><img src="@/assets/imgs/home/customerService.png" @click="customerService">
                        <p>客服中心</p>
                    </div>
                </section>
                <section class="tab flexC_S">
                    <div><img src="@/assets/imgs/home/home-active.png" @click="toLink('ActivityCenter')">
                        <p>活动中心</p>
                    </div>
                    <div><img src="@/assets/imgs/home/Import.png" @click="toLink('withdrawMoney')">
                        <p>充值</p>
                    </div>
                    <div><img src="@/assets/imgs/home/export.png" @click="toLink('chargeMoney')">
                        <p>提币</p>
                    </div>
                    <!-- <div><img src="@/assets/imgs/home/Allocation.png" @click="toLink('OptionTrade')">
                        <p>期权交易</p>
                    </div> -->
                    <div><img src="@/assets/imgs/home/Allocation.png" @click="toLink('binaryOption')">
                        <p>期权交易</p>
                    </div>
                    <!-- <div><img src="@/assets/imgs/home/grid.png" @click="$toast('敬请期待！')">
                        <p>USDT合约</p>
                    </div> -->
                </section>
            </div>
            <div class="interval_bj"></div>
            <div class="ranking-box">
                <van-tabs swipeable line-width="33.33%" lazy-render animated>
                    <van-tab title="涨幅榜">
                        <div class="ranking-content">
                            <div class="tab-content-1">
                                <div class="list-title between">
                                    <span class="item center-l">币对</span>
                                    <span class="item">最新价</span>
                                    <span class="item">涨跌幅</span>
                                </div>
                                <div class="list-content">
                                    <div class="list flexC_S" v-for="item in upList" :key="item.symbol"
                                        @click="toChart(item)">
                                        <div class="item center-l"><label>{{item.quote}}</label><label class="unit"> /
                                                {{item.base}}</label></div>
                                        <div class="item">{{item.info.price || 0}}</div>
                                        <div class="item">
                                            <span
                                                class="pro-box bg-buy">+{{(item.info.rate || 0).toFixed(2) + '%'}}</span>
                                        </div>
                                    </div>
                                    <div class="no-data" v-if="upList.length === 0 && isResponse"></div>
                                </div>
                            </div>
                        </div>
                    </van-tab>
                    <van-tab title="成交额榜">
                        <div class="ranking-content">
                            <div class="tab-content-2">
                                <div class="list-title between">
                                    <span class="item center-l">币种</span>
                                    <span class="item">最新价(USDT)</span>
                                    <span class="item">24h成交额(USDT)</span>
                                </div>
                                <div class="list-content">
                                    <div class="list flexC_S" v-for="item in dealList" :key="item.symbol"
                                        @click="toChart(item)">
                                        <div class="item center-l">{{item.quote}}</div>
                                        <div class="item">{{item.info.price || 0}}</div>
                                        <div class="item">
                                            <span
                                                class="pro-box success">{{$numberFormat(item.info.deal_money || 0)}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="no-data" v-if="dealList.length === 0 && isResponse"></div>
                            </div>
                        </div>
                    </van-tab>
                    <van-tab title="佣金排行榜">
                        <div class="ranking-content">
                            <div class="tab-content-3">
                                <div class="list-title between">
                                    <span class="item center-l">排名</span>
                                    <span class="item">会员账号</span>
                                    <span class="item">会员收益(USDT)</span>
                                </div>
                                <div class="list-content">
                                    <div class="list flexC_S" v-for="(item, index) in commissionList" :key="item.uid">
                                        <div class="item center-l">
                                            <img v-if="index <= 2"
                                                :src="require('@/assets/imgs/ranking' + (index + 1) + '.png')" alt="">
                                            <span v-else>{{index + 1}}</span>
                                        </div>
                                        <div class="item"><span>{{$phoneDp(item.phone)}}</span></div>
                                        <div class="item">
                                            <span
                                                class="pro-box success">{{$numberFormat($fomatFloat(item.num || 0))}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="no-data" v-if="commissionList.length === 0 && isResponse"></div>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
        <div class="guideDownload flexC_S" v-if="guideDownload">
            <div class="guideDownload_l flexC_S">
                <img src="@/assets/imgs/logo4.png" alt="" srcset="">
                <div>
                    <p>IH Global</p>
                    <p>全球领先 | 数字资产交易平台</p>
                </div>
            </div>
            <div class="guideDownload_r flexC_S">
                <van-button type="default" @click="goGuideDownload">下载</van-button>
                <i class="iconfont iconshanchu" @click="setGuideDownload"></i>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getHome, agentRank } from "@/api/home";
import { worker } from "@/utils/webWorker.js";
import _get from "lodash/get"
import { Skeleton } from 'vant';
export default {
    name: "Home",
    data () {
        return {
            swiperShow: false,
            list: [],
            bannerData: [],
            noticeData: [],
            left: 0,
            rankingTab: ['涨幅榜', '成交额榜', '佣金排行榜'],
            isResponse: false,
            rankingTabData: null,
            rankNum: 10, // 榜单前N个
            upList: [], // 涨幅列表
            dealList: [], // 成交列表
            // 佣金列表
            commissionList: [],
            isGuideDownload:1
        };
    },
    components:{
        [Skeleton.name]: Skeleton
    },
    computed: {
        ...mapState({
            rankingData: (state) => state.wsData.rankingData,
            coinConfig: (state) => state.coinConfig,
            appConfig: (state) => state.appConfig,
            home: (state) => state.home
        }),
        userImg () {
            return _get(this.$store.state, 'user.userInfo.img', '')
        },
        guideDownload(){
            var userAgent = navigator.userAgent;//获取UA信息
            return false || (this.isGuideDownload === 1 && !this.loginType && !(userAgent.indexOf("IosAndroidIdentification") != -1))
        },
    },
    beforeRouteLeave (to, from, next) {
        // 离开页面之前, 缓存列表数据
        const { upList, dealList, commissionList } = this
        this.$store.commit('SET_HOME_LIST_DATA', {
            upList,
            dealList,
            commissionList
        })
        this.$store.commit('SET_HOME_SCROLLTOP', this.$parent.$el.scrollTop)
        next()
    },
    beforeDestroy () {
        document.removeEventListener('visibilitychange', this.hiddenChange, false);
        worker.postMessage({ type: "CLOSE_WEBSOCKET" });
    },
    methods: {
        goGuideDownload(){
            window.location.href='https://6m.com'
        },
        setGuideDownload(){
            sessionStorage.setItem('isGuideDownload',2)
            this.isGuideDownload = 2
        },
        customerService () {
            this.$router.push({ name: 'nesting', query: { url: this.appConfig.customerLink } })
        },
        updateRankingTabData (data) {
            // 更新排行数据
            let upList = []
            let dealList = []
            if (data) {
                for (const key in data) {
                    const element = data[key];
                    if (element.symbollist.length) {
                        // 按照后端设置精确小数位
                        let tempSymbollist = element.symbollist.map(res => {
                            let info = this.coinConfig.info[res.symbol.toLowerCase()]
                            if (info) {
                                res.info.price = this.$fomatFloat(Number(res.info.price), info.basicCoinAccuracy)
                                res.info.quote_price = this.$fomatFloat(Number(res.info.quote_price), info.rmbAccuracy)
                            }
                            return res
                        })
                        // 过滤出涨幅数据
                        const tempList = tempSymbollist.filter(res => {
                            return res.info.rate > 0
                        })
                        // 计算成交额度
                        const tempList2 = tempSymbollist.map(res => {
                            res.info.deal_money = res.info.amount * res.info.price
                            return res
                        })
                        upList = [...upList, ...tempList]
                        dealList = [...dealList, ...tempList2]
                    }
                }
            }
            // 排序
            if (upList.length > 0) {
                upList.sort((a, b) => { return b.info.rate - a.info.rate });
            }
            if (upList.length > 0) {
                dealList.sort((a, b) => { return b.info.deal_money - a.info.deal_money });
            }
            // 获取排行前多少位
            if (upList.length > this.rankNum) upList = upList.slice(0, this.rankNum)
            if (dealList.length > this.rankNum) dealList = dealList.slice(0, this.rankNum)

            // 成交榜补零 2位
            dealList = dealList.map(res => {
                let info = this.coinConfig.info[res.symbol.toLowerCase()]
                if (info) {
                    res.info.price = this.$fomatFloat(Number(res.info.price), info.basicCoinAccuracy, 2)
                    res.info.quote_price = this.$fomatFloat(Number(res.info.quote_price), info.rmbAccuracy, 2)
                }
                return res
            })
            this.upList = upList
            this.dealList = dealList
        },
        toChart (item) {
            this.$store.commit('SET_SYMBOL', item.symbol.split("/").join("_").toLowerCase())
            this.$router.push({
                path: "/market/chart"
            });
        },
        colorStyle (data) {
            if (data.info.price < data.info.open) return "sell-color";
            else if (data.info.price > data.info.open) return "buy-color ";
            else return "";
        },
        init () {
            worker.postMessage({ type: "CREATE_WEBSOCKET" });
            worker.onmessage = (ev) => {
                const { data } = ev;
                if (data.type === "WEBSOCKET_ON_OPEN") {
                    worker.postMessage({ type: "HOMERANKINF", data: { operate: "getcoins_first" }, });
                    worker.postMessage({ type: "MARKETB" });
                }
                if (data.type === "WEBSOCKET_DATA") {
                    this.listenWSData(data.data);
                }
            };
        },
        listenWSData (data) {
            if (data.type == "rank_first") {
                let val = JSON.parse(data.data)
                let arr = []
                Object.keys(val).forEach((v) => {
                    let list = val[v].symbollist
                    arr = [...arr, ...list]
                    arr.forEach(v => {
                        let info = this.coinConfig.info[v.symbol.toLowerCase()]
                        if (info) {
                            v.info.price = this.$fomatFloat(Number(v.info.price || 0), info.basicCoinAccuracy)
                            v.info.quote_price = this.$fomatFloat(Number(v.info.quote_price || 0), info.rmbAccuracy)
                        }
                    });
                })
                this.$store.commit('SET_RANKING_DATA', arr)
            }
            if (data.type === "rank_b") {
                this.isResponse = true
                this.updateRankingTabData(JSON.parse(data.data))
            }
        },
        realTimeScroll (e) {
            let ul = document.getElementsByClassName('realTime_ul')[0]
            let ulWidth = ul.scrollWidth || 0
            let ulOffsetW = ul.offsetWidth || 0
            let left = e.srcElement.scrollLeft
            let x = left / (ulWidth - ulOffsetW)
            if (x < 0) x = 0
            if (x > 1) x = 1
            this.left = 30 * x
        },
        // banner 点击
        bannerClick (item) {
            this.$router.push(item.adLink)
        },
        noticeClick (item) {
            this.$router.push({ path: "noticeDetail", query: { id: item.id } });
        },
        async getHome () {
            this.swiperShow = false;
            const { data } = await getHome();
            this.swiperShow = true;
            this.bannerData = data.scrollBanner;
            this.noticeData = data.dataNotice;
        },
        toLink (name, params = {}) {
            this.$router.push({ name: name, params: params })
        },
        getAgentRank () {
            // achievement、commission、team_count，分别表示：业绩，佣金收入，推广团队
            const params = {
                rank_type: 'commission'
            }
            agentRank(params).then(res => {
                this.commissionList = res.data.list
            })
        },
        hiddenChange () {
            if (document.hidden) {
                worker.postMessage({ type: "CLOSE_WEBSOCKET" });
            } else {
                this.init()
            }
        }
    },
    created () {
        this.getHome();
        this.getAgentRank();
        // 加载缓存数据
        if (this.home.listData.commissionList) this.commissionList = this.home.listData.commissionList
        if (this.home.listData.dealList) this.dealList = this.home.listData.dealList
        if (this.home.listData.upList) this.upList = this.home.listData.upList
        this.$nextTick(() => {
            // 滚动到原来位置
            // this.$refs.overflowPatible.scrollTop = this.home.scrollTop
            this.$parent.$el.scrollTop = this.home.scrollTop
        })
    },
    mounted () {
        this.init()
        document.addEventListener("visibilitychange", this.hiddenChange, false);
        let guideDownload = sessionStorage.getItem('isGuideDownload')
        if(guideDownload == null){
            sessionStorage.setItem('isGuideDownload',1)
            this.isGuideDownload = 1
        }else{
            this.isGuideDownload = Number(guideDownload)
        }
    }
};
</script>

<style lang="scss" scoped>
.home {
    height: calc(100% - 50px);
    .van-skeleton {
        padding: 0;
        height: 56px;
        flex: 1;
        .van-skeleton__content{
            .van-skeleton__row{
                margin-top: 8px;
                height: 10px;
            }
            .van-skeleton__title,.van-skeleton__row{
                height: 10px;
            }
        }
    }
    .guideDownload{
        position: fixed;
        bottom: 80px;
        width: 90%;
        left: 5%;
        height: 70px;
        background: rgba(78, 130, 243, 0.8);
        border-radius: 8px;
        padding: 0 10px;
        z-index: 9;
        .guideDownload_l{
            height: 100%;
            img{
                height: 40px;
                margin-right: 10px;
            }
            div{
                color: #fff;
                p{
                    font-size: 12px;
                    &:nth-child(1){
                        font-size: 18px;
                        font-weight: bold;
                    }
                }
            }
        }
        .guideDownload_r{
            color: #fff;
            .van-button{
                width: 60px;
                height: 30px;
                margin-right: 10px;
                color: $main-blue;
                border-radius: 2px;
            }
        }
    }
    ::v-deep .van-tabs {
        .van-tab__text--ellipsis {
            font-size: 16px;
            font-weight: 500;
        }
    }
    .home_box {
        height: calc(100% - 45px);
        overflow: auto;
    }
    .realTime_box {
        padding: 10px 20px;
        border-top: 1px solid #f9f9f9;
        .proportion_box {
            height: 10px;
            padding-top: 10px;
            .proportion_bj {
                width: 60px;
                height: 2px;
                background: #e6e6e6;
                position: relative;
                border-radius: 2px;
                .proportion {
                    position: absolute;
                    top: 0;
                    height: 2px;
                    width: 30px;
                    background: #233b55;
                    border-radius: 2px;
                }
            }
        }
        .realTime_scroll_box {
            overflow: hidden;
            height: 60px;
        }
        .skeleton_body{
            height: 60px;
        }
        .realTime_ul {
            display: flex;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            // min-height: 55px;
            height: 100%;
            &::-webkit-scrollbar {
                display: none;
            }
            
            .realTime_li {
                padding-right: 10px;
                min-width: 120px;
                &:last-of-type {
                    padding: 0;
                }
                .realTime_li_t {
                    font-size: 12px;
                    line-height: 17px;
                    display: flex;
                    span {
                        font-size: 10px;
                        margin-left: 2px;
                    }
                }
                .realTime_li_c {
                    font-size: 18px;
                    line-height: 25px;
                    font-weight: 800;
                }
                .realTime_li_b {
                    line-height: 14px;
                    font-size: 12px;
                }
            }
        }
        .realTime_other {
            .realTime_li {
                flex: 1;
                min-width: auto;
                // padding-right: 0;
            }
        }
    }
    .swiper-container-horizontal {
        ::v-deep .swiper-pagination-bullet {
            width: 16px;
            height: 6px;
            border-radius: 3px;
            opacity: 0.2;
            display: inline-block;
            background: rgba(255, 255, 255, 0.8);
        }
        ::v-deep .slider-pagination-bullet-active-render {
            background: #fff;
            width: 26px;
            opacity: 1;
        }
    }
    .head {
        padding: 0 15px 0 15px;
        height: 45px;
        position: relative;
        background: #fff;
        img {
            display: inline-block;
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }
        a {
            background: url("~@/assets/imgs/home-user.png") no-repeat;
            background-size: contain;
            display: inline-block;
            width: 32px;
            height: 32px;
        }
        .logo {
            width: 120px;
            height: 32px;
            background: url("~@/assets/imgs/logo.png") no-repeat;
            background-size: contain;
        }
    }
    .top-container {
        padding: 0 15px;
    }
    .banner {
        height: 160px;
        background: #fbfbfb;
        overflow: hidden;
        border-radius: 10px;
        will-change: transform;
        .my-swipe {
            height: 100%;
            .banner-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            ::v-deep .van-swipe__indicator {
                width: 16px;
                border-radius: 3px;
            }
            ::v-deep .van-swipe__indicator--active {
                width: 26px;
                background-color: #fff;
            }
        }
    }
    .notice_body {
        padding: 12px 0;
        .notice {
            ::v-deep {
                .van-notice-bar {
                    height: 17px;
                    padding: 0;
                }
                .notice-swipe {
                    height: 17px;
                    line-height: 17px;
                }
            }
        }
    }
    .quick-buy {
        background: #f7f6fb;
        padding: 10px 0;
        .quick-buy-content {
            padding: 20px 15px;
            display: flex;
            align-items: center;
            background: #fff;
            .quick-icon {
                display: inline-block;
                width: 47px;
                height: 41px;
                background: url("~@/assets/imgs/home/quick-buy.png") no-repeat;
                background-size: contain;
            }
            .quick-text {
                flex: 1;
                padding: 0 10px;
                dd:first-of-type {
                    font-size: 16px;
                    color: $main-font-c;
                    font-weight: 500;
                }
                dd:last-of-type {
                    font-size: 12px;
                    color: $c-999;
                    margin-top: 2px;
                }
            }
            .buy-btn {
                width: 84px;
                height: 27px;
                line-height: 27px;
                text-align: center;
                background: $main-blue;
                border-radius: 14px;
                color: #fff;
                font-size: 12px;
            }
        }
    }
    .tab_body {
        padding: 10px 0;
        .tab {
            padding: 10px 0;
            div {
                flex: 1;
                text-align: center;
                font-size: 12px;
                img {
                    width: 24px;
                    height: 24px;
                }
            }
        }
    }
    .ranking-box {
        .ranking-content {
            .unit {
                color: #9c9ba5;
            }
            .item {
                flex: 1;
                text-align: right;
                font-weight: 500;
                &.center-l {
                    text-align: left;
                }
            }
            .list-title {
                padding: 13px 15px 0 15px;
                span {
                    font-size: 12px;
                    color: #9b9b9b;
                }
            }
            .list-content {
                padding: 0 15px;
                .list ~ .list {
                    border-top: 1px solid #f7f6fb;
                }
                .list {
                    height: 50px;
                    color: #233b55;
                    font-size: 14px;
                    .pro-box {
                        width: 68px;
                        height: 24px;
                        line-height: 24px;
                        text-align: center;
                        color: #fff;
                        border-radius: 3px;
                        display: inline-block;
                        &.success {
                            background: #eef7fe;
                            color: $main-blue;
                            width: 80px;
                        }
                    }
                }
            }
        }
        .tab-content-3 {
            img {
                width: 17px;
                height: 17px;
                margin-right: 20px;
            }
            .center-l {
                span {
                    width: 17px;
                    height: 17px;
                    text-align: center;
                    display: inline-block;
                }
            }
        }
    }
}
</style>
