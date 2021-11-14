<!-- 
  	author        MrYi
	time          2021/03/18
	description   资金明细
 -->
<template>
  <div class="capitalDetail">
    <div class="interval_bj"></div>
    <ul class="no-data">
      <li class="border_b_c" v-for="(item, index) in list" :key="index">
        <p class="li_t flexC_S">
          <span>{{ item.types | transTitle }}</span
          ><span>{{ item.money }} USDT</span>
        </p>
        <p class="li_b flexC_S color_c">
          <span>{{$formatDate(item.created_at,'/') || '--'}}</span
          ><span>余额：{{ item.left_money }} USTD</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import { getLeverAssetsBill } from "@/api/leverage";
export default {
  name: "capitalDetail",
  data() {
    return {
      list: [],
    };
  },
  filters: {
    // 1.期初保证金；2.期初配资资金；3.购买币对；4.手续费买；
    // 5.卖出币对；6.手续费卖；7.追加保证金；8.追加配资资金；
    // 9.自动续费；10配资资金清算；11.保证金清算。
    transTitle(type) {
      switch (type) {
        case 1:
          return "初期保证金";
        case 2:
          return "初期配资资金";
        case 3:
          return "追加保证金";
        case 4:
          return "追加配资资金";
        case 5:
          return "追加配资资金";
        case 6:
          return "手续费买";
        case 7:
          return "手续费卖";
        case 8:
          return "手续费卖";
        case 9:
          return "自动续费";
        case 10:
          return "配资资金清算";
        case 11:
          return "保证金清算";
        default:
          return "";
      }
    },
  },
  methods: {
    async getLeverAssetsBill() {
      const { data } = await getLeverAssetsBill({
        allocationId: this.$route.query.id,
      });
      this.list = data.data;
    },
  },
  created() {
    this.getLeverAssetsBill();
  },
};
</script>

<style lang="scss" scoped>
.capitalDetail {
  ul {
    padding: 0 16px;
    li {
      padding: 20px 0;
      .li_t {
        font-size: 16px;
        line-height: 22px;
        margin-bottom: 18px;
      }
      .li_b {
        font-size: 12px;
        line-height: 17px;
      }
    }
  }
}
</style>
