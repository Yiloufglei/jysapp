<template>
    <section class="intro">
        <p class="between" style="font-size: 18px;">{{info.coin_name_en}}</p>
        <div class="intro-list">
            <dl class="between"><dd>发行时间</dd><dd class="right_text">{{$formatDate((info.send_at / 1000),'yyyy.MM.dd')}}</dd></dl>
            <dl class="between"><dd>发行总量</dd><dd class="right_text">{{info.send_total}}</dd></dl>
            <dl class="between"><dd>流通总量</dd><dd class="right_text">{{info.market_total}}</dd></dl>
            <dl class="between"><dd>众筹价格</dd><dd class="right_text">{{info.base_price}}</dd></dl>
            <dl class="between"><dd>白皮书</dd><dd class="right_text">{{info.web_white_pape}}</dd></dl>
            <dl class="between"><dd>官网</dd><dd class="right_text">{{info.web_site}}</dd></dl>
            <dl class="between"><dd>区块链查询</dd><dd class="right_text">{{info.web_block}}</dd></dl>
            <p class="intro-text-title">简介</p>
            <p class="intro-text-content">{{info.profile}}</p>
        </div>
    </section>
</template>
<script>

export default {
    props:{
        info: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    computed:{},
    data () {
        return {
        };
    },
    mounted(){}
};
</script>
<style lang="scss" scoped>
.intro {
    font-size: 14px;
    .between{
        padding: 15px 15px;
        line-height: 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #212C37;
        .right_text{
            color: #fff;
            max-width: 60%;
            word-break: break-all;
            text-align: right;
        }
    }
    .intro-text-title{
        padding: 0 15px;
        line-height: 48px;
    }
    .intro-text-content{
        padding: 0 15px;
        color: #fff;
        line-height: 20px;
        padding-bottom: 22px;
        word-wrap:break-word
    }
}
</style>