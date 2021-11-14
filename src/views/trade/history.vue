<template>
  <div class="history_body">
    <template v-for="item in historyList">
      <router-link
        v-if="item.tradeNums !== 0"
        class="order-item"
        :key="item.id"
        :to="{ path: '/tradeDetail', query: { id: item.tradeId || item.trade_id, type } }"
      >
        <TradeOrder :orderData="item" />
      </router-link>
      <!-- 状态为取消不给跳转 -->
      <div class="order-item bgcolor" :key="item.id" v-else>
        <TradeOrder :orderData="item" />
      </div>
    </template>
    <div class="no-data" v-if="!historyList.length"></div>
  </div>
</template>
<script>
import TradeOrder from "./tradeOrder";
import { getTradeHistory, allocationTradeList } from "@/api/trade";
export default {
  components: { TradeOrder },
  data() {
    return {
      historyList: [],
      type: 'spot'
    };
  },
  methods: {
    async getTradeHistory() {
      const actions = this.type === 'spot' ? getTradeHistory : allocationTradeList
      let parmas = {}
      if (this.type === 'lever') {
        parmas.allocationId = ''
        parmas.types = 2
      }
      const { data } = await actions(parmas);
      this.historyList = data.data || [];
    },
  },
  created() {
    this.type = this.$route.query.type
    this.getTradeHistory();
  },
};
</script>
<style lang="scss" scoped>
.history_body {
  height: 100%;
  overflow-y: auto;
}
.order-item {
  display: block;
  padding-bottom: 10px;
}
.bgcolor{
  background: #f9f9f9;
}
</style>