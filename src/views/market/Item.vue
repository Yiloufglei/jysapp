<template>
    <div class="symbol-item flex_ul flex col-center" @click="toChart(source.symbol)">
        <div class="list_l">
            <p class="list_text_t"><span>{{ source.symbol.split('/')[0]}}</span><span class="list_l_tr"> / {{ source.symbol.split('/')[1] }}</span></p>
            <p class="list_text_b">24H额：{{$numberFormat(((source.info.amount * source.info.quote_price * (appConfig.coins || 1)) || 0))}}</p>
        </div>
        <div class="list_c">
            <p class="list_text_t" :class="colorStyle(source,1)">{{ source.info.price || 0}}</p>
            <p class="list_text_b">≈ ￥{{ source.info.quote_price}}</p>
        </div>
        <div class="list_r">
            <div class="pro_box" :class="colorStyle(source,2)">
                {{Number(source.info.rate || 0) > 0 ? '+'  : ''}}{{(source.info.rate || 0).toFixed(2) + '%'}}
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    props: {
      index: { // 每一行的索引
        type: Number
      },
      source: { // 每一行的内容
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
        ...mapState({
            appConfig: (state) => state.appConfig,
        }),
    },
    methods: {
        toChart (symbol) {
            this.$store.commit('SET_SYMBOL', symbol.split("/").join("_").toLowerCase())
            this.$router.push({
                path: "/market/chart"
            });
        },
        colorStyle (data,type) {
            if ((data.info.rate || 0) < 0) return type == 2 ? 'bg-sell' :  "sell-color";
            else if ((data.info.rate || 0) > 0) return type == 2 ? 'bg-buy' :  "buy-color ";
            else return type == 2 ? "bj-flat" :  "" ;
        },
    }
}
</script>

<style lang="scss" scoped>
.symbol-item {
    padding: 10px 15px 15px 15px;
    border-bottom: 1px solid #E6E6E6;
}
.flex_ul{
    font-size: 14px;
    .list_l{
        flex: 1;
        
    }
    .iconfont{
        line-height: 1; 
        font-size: 12px; 
        line-height: 8px;
        transform: scale(0.8,0.8);
    }
    .list_text_t{
        line-height: 20px;
        margin-bottom: 4px;
        font-weight: 500;
        .list_l_tr{
            color: #9C9BA5;
            font-size: 12px;
        }
    }
    .list_text_b{
        font-size: 12px;
        color: #9C9BA5;
        line-height: 17px;
    }
    .list_c,.list_r{
        flex: 1;
        justify-content: flex-end;
        text-align: right;
    }
    .pro_box{
        width: 68px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        color: #fff;
        border-radius: 3px;
        display: inline-block;
    }
}
</style>